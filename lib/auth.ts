import { type NextAuthOptions } from "next-auth";
import { PrismaAdapter } from "@next-auth/prisma-adapter"
import GithubProvider from "next-auth/providers/github"
import GoogleProvider from "next-auth/providers/google";
import { getServerSession } from "next-auth";

import { db } from './db';
import { sendWelcomeEmail } from "./emails/send-welcome";

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(db as any),
  secret: process.env.NEXTAUTH_SECRET,
  session: {
    strategy: "jwt",
  },
  pages: {
    signIn: "/login",
  },
  debug: process.env.NODE_ENV === "development",
  providers: [
    GithubProvider({
      clientId: process.env.GITHUB_ID as string,
      clientSecret: process.env.GITHUB_SECRET as string,
      allowDangerousEmailAccountLinking: true,
      authorization: {
        params: {
          redirect_uri: `${process.env.NEXTAUTH_URL}/api/auth/callback/github`,
        },
      },
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
      allowDangerousEmailAccountLinking: true,
    })
  ],
  callbacks: {
    async session({ token, session }) {
      if (token) {
        session!.user!.id = token.id as string
        session!.user!.name = token.name as string
        session!.user!.email = token.email as string
        session!.user!.image = token.picture as string
      }

      return session
    },
    async jwt({ token, user }) {
      const dbUser = await db.user.findFirst({
        where: {
          email: token.email,
        },
      })

      if (!dbUser) {
        if (user) {
          token.id = user?.id
        }
        return token
      }

      return {
        id: dbUser.id,
        name: dbUser.name,
        email: dbUser.email,
        picture: dbUser.image,
      }
    },
  },
  events: {
    async createUser(message) {
      const params = {
        name: message.user.name,
        email: message.user.email,
      };
      await sendWelcomeEmail(params);
    }
  },
};

export const auth = () => getServerSession(authOptions);
