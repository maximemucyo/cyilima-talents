import type { NextAuthConfig } from "next-auth";

export const authConfig = {
  pages: {
    signIn: "/login",
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = (user as any).role;
        token.name = (user as any).name;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        (session.user as any).role = token.role;
        (session.user as any).id = token.sub;
        session.user.name = token.name as string;
      }
      return session;
    },
  },
  providers: [], // Add empty providers array here, will be filled in auth.ts
  secret: process.env.NEXTAUTH_SECRET || "umurava-hackathon-secret-2026",
} satisfies NextAuthConfig;

