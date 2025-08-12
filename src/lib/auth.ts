// src/lib/auth.ts
import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { admin, emailOTP } from "better-auth/plugins";

import { db } from "@/database";

export const auth = betterAuth({
  emailAndPassword: {
    enabled: true,
    requireEmailVerification: true, // Require email verification for new accounts
  },
  database: drizzleAdapter(db, {
    provider: "pg",
  }),
  plugins: [
    admin(),
    emailOTP({
      overrideDefaultEmailVerification: true,
      sendVerificationOTP: async ({ email, otp, type }) => {
        // In production, integrate with your email service (SendGrid, Resend, etc.)
        // For development, log to console
        if (process.env.NODE_ENV === "development") {
          if (type === "sign-in") {
            // Send the OTP for sign-in
          } else if (type === "email-verification") {
            console.log("=====================================");
            console.log(`📧 Email OTP Verification`);
            console.log(`Type: ${type}`);
            console.log(`To: ${email}`);
            console.log(`Code: ${otp}`);
            console.log("=====================================");
          } else {
            // Send the OTP for password reset
          }
        } else {
          // Production email sending logic
          // Example with Resend:
          // await resend.emails.send({
          //   from: 'noreply@emetals.com',
          //   to: email,
          //   subject: type === 'email-verification' ? 'Verify your email' : 'Reset your password',
          //   html: getEmailTemplate(type, otp)
          // });
        }
      },
      // OTP expiration time (in seconds)
      otpLength: 6,
      expiresIn: 60 * 10, // 10 minutes
    }),
  ],
  // Session configuration
  session: {
    expiresIn: 60 * 60 * 24 * 30, // 30 days
    updateAge: 60 * 60 * 24, // Update session if older than 24 hours
  },
  // Security configuration
  rateLimit: {
    enabled: true,
    window: 60, // 1 minute
    max: 10, // Max 10 requests per minute
  },
  // Trusted origins for CORS
  trustedOrigins: process.env.NEXT_PUBLIC_BASE_URL
    ? [process.env.NEXT_PUBLIC_BASE_URL]
    : ["http://localhost:3000"],
});
