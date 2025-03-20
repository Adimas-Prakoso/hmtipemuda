import { NextResponse } from "next/server";

/**
 * POST handler for logging out admin users
 * This endpoint clears the admin_token cookie
 */
export async function POST() {
  try {
    // Create a response
    const response = NextResponse.json(
      { success: true, message: "Logout successful" },
      { status: 200 }
    );

    // Clear the admin_token cookie
    response.cookies.set({
      name: "admin_token",
      value: "",
      expires: new Date(0), // Set expiration to the past
      path: "/",
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
    });

    // Log the logout event (in production, you might want to log to a database)
    console.log(`Admin logged out at ${new Date().toISOString()}`);

    return response;
  } catch (error) {
    console.error("Logout error:", error);
    return NextResponse.json(
      { success: false, error: "An error occurred during logout" },
      { status: 500 }
    );
  }
}
