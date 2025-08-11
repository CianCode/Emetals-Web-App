import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { admin, emailOTP } from "better-auth/plugins";

import { db } from "@/database";

export const auth = betterAuth({
  emailAndPassword: {
    enabled: true,
  },
  database: drizzleAdapter(db, {
    provider: "pg", // or "mysql", "sqlite"
  }),
  plugins: [
    admin(),
    emailOTP({
      overrideDefaultEmailVerification: true,
      async sendVerificationOTP({ email, otp, type }) {
        if (type === "sign-in") {
          return;
        } else if (type === "email-verification") {
          console.log(`Sending verification OTP to ${email}: ${otp}`);
        } else {
          console.log(`Sending password reset OTP to ${email}: ${otp}`);
        }
      },
    }),
  ],
});
