import type { Metadata } from "next";

import { ForgotPasswordForm } from "@/components/auth/forgot-password-form";

export const metadata: Metadata = {
  title: "Reset Password",
  description:
    "Reset your Emetals account password. We'll send you a verification code to reset your password securely.",
  keywords: [
    "forgot password",
    "reset password",
    "emetals",
    "account recovery",
    "password recovery",
  ],
};

/**
 * Standalone forgot password page
 * Can be accessed directly via /forgot-password URL
 */
export default function ForgotPasswordPage() {
  return (
    <div className="from-background via-muted/20 to-background flex min-h-screen items-center justify-center bg-gradient-to-br p-4">
      {/* Background decoration */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="bg-primary/5 absolute -top-40 -right-32 h-80 w-80 rounded-full blur-3xl" />
        <div className="bg-secondary/5 absolute -bottom-40 -left-32 h-80 w-80 rounded-full blur-3xl" />
      </div>

      {/* Main content */}
      <div className="relative z-10 w-full max-w-md">
        <ForgotPasswordForm />
      </div>
    </div>
  );
}
