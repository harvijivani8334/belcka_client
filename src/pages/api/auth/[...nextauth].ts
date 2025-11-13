import NextAuth, { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { getSession } from "next-auth/react";

export const authOptions: NextAuthOptions = {
  debug: true,

  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        is_web: { label: "Is web", type: "text"},
        invite_link: { label: "Invite link", type: "text"},
        email: { label: "Email", type: "text" },
        otp: { label: "Verification Code", type: "number" },
      },
      async authorize(credentials) {
        try {
          const api = process.env.NEXT_PUBLIC_API_URL;

          const res = await fetch(`${api}company-clients/login`, {
            method: "POST",
            headers: { "Content-Type": "application/json" ,"is_web" : 'true'},
            body: JSON.stringify(credentials),
          });

          const data = await res.json();

          if (!res.ok || !data?.info) {
            const error = Object.entries(data);
            throw new Error(
              data?.isSuccess === false ? data.message : error?.[1]?.[1] || "Login failed"
            );
          }

          const token = data.info.authToken;
          await getSession();
          return {
            ...data.info,
            token,
          };
          
        } catch (err) {
          throw new Error(err instanceof Error ? err.message : String(err));
        }
      },
    }),
  ],

  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.user = user;
        token.accessToken = (user as any).token;
      }
      return token;
    },

    async session({ session, token }) {
      const user = token.user as any;

      return {
        ...session,
        user: {
          ...user,
        },
        accessToken: token.accessToken,
      };
    },

    async redirect({ url, baseUrl }) {
      if (url.startsWith(`${baseUrl}/auth?`)) {
        return url; // stay on /auth
      }
      return `${baseUrl}/apps/projects/list`; // otherwise dashboard
    },
  },

  pages: {
    signIn: "/auth",
  },

  secret: process.env.NEXTAUTH_SECRET,
};

export default NextAuth(authOptions);