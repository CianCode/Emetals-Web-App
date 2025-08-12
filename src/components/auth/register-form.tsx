"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
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

import { AuthSuccess } from "./auth-success";
import { GlobalAlert } from "./global-alert";
import { OtpVerificationForm } from "./otp-verification-form";
import { RegisterFields } from "./register-fields";

// Update the RegistrationStep enum to include SUCCESS
enum ExtendedRegistrationStep {
  FORM = "form",
  OTP_VERIFICATION = "otp_verification",
  SUCCESS = "success",
}

/**
 * Main registration form component with multi-step flow
 * Handles user registration and email verification via OTP
 */
export function RegisterForm() {
  const router = useRouter();

  // Registration state management with extended step
  const [registrationState, setRegistrationState] = useState<{
    step: ExtendedRegistrationStep;
    email: string;
    name: string;
    isLoading: boolean;
    error: string | null;
    success: string | null;
  }>({
    step: ExtendedRegistrationStep.FORM,
    email: "",
    name: "",
    isLoading: false,
    error: null,
    success: null,
  });

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
        step: ExtendedRegistrationStep.OTP_VERIFICATION,
        email: data.email,
        name: data.name,
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

      // Success - show success state
      setRegistrationState((prev) => ({
        ...prev,
        step: ExtendedRegistrationStep.SUCCESS,
        isLoading: false,
        success: "Email verified successfully! Welcome to Emetals.",
      }));

      // Auto-redirect after 3 seconds
      setTimeout(() => {
        router.push("/dashboard");
      }, 3000);
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
      step: ExtendedRegistrationStep.FORM,
      error: null,
      success: null,
    }));
  };

  /**
   * Handle redirect from success state
   */
  const handleRedirect = () => {
    router.push("/dashboard");
  };

  return (
    <div className="mx-auto w-full max-w-md">
      <Card className="bg-card/50 border-0 shadow-lg backdrop-blur-sm">
        {registrationState.step === ExtendedRegistrationStep.FORM && (
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

        {registrationState.step === ExtendedRegistrationStep.SUCCESS && (
          <CardHeader className="space-y-1 pb-6">
            <CardTitle className="text-center text-2xl font-semibold tracking-tight">
              Registration Complete
            </CardTitle>
          </CardHeader>
        )}

        <CardContent>
          {/* Multi-step form content */}
          <div className="relative overflow-hidden">
            <AnimatePresence mode="wait">
              {registrationState.step === ExtendedRegistrationStep.FORM ? (
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
                    {registrationState.error && (
                      <GlobalAlert
                        type="error"
                        title="Registration Error"
                        message={registrationState.error}
                        isVisible={!!registrationState.error}
                        onClose={clearAlerts}
                      />
                    )}

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
              ) : registrationState.step ===
                ExtendedRegistrationStep.OTP_VERIFICATION ? (
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
              ) : (
                <motion.div
                  key="register-success"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.3, ease: "easeOut" }}
                >
                  <AuthSuccess
                    type="register"
                    userName={registrationState.name}
                    userEmail={registrationState.email}
                    onRedirect={handleRedirect}
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
