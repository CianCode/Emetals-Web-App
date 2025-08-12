import React, { useState } from "react";

import { Eye, EyeOff, Lock, Mail, User } from "lucide-react";
import { FieldErrors, UseFormRegister } from "react-hook-form";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import type { RegisterFormData } from "@/lib/validation/register-schema";

import { FormErrorMessage } from "./form-error-message";
import PasswordStrengthBar from "./password-strength-bar";

interface RegisterFieldsProps {
  /** React Hook Form register function */
  register: UseFormRegister<RegisterFormData>;
  /** Form validation errors */
  errors: FieldErrors<RegisterFormData>;
  /** Current password value for strength indicator */
  passwordValue: string;
  /** Whether the form is currently submitting */
  isLoading?: boolean;
}

/**
 * Registration form input fields component
 * Contains name, email, password, and confirm password fields with validation
 */
export function RegisterFields({
  register,
  errors,
  passwordValue,
  isLoading = false,
}: RegisterFieldsProps) {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  return (
    <div className="space-y-5">
      {/* Name Field */}
      <div className="space-y-2">
        <Label htmlFor="name" className="text-sm font-medium">
          <User className="mr-2 inline h-4 w-4" />
          Full Name
        </Label>
        <Input
          id="name"
          type="text"
          placeholder="Enter your full name"
          disabled={isLoading}
          className={cn(
            "transition-colors",
            errors.name &&
              "border-destructive focus-visible:ring-destructive/20",
          )}
          {...register("name")}
          aria-invalid={!!errors.name}
          aria-describedby={errors.name ? "name-error" : undefined}
        />
        <FormErrorMessage message={errors.name?.message} />
      </div>

      {/* Email Field */}
      <div className="space-y-2">
        <Label htmlFor="email" className="text-sm font-medium">
          <Mail className="mr-2 inline h-4 w-4" />
          Email Address
        </Label>
        <Input
          id="email"
          type="email"
          placeholder="Enter your email address"
          disabled={isLoading}
          className={cn(
            "transition-colors",
            errors.email &&
              "border-destructive focus-visible:ring-destructive/20",
          )}
          {...register("email")}
          aria-invalid={!!errors.email}
          aria-describedby={errors.email ? "email-error" : undefined}
        />
        <FormErrorMessage message={errors.email?.message} />
      </div>

      {/* Password Field */}
      <div className="space-y-2">
        <Label htmlFor="password" className="text-sm font-medium">
          <Lock className="mr-2 inline h-4 w-4" />
          Password
        </Label>
        <div className="relative">
          <Input
            id="password"
            type={showPassword ? "text" : "password"}
            placeholder="Create a strong password"
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
        <Label htmlFor="confirmPassword" className="text-sm font-medium">
          <Lock className="mr-2 inline h-4 w-4" />
          Confirm Password
        </Label>
        <div className="relative">
          <Input
            id="confirmPassword"
            type={showConfirmPassword ? "text" : "password"}
            placeholder="Confirm your password"
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
          />
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="absolute top-1 right-1 h-7 w-7 hover:bg-transparent"
            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            disabled={isLoading}
            aria-label={showConfirmPassword ? "Hide password" : "Show password"}
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
    </div>
  );
}
