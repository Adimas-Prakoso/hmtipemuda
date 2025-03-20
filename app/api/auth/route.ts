import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import admins from "@/data/admin.json";
import axios from "axios";

// Ensure JWT_SECRET is set in production
const JWT_SECRET = process.env.JWT_SECRET || "default_secret_key";
if (process.env.NODE_ENV === "production" && JWT_SECRET === "default_secret_key") {
  console.error("WARNING: Using default JWT secret in production environment");
}

// Rate limiting implementation
const RATE_LIMIT_WINDOW = 15 * 60 * 1000; // 15 minutes in milliseconds
const MAX_REQUESTS = 5; // Maximum 5 failed attempts in the window

interface RateLimitRecord {
  count: number;
  firstAttempt: number;
  blockedUntil?: number;
}

// In-memory store for rate limiting (consider using Redis in production)
const rateLimitStore: Record<string, RateLimitRecord> = {};

export async function GET(request: NextRequest) {
  try {
    // Get the token from the cookie
    const token = request.cookies.get("admin_token")?.value;
    
    if (!token) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    try {
      // Verify and decode the token with strict verification
      const decoded = jwt.verify(token, JWT_SECRET, { 
        algorithms: ["HS256"],
        ignoreExpiration: false
      }) as {
        nim: string;
        nama: string;
        role: string;
        iat: number;
        exp: number;
      };

      // Check if admin still exists in the system
      const adminExists = admins.some(admin => admin.nim === decoded.nim);
      if (!adminExists) {
        throw new Error("Admin no longer exists");
      }

      // Return the admin data
      return NextResponse.json({
        id: decoded.nim, // Using NIM as ID
        nama: decoded.nama,
        nim: decoded.nim,
        role: decoded.role,
        // Don't include token expiration details in response
      });
    } catch (jwtError: unknown) {
      // Handle specific JWT errors
      if (jwtError instanceof Error && jwtError.name === "TokenExpiredError") {
        return NextResponse.json(
          { error: "Session expired", code: "TOKEN_EXPIRED" },
          { status: 401 }
        );
      }
      
      // For any other token verification errors
      return NextResponse.json(
        { error: "Invalid session", code: "INVALID_TOKEN" },
        { status: 401 }
      );
    }
  } catch (error) {
    console.error("Auth verification error:", error);
    return NextResponse.json(
      { error: "Unauthorized", code: "SERVER_ERROR" },
      { status: 401 }
    );
  }
}

export async function POST(request: NextRequest) {
  // Get client IP for rate limiting
  // Extract IP address from headers or request
  let clientIp = 'unknown';
  let userAgent = 'unknown';
  
  // Get IP from headers in the request object (reliable in Next.js)
  const forwardedFor = request.headers.get('x-forwarded-for') || '';
  if (forwardedFor) {
    clientIp = forwardedFor.split(',')[0].trim();
  }
  
  // Get user agent from request
  userAgent = request.headers.get('user-agent') || 'unknown';
  
  // Check if the IP is rate limited
  if (isRateLimited(clientIp)) {
    console.warn(`Rate limit exceeded for IP: ${clientIp}, UA: ${userAgent}`);
    return NextResponse.json(
      { 
        error: "Terlalu banyak percobaan login. Silakan coba lagi nanti.", 
        code: "RATE_LIMITED" 
      },
      { status: 429 }
    );
  }

  try {
    // Validate request body
    const body = await request.json();
    const { nim, password, captchaToken } = body;
    
    // Log client info if provided (for security monitoring)
    const clientInfo = body.clientInfo;
    if (clientInfo) {
      console.log(`Login attempt from: ${JSON.stringify(clientInfo)}`);
    }
    
    if (!nim || !password) {
      return NextResponse.json(
        { error: "NIM dan password diperlukan", code: "MISSING_CREDENTIALS" },
        { status: 400 }
      );
    }

    // Check if credentials are valid format before checking database
    if (typeof nim !== 'string' || typeof password !== 'string' || 
        nim.length < 5 || password.length < 6) {
      return NextResponse.json(
        { error: "Format kredensial tidak valid", code: "INVALID_FORMAT" },
        { status: 400 }
      );
    }
    
    // Verify CAPTCHA if token is provided
    if (captchaToken) {
      try {
        const recaptchaSecretKey = process.env.RECAPTCHA_SECRET_KEY;
        
        if (!recaptchaSecretKey) {
          console.warn("RECAPTCHA_SECRET_KEY is not set in environment variables");
        } else {
          // Verify with Google reCAPTCHA API
          const recaptchaResponse = await axios.post(
            `https://www.google.com/recaptcha/api/siteverify?secret=${recaptchaSecretKey}&response=${captchaToken}`,
            {},
            {
              headers: {
                "Content-Type": "application/x-www-form-urlencoded"
              }
            }
          );
          
          if (!recaptchaResponse.data.success) {
            console.warn(`CAPTCHA verification failed: ${JSON.stringify(recaptchaResponse.data)}`); 
            return NextResponse.json(
              { error: "Verifikasi CAPTCHA gagal", code: "CAPTCHA_FAILED" },
              { status: 400 }
            );
          }
        }
      } catch (error) {
        console.error("Error verifying CAPTCHA:", error);
      }
    }

    // Find admin with matching NIM
    const admin = admins.find((a) => a.nim === nim);
    if (!admin) {
      // Increment failed attempt counter
      recordFailedAttempt(clientIp);
      
      // Use consistent error message that doesn't reveal which part is wrong
      return NextResponse.json(
        { error: "Kredensial tidak valid", code: "INVALID_CREDENTIALS" },
        { status: 401 }
      );
    }

    // Verify password with constant-time comparison (bcrypt.compare is already constant-time)
    const isPasswordValid = await bcrypt.compare(password, admin.password);
    if (!isPasswordValid) {
      // Increment failed attempt counter
      recordFailedAttempt(clientIp);
      
      // Use consistent error message that doesn't reveal which part is wrong
      return NextResponse.json(
        { error: "Kredensial tidak valid", code: "INVALID_CREDENTIALS" },
        { status: 401 }
      );
    }

    // Reset rate limit counter on successful login
    resetRateLimit(clientIp);

    // Generate JWT token with improved security
    const now = Math.floor(Date.now() / 1000);
    const expiresIn = 30 * 60; // 30 minutes in seconds
    
    const token = jwt.sign(
      { 
        nim: admin.nim,
        nama: admin.nama,
        role: "admin",
        iat: now,
        nbf: now, // Not before - token isn't valid before this time
        jti: generateTokenId(), // Unique token ID to prevent replay attacks
      },
      JWT_SECRET,
      { 
        expiresIn: expiresIn,
        algorithm: "HS256" // Explicitly specify algorithm
      }
    );

    // Set response
    const response = NextResponse.json({
      message: "Login berhasil",
      admin: {
        nim: admin.nim,
        nama: admin.nama
      }
    });

    // Set JWT token in cookie with enhanced security
    response.cookies.set("admin_token", token, {
      httpOnly: true, // Prevents JavaScript access
      secure: process.env.NODE_ENV === "production", // HTTPS only in production
      sameSite: "strict", // Enhanced from "lax" to "strict" for better CSRF protection
      maxAge: expiresIn, // Match token expiration
      path: "/",
      // In production, consider adding domain restriction if applicable
    });

    // Log successful login (in production, use a proper logging system)
    console.log(`Successful login for admin: ${admin.nim} from IP: ${clientIp}`);

    return response;
  } catch (error) {
    console.error(`Login error from IP ${clientIp}:`, error);
    return NextResponse.json(
      { error: "Terjadi kesalahan pada server", code: "SERVER_ERROR" },
      { status: 500 }
    );
  }
}

// Rate limiting functions
function isRateLimited(ip: string): boolean {
  const record = rateLimitStore[ip];
  
  if (!record) {
    return false;
  }
  
  // Check if IP is currently blocked
  if (record.blockedUntil && record.blockedUntil > Date.now()) {
    return true;
  }
  
  // Check if attempts exceed limit within window
  const windowExpired = (Date.now() - record.firstAttempt) > RATE_LIMIT_WINDOW;
  
  if (!windowExpired && record.count >= MAX_REQUESTS) {
    // Block for 30 minutes after exceeding limit
    record.blockedUntil = Date.now() + (30 * 60 * 1000);
    return true;
  }
  
  // Reset if window expired
  if (windowExpired) {
    resetRateLimit(ip);
  }
  
  return false;
}

function recordFailedAttempt(ip: string): void {
  const now = Date.now();
  const record = rateLimitStore[ip];
  
  if (!record) {
    rateLimitStore[ip] = { count: 1, firstAttempt: now };
    return;
  }
  
  // Check if we need to reset the window
  if ((now - record.firstAttempt) > RATE_LIMIT_WINDOW) {
    rateLimitStore[ip] = { count: 1, firstAttempt: now };
  } else {
    record.count += 1;
  }
}

function resetRateLimit(ip: string): void {
  delete rateLimitStore[ip];
}

// Generate a unique token ID to prevent replay attacks
function generateTokenId(): string {
  return Date.now().toString(36) + Math.random().toString(36).substring(2, 15);
}
