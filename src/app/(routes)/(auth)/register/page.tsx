import type { Metadata } from "next";

import { RegisterForm } from "@/components/auth/register-form";

export const metadata: Metadata = {
  title: "Register",
  description:
    "Create a new Emetals account to start trading precious metals with live pricing on gold, silver, platinum, and palladium",
  keywords: [
    "register",
    "signup",
    "emetals",
    "precious metals",
    "gold",
    "silver",
    "platinum",
    "palladium",
  ],
};

/**
 * Registration page component
 * Displays the complete registration flow with email verification
 */
export default function RegisterPage() {
  return (
    <div className="from-background via-muted/20 to-background flex min-h-screen items-center justify-center bg-gradient-to-br p-4">
      {/* Background decoration */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="bg-primary/5 absolute -top-40 -right-32 h-80 w-80 rounded-full blur-3xl" />
        <div className="bg-secondary/5 absolute -bottom-40 -left-32 h-80 w-80 rounded-full blur-3xl" />
      </div>

      {/* Main content */}
      <div className="relative z-10 w-full max-w-md">
        <RegisterForm />
      </div>
    </div>
  );
}
