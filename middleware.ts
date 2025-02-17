import { authMiddleware } from "@clerk/nextjs";
import { NextResponse } from "next/server";

// This example protects all routes including api/trpc routes
// Please edit this to allow other routes to be public as needed.
// See https://clerk.com/docs/references/nextjs/auth-middleware for more information about configuring your middleware
export default authMiddleware({
  // Add public routes that don't require authentication
  publicRoutes: ["/", "/sign-in(.*)", "/sign-up(.*)"],
  // Ensure Clerk handles the sign-in routes
  ignoredRoutes: ["/api(.*)"],
  afterAuth(auth, req) {
    // If the user is not signed in and trying to access a protected route
    if (!auth.userId && !auth.isPublicRoute) {
      // Redirect them to the home page
      return NextResponse.redirect(new URL('/', req.url));
    }
  }
});

export const config = {
  matcher: [
    "/((?!.+\\.[\\w]+$|_next).*)", // Exclude static files and _next
    "/",                            // Include root path
    "/(api|trpc)(.*)"              // Include API and tRPC routes
  ]
};