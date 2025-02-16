import { authMiddleware } from "@clerk/nextjs";

// This example protects all routes including api/trpc routes
// Please edit this to allow other routes to be public as needed.
// See https://clerk.com/docs/references/nextjs/auth-middleware for more information about configuring your middleware
export default authMiddleware({
  publicRoutes: ["/", "/sign-in", "/sign-up"],
  ignoredRoutes: ["/api/public"]
});

export const config = {
  matcher: [
    "/((?!.+\\.[\\w]+$|_next).*)", // Exclude static files and _next
    "/",                            // Include root path
    "/(api|trpc)(.*)"              // Include API and tRPC routes
  ]
};