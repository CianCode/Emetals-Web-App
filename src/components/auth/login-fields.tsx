import React, { useState } from "react";

import { Eye, EyeOff, Lock, Mail } from "lucide-react";
import { FieldErrors, UseFormRegister } from "react-hook-form";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import type { LoginFormData } from "@/lib/validation/login-schema";

import { FormErrorMessage } from "./form-error-message";

interface LoginFieldsProps {
  /** React Hook Form register function */
  register: UseFormRegister<LoginFormData>;
  /** Form validation errors */
  errors: FieldErrors<LoginFormData>;
  /** Whether the form is currently submitting */
  isLoading?: boolean;
}

/**
 * Login form input fields component
 * Contains email and password fields with validation
 */
export function LoginFields({
  register,
  errors,
  isLoading = false,
}: LoginFieldsProps) {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="space-y-5">
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
            placeholder="Enter your password"
            disabled={isLoading}
            className={cn(
              "pr-10 transition-colors",
              errors.password &&
                "border-destructive focus-visible:ring-destructive/20",
            )}
            {...register("password")}
            aria-invalid={!!errors.password}
            aria-describedby={errors.password ? "password-error" : undefined}
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
        <FormErrorMessage message={errors.password?.message} />
      </div>
    </div>
  );
}
