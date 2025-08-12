"use client";

import Link from "next/link";
import React, { useState } from "react";

import { zodResolver } from "@hookform/resolvers/zod";
import { AnimatePresence, motion } from "framer-motion";
import { RefreshCw, UserPlus } from "lucide-react";
import { useForm } from "react-hook-form";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { authClient } from "@/lib/auth-client";
import {
  type RegisterFormData,
  registerSchema,
} from "@/lib/validation/register-schema";
import { type RegistrationState, RegistrationStep } from "@/types/auth";

import { GlobalAlert } from "./global-alert";
import { OtpVerificationForm } from "./otp-verification-form";
import { RegisterFields } from "./register-fields";

/**
 * Main registration form component with multi-step flow
 * Handles user registration and email verification via OTP
 */
export function RegisterForm() {
  // Registration state management
  const [registrationState, setRegistrationState] = useState<RegistrationState>(
    {
      step: RegistrationStep.FORM,
      email: "",
      isLoading: false,
      error: null,
      success: null,
    },
  );

  // React Hook Form setup
  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    setError,
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    mode: "onBlur", // Validate on blur for better UX
  });

  const passwordValue = watch("password") || "";

  /**
   * Clear global alerts
   */
  const clearAlerts = () => {
    setRegistrationState((prev) => ({
      ...prev,
      error: null,
      success: null,
    }));
  };

  /**
   * Handle registration form submission
   */
  const onSubmit = async (data: RegisterFormData) => {
    try {
      clearAlerts();
      setRegistrationState((prev) => ({ ...prev, isLoading: true }));

      // Call better-auth registration
      const response = await authClient.signUp.email({
        email: data.email,
        password: data.password,
        name: data.name,
      });

      if (response.error) {
        throw new Error(response.error.message || "Registration failed");
      }

      // Success - move to OTP verification step
      setRegistrationState((prev) => ({
        ...prev,
        step: RegistrationStep.OTP_VERIFICATION,
        email: data.email,
        isLoading: false,
        success: "Account created successfully! Please verify your email.",
      }));
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "An unexpected error occurred";

      // Handle specific validation errors
      if (errorMessage.includes("email")) {
        setError("email", {
          type: "manual",
          message: "This email is already registered",
        });
      }

      setRegistrationState((prev) => ({
        ...prev,
        isLoading: false,
        error: errorMessage,
      }));
    }
  };

  /**
   * Handle OTP verification
   */
  const handleOtpVerification = async (otp: string) => {
    try {
      setRegistrationState((prev) => ({ ...prev, isLoading: true }));

      const response = await authClient.emailOtp.verifyEmail({
        email: registrationState.email,
        otp: otp,
      });

      if (response.error) {
        throw new Error(response.error.message || "OTP verification failed");
      }

      // Success - registration complete
      setRegistrationState((prev) => ({
        ...prev,
        isLoading: false,
        success: "Email verified successfully! Welcome to Emetals.",
      }));

      // Redirect to dashboard after success
      setTimeout(() => {
        window.location.href = "/dashboard";
      }, 2000);
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "OTP verification failed";

      setRegistrationState((prev) => ({
        ...prev,
        isLoading: false,
        error: errorMessage,
      }));

      throw error; // Re-throw for OTP form error handling
    }
  };

  /**
   * Handle resend OTP
   */
  const handleResendOtp = async () => {
    try {
      const response = await authClient.emailOtp.sendVerificationOtp({
        email: registrationState.email,
        type: "email-verification",
      });

      if (response.error) {
        throw new Error(response.error.message || "Failed to resend OTP");
      }

      setRegistrationState((prev) => ({
        ...prev,
        success: "Verification code sent successfully!",
      }));
    } catch (error) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : "Failed to resend verification code";

      setRegistrationState((prev) => ({
        ...prev,
        error: errorMessage,
      }));

      throw error;
    }
  };

  /**
   * Handle back to registration form
   */
  const handleBackToForm = () => {
    setRegistrationState((prev) => ({
      ...prev,
      step: RegistrationStep.FORM,
      error: null,
      success: null,
    }));
  };

  return (
    <div className="mx-auto w-full max-w-md">
      <Card className="bg-card/50 border-0 shadow-lg backdrop-blur-sm">
        {registrationState.step === RegistrationStep.FORM && (
          <CardHeader className="space-y-1 pb-6">
            <div className="bg-primary/10 mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full">
              <UserPlus className="text-primary h-6 w-6" />
            </div>
            <CardTitle className="text-center text-2xl font-semibold tracking-tight">
              Create Your Account
            </CardTitle>
            <p className="text-muted-foreground text-center text-sm">
              Join Emetals to start trading precious metals
            </p>
          </CardHeader>
        )}

        <CardContent>
          {/* Multi-step form content */}
          <div className="relative overflow-hidden">
            <AnimatePresence mode="wait">
              {registrationState.step === RegistrationStep.FORM ? (
                <motion.div
                  key="registration-form"
                  initial={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -100 }}
                  transition={{ duration: 0.3, ease: "easeOut" }}
                >
                  <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                    {/* Registration Fields */}
                    <RegisterFields
                      register={register}
                      errors={errors}
                      passwordValue={passwordValue}
                      isLoading={registrationState.isLoading}
                    />

                    {/* Global Alert above button */}
                    <GlobalAlert
                      type="error"
                      title="Registration Error"
                      message={registrationState.error || ""}
                      isVisible={!!registrationState.error}
                      onClose={clearAlerts}
                    />

                    {/* Submit Button */}
                    <Button
                      type="submit"
                      className="h-11 w-full font-medium"
                      disabled={registrationState.isLoading}
                    >
                      {registrationState.isLoading ? (
                        <>
                          <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                          Creating Account...
                        </>
                      ) : (
                        "Create Account"
                      )}
                    </Button>

                    {/* Terms and Privacy */}
                    <p className="text-muted-foreground text-center text-xs leading-relaxed">
                      By creating an account, you agree to our{" "}
                      <Link
                        href="/terms"
                        className="text-primary font-medium hover:underline"
                      >
                        Terms of Service
                      </Link>{" "}
                      and{" "}
                      <Link
                        href="/privacy"
                        className="text-primary font-medium hover:underline"
                      >
                        Privacy Policy
                      </Link>
                    </p>
                  </form>

                  {/* Login Link */}
                  <div className="mt-6 border-t pt-6 text-center">
                    <p className="text-muted-foreground text-sm">
                      Already have an account?{" "}
                      <Link
                        href="/login"
                        className="text-primary font-medium hover:underline"
                      >
                        Sign in
                      </Link>
                    </p>
                  </div>
                </motion.div>
              ) : (
                <motion.div
                  key="otp-verification"
                  initial={{ opacity: 0, x: 100 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -100 }}
                  transition={{ duration: 0.3, ease: "easeOut" }}
                >
                  <OtpVerificationForm
                    email={registrationState.email}
                    type="email-verification"
                    onBack={handleBackToForm}
                    onVerify={handleOtpVerification}
                    onResendOtp={handleResendOtp}
                    isLoading={registrationState.isLoading}
                  />
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
