import React, { useState } from "react";

import { zodResolver } from "@hookform/resolvers/zod";
import { motion } from "framer-motion";
import { Eye, EyeOff, Lock, RefreshCw, ShieldCheck } from "lucide-react";
import { useForm } from "react-hook-form";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import {
  type ResetPasswordFormData,
  resetPasswordSchema,
} from "@/lib/validation/forgot-password-schema";

import { FormErrorMessage } from "./form-error-message";
import PasswordStrengthBar from "./password-strength-bar";

interface ResetPasswordFormProps {
  /** Email address for the password reset */
  email: string;
  /** Callback when password reset is successful */
  onReset: (password: string) => Promise<void>;
  /** Whether the form is currently submitting */
  isLoading?: boolean;
}

/**
 * Reset password form component
 * Handles new password and confirmation with strength indicator
 */
export function ResetPasswordForm({
  email,
  onReset,
  isLoading = false,
}: ResetPasswordFormProps) {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    setError,
  } = useForm<ResetPasswordFormData>({
    resolver: zodResolver(resetPasswordSchema),
    mode: "onBlur",
  });

  const passwordValue = watch("password") || "";

  /**
   * Handle form submission
   */
  const onSubmit = async (data: ResetPasswordFormData) => {
    try {
      await onReset(data.password);
    } catch (error) {
      setError("password", {
        type: "manual",
        message:
          error instanceof Error
            ? error.message
            : "Failed to reset password. Please try again.",
      });
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 100 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -100 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      className="space-y-6"
    >
      {/* Header */}
      <div className="space-y-2 text-center">
        <div className="bg-primary/10 mx-auto flex h-12 w-12 items-center justify-center rounded-full">
          <ShieldCheck className="text-primary h-6 w-6" />
        </div>
        <h2 className="text-2xl font-semibold tracking-tight">
          Create New Password
        </h2>
        <p className="text-muted-foreground text-sm leading-relaxed">
          Choose a strong password for{" "}
          <span className="text-foreground font-medium">{email}</span>
        </p>
      </div>

      {/* Password Reset Form */}
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        {/* New Password Field */}
        <div className="space-y-2">
          <Label htmlFor="new-password" className="text-sm font-medium">
            <Lock className="mr-2 inline h-4 w-4" />
            New Password
          </Label>
          <div className="relative">
            <Input
              id="new-password"
              type={showPassword ? "text" : "password"}
              placeholder="Enter your new password"
              disabled={isLoading}
              className={cn(
                "pr-10 transition-colors",
                errors.password &&
                  "border-destructive focus-visible:ring-destructive/20",
              )}
              {...register("password")}
              aria-invalid={!!errors.password}
              aria-describedby={
                errors.password ? "password-error" : "password-strength"
              }
              autoComplete="new-password"
            />
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="absolute top-1 right-1 h-7 w-7 hover:bg-transparent"
              onClick={() => setShowPassword(!showPassword)}
              disabled={isLoading}
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? (
                <EyeOff className="text-muted-foreground h-4 w-4" />
              ) : (
                <Eye className="text-muted-foreground h-4 w-4" />
              )}
            </Button>
          </div>

          {/* Password Strength Indicator */}
          {passwordValue && (
            <div className="mt-3">
              <PasswordStrengthBar password={passwordValue} showHint={true} />
            </div>
          )}

          <FormErrorMessage message={errors.password?.message} />
        </div>

        {/* Confirm Password Field */}
        <div className="space-y-2">
          <Label htmlFor="confirm-new-password" className="text-sm font-medium">
            <Lock className="mr-2 inline h-4 w-4" />
            Confirm New Password
          </Label>
          <div className="relative">
            <Input
              id="confirm-new-password"
              type={showConfirmPassword ? "text" : "password"}
              placeholder="Confirm your new password"
              disabled={isLoading}
              className={cn(
                "pr-10 transition-colors",
                errors.confirmPassword &&
                  "border-destructive focus-visible:ring-destructive/20",
              )}
              {...register("confirmPassword")}
              aria-invalid={!!errors.confirmPassword}
              aria-describedby={
                errors.confirmPassword ? "confirm-password-error" : undefined
              }
              autoComplete="new-password"
            />
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="absolute top-1 right-1 h-7 w-7 hover:bg-transparent"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              disabled={isLoading}
              aria-label={
                showConfirmPassword ? "Hide password" : "Show password"
              }
            >
              {showConfirmPassword ? (
                <EyeOff className="text-muted-foreground h-4 w-4" />
              ) : (
                <Eye className="text-muted-foreground h-4 w-4" />
              )}
            </Button>
          </div>
          <FormErrorMessage message={errors.confirmPassword?.message} />
        </div>

        {/* Submit Button */}
        <Button
          type="submit"
          className="h-11 w-full font-medium"
          disabled={isLoading}
        >
          {isLoading ? (
            <>
              <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
              Resetting Password...
            </>
          ) : (
            "Reset Password"
          )}
        </Button>

        {/* Security Tips */}
        <div className="bg-muted/30 text-muted-foreground rounded-lg p-3 text-xs">
          <p className="mb-1 font-medium">Password Requirements:</p>
          <ul className="ml-4 list-disc space-y-0.5">
            <li>At least 8 characters long</li>
            <li>One uppercase and one lowercase letter</li>
            <li>One number and one special character</li>
          </ul>
        </div>
      </form>
    </motion.div>
  );
}
