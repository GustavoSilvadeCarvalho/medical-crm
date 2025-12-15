import type { NextAuthConfig } from "next-auth";

export const authConfig = {
  pages: {
    signIn: "/login",
  },
  callbacks: {
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user;
      const isOnDashboard = nextUrl.pathname.startsWith("/");
      const isLoginPage = nextUrl.pathname.startsWith("/login");

      if (isOnDashboard && !isLoginPage) {
        if (isLoggedIn) return true;
        return false;
      } else if (isLoggedIn && isLoginPage) {
        return Response.redirect(new URL("/", nextUrl));
      }
      return true;
    },
    jwt({ token, user }) {
      if (user) token.role = user.role;
      return token;
    },
    session({ session, token }) {
      if (session.user && token.sub) {
        session.user.id = token.sub;
      }
      if (session.user && token.role) {
        session.user.role = token.role;
      }
      return session;
    },
  },
  providers: [],
} satisfies NextAuthConfig;
