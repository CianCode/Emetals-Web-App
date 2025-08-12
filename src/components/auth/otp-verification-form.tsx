// src/components/auth/otp-verification-form.tsx
import React, { useEffect, useState } from "react";

import { zodResolver } from "@hookform/resolvers/zod";
import { motion } from "framer-motion";
import { ArrowLeft, Mail, RefreshCw } from "lucide-react";
import { useForm } from "react-hook-form";

import { Button } from "@/components/ui/button";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { type OtpFormData, otpSchema } from "@/lib/validation/register-schema";

import { FormErrorMessage } from "./form-error-message";

interface OtpVerificationFormProps {
  /** Email address where OTP was sent */
  email: string;
  /** Callback when back button is clicked */
  onBack: () => void;
  /** Callback when OTP verification is successful */
  onVerify: (otp: string) => Promise<void>;
  /** Callback to resend OTP */
  onResendOtp: () => Promise<void>;
  /** Whether the form is currently submitting */
  isLoading?: boolean;
}

/**
 * OTP verification form component
 * Handles 6-digit OTP input with resend functionality and timer
 */
export function OtpVerificationForm({
  email,
  onBack,
  onVerify,
  onResendOtp,
  isLoading = false,
}: OtpVerificationFormProps) {
  const [resendTimer, setResendTimer] = useState(60);
  const [canResend, setCanResend] = useState(false);
  const [isResending, setIsResending] = useState(false);

  const {
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
    setError,
    clearErrors,
  } = useForm<OtpFormData>({
    resolver: zodResolver(otpSchema),
  });

  const otpValue = watch("otp") || "";

  // Countdown timer for resend functionality
  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (resendTimer > 0 && !canResend) {
      interval = setInterval(() => {
        setResendTimer((prev) => {
          if (prev <= 1) {
            setCanResend(true);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }

    return () => clearInterval(interval);
  }, [resendTimer, canResend]);

  /**
   * Handle OTP form submission
   */
  const onSubmit = async (data: OtpFormData) => {
    try {
      clearErrors();
      await onVerify(data.otp);
    } catch {
      setError("otp", {
        type: "manual",
        message: "Invalid OTP. Please try again.",
      });
    }
  };

  /**
   * Handle resend OTP
   */
  const handleResendOtp = async () => {
    try {
      setIsResending(true);
      await onResendOtp();
      setResendTimer(60);
      setCanResend(false);
      clearErrors();
    } catch {
      setError("otp", {
        type: "manual",
        message: "Failed to resend OTP. Please try again.",
      });
    } finally {
      setIsResending(false);
    }
  };

  /**
   * Format email for display (e.g., j***@example.com)
   */
  const formatEmail = (email: string) => {
    const [username, domain] = email.split("@");
    if (username.length <= 2) return email;
    return `${username[0]}${"*".repeat(username.length - 2)}${username[username.length - 1]}@${domain}`;
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
          <Mail className="text-primary h-6 w-6" />
        </div>
        <h2 className="text-2xl font-semibold tracking-tight">
          Verify Your Email
        </h2>
        <p className="text-muted-foreground text-sm leading-relaxed">
          We&apos;ve sent a 6-digit verification code to{" "}
          <span className="text-foreground font-medium">
            {formatEmail(email)}
          </span>
        </p>
      </div>

      {/* OTP Form */}
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div className="space-y-3">
          <Label
            htmlFor="otp"
            className="block text-center text-sm font-medium"
          >
            Enter Verification Code
          </Label>

          <div className="flex justify-center">
            <InputOTP
              id="otp"
              maxLength={6}
              value={otpValue}
              onChange={(value) => {
                setValue("otp", value);
                clearErrors("otp");
              }}
              disabled={isLoading}
              className={cn(errors.otp && "border-destructive")}
            >
              <InputOTPGroup>
                {Array.from({ length: 6 }).map((_, index) => (
                  <InputOTPSlot
                    key={index}
                    index={index}
                    className={cn(
                      "h-12 w-12 text-lg font-semibold",
                      errors.otp && "border-destructive",
                    )}
                  />
                ))}
              </InputOTPGroup>
            </InputOTP>
          </div>
        </div>

        {/* Error message above verify button */}
        <FormErrorMessage
          message={errors.otp?.message}
          className="justify-center text-center"
        />

        {/* Verify Button */}
        <Button
          type="submit"
          className="h-11 w-full font-medium"
          disabled={isLoading || otpValue.length !== 6}
        >
          {isLoading ? (
            <>
              <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
              Verifying...
            </>
          ) : (
            "Verify Email"
          )}
        </Button>
      </form>

      {/* Resend Section */}
      <div className="space-y-3 text-center">
        <p className="text-muted-foreground text-sm">
          Didn&apos;t receive the code?
        </p>

        {canResend ? (
          <Button
            type="button"
            variant="outline"
            onClick={handleResendOtp}
            disabled={isResending}
            className="h-10"
          >
            {isResending ? (
              <>
                <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                Sending...
              </>
            ) : (
              "Resend Code"
            )}
          </Button>
        ) : (
          <p className="text-muted-foreground text-sm">
            Resend available in{" "}
            <span className="text-foreground font-medium">{resendTimer}s</span>
          </p>
        )}
      </div>

      {/* Back Button */}
      <div className="border-t pt-4">
        <Button
          type="button"
          variant="ghost"
          onClick={onBack}
          disabled={isLoading}
          className="h-10 w-full"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Registration
        </Button>
      </div>
    </motion.div>
  );
}
