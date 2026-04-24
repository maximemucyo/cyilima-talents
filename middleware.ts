import NextAuth from "next-auth";
import { authConfig } from "./auth.config";

const { auth } = NextAuth(authConfig);

export default auth((req) => {
  const isLoggedIn = !!req.auth
  const isOnDashboard = req.nextUrl.pathname.startsWith("/") && 
                       !req.nextUrl.pathname.startsWith("/login") && 
                       !req.nextUrl.pathname.startsWith("/register") &&
                       !req.nextUrl.pathname.startsWith("/api")

  if (isOnDashboard) {
    if (isLoggedIn) return
    return Response.redirect(new URL("/login", req.nextUrl))
  }
})

// Optional: Don't run middleware on some paths
export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
}

