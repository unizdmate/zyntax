import { PrismaAdapter } from "@auth/prisma-adapter";
import { PrismaClient } from "@prisma/client";
import NextAuth from "next-auth";
import EmailProvider from "next-auth/providers/email";
import type { NextAuthOptions } from "next-auth";
import { sendAuthEmail } from "@/lib/email/sendAuthEmail";
import { sendResendEmail } from "@/lib/email/resendService";

const prisma = new PrismaClient();

// Determine which email service to use based on environment variables
const hasResendConfig = !!process.env.RESEND_API_KEY;

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma) as any,
  providers: [
    EmailProvider({
      server: !hasResendConfig 
        ? {
            host: process.env.EMAIL_SERVER_HOST || '',
            port: Number(process.env.EMAIL_SERVER_PORT) || 587,
            auth: {
              user: process.env.EMAIL_SERVER_USER || '',
              pass: process.env.EMAIL_SERVER_PASSWORD || '',
            },
          }
        : undefined,
      from: process.env.EMAIL_FROM || 'noreply@zyntax.app',
      sendVerificationRequest: hasResendConfig ? sendResendEmail : sendAuthEmail
    }),
  ],
  callbacks: {
    session: async ({ session, user }) => {
      if (session?.user) {
        session.user.id = user.id;
      }
      return session;
    },
  },
  pages: {
    signIn: "/login",
    verifyRequest: "/login/verify",
  },
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };