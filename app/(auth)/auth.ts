import { getUser } from "@/app/db";
import { compare } from "bcrypt-ts";
import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { authConfig } from "./auth.config";

export const {
  handlers: { GET, POST },
  auth,
  signIn,
  signOut,
} = NextAuth({
  ...authConfig,
  providers: [
    Credentials({
      async authorize(credentials) {
        try {
          const { email, password } = credentials as {
            email: string;
            password: string;
          };

          const user = await getUser(email);
          if (!user || user.length === 0) return null;

          const passwordsMatch = await compare(password, user[0].password!);
          if (!passwordsMatch) return null;

          return {
            id: user[0].email,
            email: user[0].email,
            role: user[0].role,
          };
        } catch (error) {
          console.error("Auth error:", error);
          return null;
        }
      },
    }),
  ],
});
