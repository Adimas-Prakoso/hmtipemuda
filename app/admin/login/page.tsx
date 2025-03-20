"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { FaLock, FaIdCard, FaArrowRight, FaEye, FaEyeSlash, FaShieldAlt, FaGamepad, FaCheck } from "react-icons/fa";
import { GoogleReCaptchaProvider, useGoogleReCaptcha } from "react-google-recaptcha-v3";
import { useRouter } from "next/navigation";
import MemoryMatchGame from "./components/MemoryMatchGame";

// Function to check if we're running on the client side
const isClient = typeof window !== 'undefined';

// Function to detect suspicious browser environment
const detectSuspiciousEnvironment = () => {
  if (!isClient) return false;
  
  // Check for DevTools
  const devToolsOpen = (
    /Chrome/.test(navigator.userAgent) && /Google Inc/.test(navigator.vendor) &&
    window.outerHeight - window.innerHeight > 100
  );
  
  // Check for headless browser or automation tools
  const isHeadless = (
    navigator.webdriver ||
    navigator.userAgent.toLowerCase().includes("headless") ||
    /PhantomJS|Nightmare|Selenium|WebDriver/.test(navigator.userAgent)
  );
  
  return devToolsOpen || isHeadless;
};

// Login form component that uses reCAPTCHA v3
const LoginForm = () => {
  const router = useRouter();
  const [nim, setNim] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [captchaToken, setCaptchaToken] = useState<string | null>(null);
  const [loginAttempts, setLoginAttempts] = useState(0);
  const [lockoutUntil, setLockoutUntil] = useState<number | null>(null);
  const [passwordStrength, setPasswordStrength] = useState<number>(0);
  const [isSuspiciousEnvironment, setIsSuspiciousEnvironment] = useState(false);
  const [showMemoryGame, setShowMemoryGame] = useState(false);
  const [memoryGameVerified, setMemoryGameVerified] = useState(false);
  
  // Check for suspicious environment on component mount
  useEffect(() => {
    if (isClient) {
      // Retrieve login attempts from localStorage
      const storedAttempts = localStorage.getItem('loginAttempts');
      const storedLockout = localStorage.getItem('lockoutUntil');
      
      if (storedAttempts) setLoginAttempts(parseInt(storedAttempts, 10));
      if (storedLockout) {
        const lockoutTime = parseInt(storedLockout, 10);
        if (lockoutTime > Date.now()) {
          setLockoutUntil(lockoutTime);
        } else {
          // Clear expired lockout
          localStorage.removeItem('lockoutUntil');
        }
      }
      
      // Check for suspicious environment
      const suspicious = detectSuspiciousEnvironment();
      setIsSuspiciousEnvironment(suspicious);
      
      // If suspicious, log it (in production, you might want to send this to your server)
      if (suspicious) {
        console.warn("Suspicious environment detected");
      }
    }
  }, []);
  
  // Countdown timer for lockout
  useEffect(() => {
    if (!lockoutUntil) return;
    
    const interval = setInterval(() => {
      if (lockoutUntil <= Date.now()) {
        setLockoutUntil(null);
        localStorage.removeItem('lockoutUntil');
        clearInterval(interval);
      } else {
        // Force re-render to update countdown
        setLockoutUntil(lockoutUntil);
      }
    }, 1000);
    
    return () => clearInterval(interval);
  }, [lockoutUntil]);
  
  // Calculate password strength
  const calculatePasswordStrength = (password: string): number => {
    if (!password) return 0;
    
    let strength = 0;
    
    // Length check
    if (password.length >= 8) strength += 1;
    if (password.length >= 12) strength += 1;
    
    // Character variety checks
    if (/[A-Z]/.test(password)) strength += 1; // Has uppercase
    if (/[a-z]/.test(password)) strength += 1; // Has lowercase
    if (/[0-9]/.test(password)) strength += 1; // Has number
    if (/[^A-Za-z0-9]/.test(password)) strength += 1; // Has special char
    
    // Normalize to 0-100
    return Math.min(Math.floor((strength / 6) * 100), 100);
  };
  
  // Handle password change
  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newPassword = e.target.value;
    setPassword(newPassword);
    setPasswordStrength(calculatePasswordStrength(newPassword));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Check if account is locked out
    if (lockoutUntil && lockoutUntil > Date.now()) {
      setError(`Terlalu banyak percobaan gagal. Coba lagi dalam ${Math.ceil((lockoutUntil - Date.now()) / 1000 / 60)} menit.`);
      return;
    }
    
    // Basic validation
    if (!nim || nim.length < 5) {
      setError("NIM harus minimal 5 karakter");
      return;
    }
    
    if (!password || password.length < 6) {
      setError("Password harus minimal 6 karakter");
      return;
    }
    
    // Check if memory game verification is completed
    if (!memoryGameVerified) {
      setError("Silakan selesaikan verifikasi anda bukan robot terlebih dahulu");
      return;
    }
    
    // Execute reCAPTCHA v3 for login attempts
    let token = captchaToken;
    if (loginAttempts >= 2 || !token) {
      token = await executeCaptcha();
      if (!token && loginAttempts >= 2) {
        setError("Verifikasi keamanan gagal. Silakan coba lagi.");
        return;
      }
    }
    
    setLoading(true);
    setError("");

    try {
      // Add a small random delay to prevent timing attacks
      await new Promise(resolve => setTimeout(resolve, 300 + Math.random() * 700));
      
      const response = await fetch("/api/auth", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ 
          nim, 
          password,
          captchaToken,
          clientInfo: {
            userAgent: navigator.userAgent,
            language: navigator.language,
            screenSize: `${window.screen.width}x${window.screen.height}`,
            timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
          }
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        // Handle rate limiting
        if (response.status === 429) {
          const lockTime = Date.now() + (30 * 60 * 1000); // 30 minutes
          setLockoutUntil(lockTime);
          localStorage.setItem('lockoutUntil', lockTime.toString());
          throw new Error(data.error || "Terlalu banyak percobaan login. Silakan coba lagi nanti.");
        }
        
        // Handle other errors
        throw new Error(data.error || "Login gagal");
      }

      // Reset login attempts on successful login
      setLoginAttempts(0);
      localStorage.removeItem('loginAttempts');
      localStorage.removeItem('lockoutUntil');
      
      // Redirect to dashboard after successful login
      router.push("/admin/dashboard");
    } catch (err) {
      // Increment login attempts
      const newAttempts = loginAttempts + 1;
      setLoginAttempts(newAttempts);
      localStorage.setItem('loginAttempts', newAttempts.toString());
      
      // Apply local lockout after 5 failed attempts
      if (newAttempts >= 5) {
        const lockTime = Date.now() + (15 * 60 * 1000); // 15 minutes
        setLockoutUntil(lockTime);
        localStorage.setItem('lockoutUntil', lockTime.toString());
      }
      
      setError(err instanceof Error ? err.message : "Login gagal. Periksa kembali NIM dan password Anda.");
    } finally {
      setLoading(false);
      // Reset CAPTCHA after each attempt
      setCaptchaToken(null);
      
      // reCAPTCHA v3 tidak memerlukan reset manual seperti v2
      // Token baru akan dihasilkan setiap kali executeCaptcha() dipanggil
    }
  };
  
  // Use reCAPTCHA v3 hook
  const { executeRecaptcha } = useGoogleReCaptcha();
  
  // Function to execute reCAPTCHA when needed
  const executeCaptcha = async () => {
    if (!executeRecaptcha) {
      console.error("Execute recaptcha not available");
      return null;
    }
    
    try {
      const token = await executeRecaptcha('login');
      setCaptchaToken(token);
      return token;
    } catch (error) {
      console.error("Error executing reCAPTCHA:", error);
      return null;
    }
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row">
      {/* Left side - decorative background */}
      <div className="hidden md:flex md:w-1/2 bg-gradient-to-br from-blue-800 to-indigo-900 p-12 flex-col justify-between relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('/grid-pattern.svg')] opacity-10"></div>
        <div className="relative z-10">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 relative">
              <Image
                src="/logo.png"
                alt="HMTI Logo"
                fill
                style={{ objectFit: "contain" }}
                priority
              />
            </div>
            <h1 className="text-white text-2xl font-bold">HMTI Pemuda</h1>
          </div>
          
          <div className="mt-24">
            <h2 className="text-4xl font-bold text-white mb-6">Panel Admin HMTI</h2>
            <p className="text-blue-100 text-xl max-w-md">
              Akses khusus untuk pengelolaan sistem dan data anggota Himpunan Mahasiswa Teknik Informatika.
            </p>
          </div>
        </div>
        
        <div className="text-blue-200 text-sm relative z-10">
          &copy; {new Date().getFullYear()} HMTI Pemuda. All rights reserved.
        </div>
      </div>
      
      {/* Right side - login form */}
      <div className="flex-1 flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-20 xl:px-24 bg-gray-50">
        <div className="md:hidden flex justify-center mb-8">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 relative">
              <Image
                src="/logo.png"
                alt="HMTI Logo"
                fill
                style={{ objectFit: "contain" }}
                priority
              />
            </div>
            <h1 className="text-gray-800 text-xl font-bold">HMTI Pemuda</h1>
          </div>
        </div>
        
        <div className="max-w-md w-full mx-auto">
          <div className="text-center md:text-left mb-8">
            <h2 className="text-3xl font-extrabold text-gray-900">
              Selamat Datang
            </h2>
            <p className="mt-2 text-sm text-gray-600">
              Masuk untuk mengelola sistem HMTI Pemuda
            </p>
          </div>
          
          {error && (
            <div className="bg-red-50 border-l-4 border-red-500 text-red-700 p-4 mb-6 rounded-md shadow-sm" role="alert">
              <div className="flex">
                <div className="py-1">
                  <svg className="h-5 w-5 text-red-500 mr-3" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                </div>
                <div>
                  <p className="text-sm">{error}</p>
                </div>
              </div>
            </div>
          )}
          
          {isSuspiciousEnvironment && (
            <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-6 rounded-md shadow-sm">
              <div className="flex">
                <div className="flex-shrink-0">
                  <FaShieldAlt className="h-5 w-5 text-yellow-400" />
                </div>
                <div className="ml-3">
                  <p className="text-sm text-yellow-700">
                    Terdeteksi lingkungan yang tidak biasa. Jika Anda adalah administrator yang sah, silakan lanjutkan.
                  </p>
                </div>
              </div>
            </div>
          )}
          
          {lockoutUntil && lockoutUntil > Date.now() && (
            <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6 rounded-md shadow-sm">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-red-500" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3">
                  <p className="text-sm text-red-700">
                    Akun terkunci karena terlalu banyak percobaan gagal. Coba lagi dalam {Math.ceil((lockoutUntil - Date.now()) / 1000 / 60)} menit.
                  </p>
                </div>
              </div>
            </div>
          )}
          
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div>
              <label htmlFor="nim" className="block text-sm font-medium text-gray-700">
                NIM / ID Admin
              </label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaIdCard className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="nim"
                  name="nim"
                  type="text"
                  required
                  value={nim}
                  onChange={(e) => setNim(e.target.value)}
                  className="appearance-none block w-full pl-10 px-3 py-3 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm transition-all duration-200"
                  placeholder="Masukkan NIM atau ID Admin"
                  autoComplete="username"
                  disabled={loading || (!!lockoutUntil && lockoutUntil > Date.now())}
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between">
                <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                  Password
                </label>
                <div className="text-sm">
                  <a href="#" className="font-medium text-blue-600 hover:text-blue-500">
                    Lupa password?
                  </a>
                </div>
              </div>
              <div className="mt-1 relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaLock className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  required
                  value={password}
                  onChange={handlePasswordChange}
                  className="appearance-none block w-full pl-10 pr-10 px-3 py-3 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm transition-all duration-200"
                  placeholder="Masukkan password"
                  autoComplete="current-password"
                  disabled={loading || (!!lockoutUntil && lockoutUntil > Date.now())}
                />
                <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="text-gray-400 hover:text-gray-500 focus:outline-none"
                    tabIndex={-1}
                  >
                    {showPassword ? (
                      <FaEyeSlash className="h-5 w-5" />
                    ) : (
                      <FaEye className="h-5 w-5" />
                    )}
                  </button>
                </div>
              </div>
              
              {/* Password strength meter */}
              {password.length > 0 && (
                <div className="mt-2">
                  <div className="w-full bg-gray-200 rounded-full h-2.5">
                    <div 
                      className={`h-2.5 rounded-full ${passwordStrength < 40 ? 'bg-red-500' : passwordStrength < 70 ? 'bg-yellow-500' : 'bg-green-500'}`} 
                      style={{ width: `${passwordStrength}%` }}
                    ></div>
                  </div>
                  <p className="mt-1 text-xs text-gray-500">
                    {passwordStrength < 40 ? 'Password lemah' : 
                     passwordStrength < 70 ? 'Password sedang' : 
                     'Password kuat'}
                  </p>
                </div>
              )}
            </div>
            
            {/* reCAPTCHA v3 tidak memerlukan elemen UI yang terlihat */}
            {loginAttempts >= 2 && (
              <div className="mt-4 text-center text-sm text-gray-500">
                <p>Verifikasi keamanan berjalan di latar belakang</p>
              </div>
            )}
            
            {/* Custom Memory Match Game verification */}
            <div className="mt-4">
              <button
                type="button"
                onClick={() => setShowMemoryGame(true)}
                disabled={memoryGameVerified}
                className={`group relative w-full flex justify-center items-center py-3 px-4 border border-transparent text-sm font-medium rounded-md ${memoryGameVerified ? 'bg-green-600 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'} focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-200`}
              >
                {memoryGameVerified ? (
                  <>
                    <FaCheck className="mr-2 h-4 w-4" />
                    Verifikasi Berhasil
                  </>
                ) : (
                  <>
                    <FaGamepad className="mr-2 h-4 w-4" />
                    Verifikasi anda bukan robot
                  </>
                )}
              </button>
            </div>
            
            {/* Memory Match Game Modal */}
            {showMemoryGame && (
              <MemoryMatchGame
                onSuccess={() => {
                  setMemoryGameVerified(true);
                }}
                onClose={() => setShowMemoryGame(false)}
              />
            )}

            <div>
              <button
                type="submit"
                disabled={loading || (!!lockoutUntil && lockoutUntil > Date.now())}
                className={`group relative w-full flex justify-center items-center py-3 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-200 ${(loading || (lockoutUntil && lockoutUntil > Date.now())) ? 'opacity-70 cursor-not-allowed' : ''}`}
              >
                {loading ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Memproses...
                  </>
                ) : !!lockoutUntil && lockoutUntil > Date.now() ? (
                  <>Akun Terkunci</>
                ) : (
                  <>
                    <FaShieldAlt className="mr-2 h-4 w-4" />
                    Login Admin
                    <FaArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform duration-200" />
                  </>
                )}
              </button>
            </div>
            
            {/* Security tips */}
            <div className="mt-4 text-xs text-gray-500 border-t pt-4">
              <p className="font-medium mb-1">Tips Keamanan:</p>
              <ul className="list-disc pl-5 space-y-1">
                <li>Pastikan URL halaman login benar</li>
                <li>Jangan bagikan kredensial login Anda</li>
                <li>Gunakan password yang kuat dan unik</li>
                <li>Selalu logout setelah selesai</li>
              </ul>
            </div>
          </form>

          <div className="mt-8 pt-6 border-t border-gray-200">
            <div className="flex items-center justify-center">
              <Link href="/" className="flex items-center text-sm font-medium text-blue-600 hover:text-blue-500 transition-colors duration-200">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
                Kembali ke Beranda
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Main component that wraps the login form with reCAPTCHA provider
export default function AdminLogin() {
  return (
    <GoogleReCaptchaProvider
      reCaptchaKey={process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY || ''}
      scriptProps={{
        async: true,
        defer: true,
        appendTo: 'head',
      }}
    >
      <LoginForm />
    </GoogleReCaptchaProvider>
  );
}
