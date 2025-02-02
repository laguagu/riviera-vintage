import { DefaultSession, NextAuthConfig, Session } from "next-auth";
import { JWT } from "next-auth/jwt";

export interface CustomSession extends Session {
  user?: {
    id?: string;
    email?: string | null;
    role?: string;
  } & DefaultSession["user"];
}

interface SessionCallbackParams {
  session: CustomSession;
  token: JWT & { role?: string };
}

export const authConfig = {
  pages: {
    signIn: "/login",
    newUser: "/",
    signOut: "/",
  },
  providers: [
    // added later in auth.ts since it requires bcrypt which is only compatible with Node.js
    // while this file is also used in non-Node.js environments
  ],
  trustHost: true,
  callbacks: {
    authorized({ auth, request: { nextUrl } }) {
      let isLoggedIn = !!auth?.user;
      let isOnChat = nextUrl.pathname.startsWith("/");
      let isOnLogin = nextUrl.pathname.startsWith("/login");
      let isOnRegister = nextUrl.pathname.startsWith("/register");

      // Ohjaa kaikki /register -pyynnöt login-sivulle poista tämä jos haluat rekisteröitymisen
      // if (nextUrl.pathname.startsWith("/register")) {
      //   return Response.redirect(new URL("/login", nextUrl));
      // }

      if (isLoggedIn && (isOnLogin || isOnRegister)) {
        return Response.redirect(new URL("/", nextUrl));
      }

      if (isOnLogin || isOnRegister) {
        return true;
      }

      if (isOnChat) {
        if (isLoggedIn) return true;
        return false; // Redirect unauthenticated users to login page
      }

      if (isLoggedIn) {
        return Response.redirect(new URL("/", nextUrl));
      }

      return true;
    },
    async jwt({ token, user }) {
      if (user) {
        token.role = (user as { role?: string }).role;
      }
      return token;
    },
    async session({ session, token }: SessionCallbackParams) {
      if (session.user) {
        session.user.role = token.role;
      }
      return session;
    },
    async redirect({ url, baseUrl }) {
      // Varmista että uloskirjautumisen jälkeen ohjataan aina juureen
      if (url.startsWith(baseUrl)) return url;
      // Muussa tapauksessa ohjaa juureen
      return baseUrl;
    },
  },
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 päivää
    updateAge: 24 * 60 * 60, // 24 tuntia
  },
} satisfies NextAuthConfig;
