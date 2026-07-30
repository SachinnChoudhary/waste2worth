import type { NextAuthConfig } from "next-auth";

export const authConfig = {
  pages: {
    signIn: "/login",
  },
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id as string;
        token.role = (user as any).role;
        token.companyId = (user as any).companyId;
        token.companyVerified = (user as any).companyVerified ?? false;
      }
      return token;
    },
    async session({ session, token }) {
      if (token && session.user) {
        session.user.id = token.id as string;
        session.user.role = token.role as any;
        session.user.companyId = token.companyId as string | null;
        session.user.companyVerified = token.companyVerified as boolean;
      }
      return session;
    },
  },
  providers: [],
} satisfies NextAuthConfig;
