import React from "react";

import { Mail } from "lucide-react";
import { FieldErrors, UseFormRegister } from "react-hook-form";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import type { ForgotPasswordFormData } from "@/lib/validation/forgot-password-schema";

import { FormErrorMessage } from "./form-error-message";

interface ForgotPasswordFieldsProps {
  /** React Hook Form register function */
  register: UseFormRegister<ForgotPasswordFormData>;
  /** Form validation errors */
  errors: FieldErrors<ForgotPasswordFormData>;
  /** Whether the form is currently submitting */
  isLoading?: boolean;
}

/**
 * Forgot password email input field component
 * Single email field with validation
 */
export function ForgotPasswordFields({
  register,
  errors,
  isLoading = false,
}: ForgotPasswordFieldsProps) {
  return (
    <div className="space-y-2">
      <Label htmlFor="forgot-email" className="text-sm font-medium">
        <Mail className="mr-2 inline h-4 w-4" />
        Email Address
      </Label>
      <Input
        id="forgot-email"
        type="email"
        placeholder="Enter your registered email"
        disabled={isLoading}
        className={cn(
          "transition-colors",
          errors.email &&
            "border-destructive focus-visible:ring-destructive/20",
        )}
        {...register("email")}
        aria-invalid={!!errors.email}
        aria-describedby={errors.email ? "email-error" : undefined}
        autoComplete="email"
        autoFocus
      />
      <FormErrorMessage message={errors.email?.message} />

      {/* Helper text */}
      <p className="text-muted-foreground mt-2 text-xs">
        We&apos;ll send a verification code to this email address
      </p>
    </div>
  );
}
