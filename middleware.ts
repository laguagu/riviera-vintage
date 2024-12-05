import { authConfig } from "@/app/(auth)/auth.config";
import NextAuth from "next-auth";

export default NextAuth(authConfig).auth;

export const config = {
  matcher: [
    "/",
    "/:id",
    "/api/:path*",
    "/login",
    "/register",
    "/((?!_next/static|_next/image|favicon.ico|shapes.svg|.*\\.png$|.*\\.jpg$).*)",
  ],
};
