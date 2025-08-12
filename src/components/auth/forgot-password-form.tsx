"use client";

import { useRouter } from "next/navigation";
import React, { useState } from "react";

import { zodResolver } from "@hookform/resolvers/zod";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowLeft, KeyRound, RefreshCw } from "lucide-react";
import { useForm } from "react-hook-form";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { authClient } from "@/lib/auth-client";
import {
  type ForgotPasswordFormData,
  forgotPasswordSchema,
} from "@/lib/validation/forgot-password-schema";

import { AuthSuccess } from "./auth-success";
import { ForgotPasswordFields } from "./forgot-password-fields";
import { GlobalAlert } from "./global-alert";
import { OtpVerificationForm } from "./otp-verification-form";
import { ResetPasswordForm } from "./reset-password-form";

// Extend PasswordResetStep to include SUCCESS
enum ExtendedPasswordResetStep {
  EMAIL = "email",
  OTP_VERIFICATION = "otp_verification",
  RESET_PASSWORD = "reset_password",
  SUCCESS = "success",
}

interface ForgotPasswordFormProps {
  /** Callback to return to login form */
  onBackToLogin?: () => void;
  /** Whether this is embedded in another form (like login) */
  isEmbedded?: boolean;
}

/**
 * Main forgot password form component with multi-step flow
 * Handles email submission, OTP verification, and password reset
 */
export function ForgotPasswordForm({
  onBackToLogin,
  isEmbedded = false,
}: ForgotPasswordFormProps) {
  const router = useRouter();

  // Password reset state management with extended step
  const [resetState, setResetState] = useState<{
    step: ExtendedPasswordResetStep;
    email: string;
    otp: string;
    isLoading: boolean;
    error: string | null;
    success: string | null;
  }>({
    step: ExtendedPasswordResetStep.EMAIL,
    email: "",
    otp: "", // Store OTP for final reset
    isLoading: false,
    error: null,
    success: null,
  });

  // React Hook Form setup for email step
  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
  } = useForm<ForgotPasswordFormData>({
    resolver: zodResolver(forgotPasswordSchema),
    mode: "onBlur",
  });

  /**
   * Clear global alerts
   */
  const clearAlerts = () => {
    setResetState((prev) => ({
      ...prev,
      error: null,
      success: null,
    }));
  };

  /**
   * Handle email submission - Step 1
   * Send OTP to user's email for password reset
   */
  const onSubmitEmail = async (data: ForgotPasswordFormData) => {
    try {
      clearAlerts();
      setResetState((prev) => ({ ...prev, isLoading: true }));

      // Send password reset OTP using forgetPassword.emailOtp
      const response = await authClient.forgetPassword.emailOtp({
        email: data.email,
      });

      if (response.error) {
        throw new Error(
          response.error.message || "Failed to send verification code",
        );
      }

      // Success - move to OTP verification step
      setResetState((prev) => ({
        ...prev,
        step: ExtendedPasswordResetStep.OTP_VERIFICATION,
        email: data.email,
        isLoading: false,
        success: "Verification code sent! Check your email.",
      }));
    } catch (error) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : "Failed to send verification code";

      // Handle specific errors
      if (
        errorMessage.includes("not found") ||
        errorMessage.includes("exist")
      ) {
        setError("email", {
          type: "manual",
          message: "No account found with this email address",
        });
      }

      setResetState((prev) => ({
        ...prev,
        isLoading: false,
        error: errorMessage,
      }));
    }
  };

  /**
   * Handle OTP verification - Step 2
   * Verify the OTP and move to password reset step
   */
  const handleOtpVerification = async (otp: string) => {
    try {
      setResetState((prev) => ({ ...prev, isLoading: true }));

      // Store OTP for the final reset step
      setResetState((prev) => ({
        ...prev,
        step: ExtendedPasswordResetStep.RESET_PASSWORD,
        otp: otp, // Store the OTP
        isLoading: false,
        success: "Code verified! Now create your new password.",
      }));
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Invalid verification code";

      setResetState((prev) => ({
        ...prev,
        isLoading: false,
        error: errorMessage,
      }));

      throw error; // Re-throw for OTP form error handling
    }
  };

  /**
   * Handle password reset - Step 3
   * Actually reset the password using emailOtp.resetPassword
   */
  const handlePasswordReset = async (password: string) => {
    try {
      setResetState((prev) => ({ ...prev, isLoading: true }));

      // Reset password using emailOtp.resetPassword with OTP and new password
      const response = await authClient.emailOtp.resetPassword({
        email: resetState.email,
        otp: resetState.otp,
        password: password,
      });

      if (response.error) {
        // If OTP is invalid, allow user to go back and re-enter
        if (
          response.error.message?.includes("OTP") ||
          response.error.message?.includes("code") ||
          response.error.message?.includes("invalid")
        ) {
          setResetState((prev) => ({
            ...prev,
            step: ExtendedPasswordResetStep.OTP_VERIFICATION,
            isLoading: false,
            error: "Invalid verification code. Please try again.",
            success: null,
          }));
          return;
        }

        throw new Error(response.error.message || "Failed to reset password");
      }

      // Success - show success state
      setResetState((prev) => ({
        ...prev,
        step: ExtendedPasswordResetStep.SUCCESS,
        isLoading: false,
        success: "Password reset successful!",
        error: null,
      }));

      // Auto-redirect after 3 seconds
      setTimeout(() => {
        if (onBackToLogin) {
          onBackToLogin();
        } else {
          router.push("/login");
        }
      }, 3000);
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Failed to reset password";

      setResetState((prev) => ({
        ...prev,
        isLoading: false,
        error: errorMessage,
      }));

      throw error; // Re-throw for form error handling
    }
  };

  /**
   * Handle resend OTP
   * Resend the OTP for password reset
   */
  const handleResendOtp = async () => {
    try {
      // Use forgetPassword.emailOtp to resend
      const response = await authClient.forgetPassword.emailOtp({
        email: resetState.email,
      });

      if (response.error) {
        throw new Error(response.error.message || "Failed to resend code");
      }

      setResetState((prev) => ({
        ...prev,
        success: "Verification code sent successfully!",
      }));
    } catch (error) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : "Failed to resend verification code";

      setResetState((prev) => ({
        ...prev,
        error: errorMessage,
      }));

      throw error;
    }
  };

  /**
   * Handle back navigation
   */
  const handleBack = () => {
    if (resetState.step === ExtendedPasswordResetStep.OTP_VERIFICATION) {
      setResetState((prev) => ({
        ...prev,
        step: ExtendedPasswordResetStep.EMAIL,
        error: null,
        success: null,
      }));
    } else if (resetState.step === ExtendedPasswordResetStep.RESET_PASSWORD) {
      setResetState((prev) => ({
        ...prev,
        step: ExtendedPasswordResetStep.OTP_VERIFICATION,
        error: null,
        success: null,
      }));
    } else if (onBackToLogin) {
      onBackToLogin();
    } else {
      router.push("/login");
    }
  };

  /**
   * Handle redirect from success state
   */
  const handleRedirect = () => {
    if (onBackToLogin) {
      onBackToLogin();
    } else {
      router.push("/login");
    }
  };

  // Wrapper component - only show Card if not embedded
  const ContentWrapper = isEmbedded ? React.Fragment : Card;
  const contentWrapperProps = isEmbedded
    ? {}
    : { className: "bg-card/50 border-0 shadow-lg backdrop-blur-sm" };

  return (
    <div className={isEmbedded ? "" : "mx-auto w-full max-w-md"}>
      <ContentWrapper {...contentWrapperProps}>
        {!isEmbedded && resetState.step === ExtendedPasswordResetStep.EMAIL && (
          <CardHeader className="space-y-1 pb-6">
            <div className="bg-primary/10 mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full">
              <KeyRound className="text-primary h-6 w-6" />
            </div>
            <CardTitle className="text-center text-2xl font-semibold tracking-tight">
              Reset Your Password
            </CardTitle>
            <p className="text-muted-foreground text-center text-sm">
              Enter your email to receive a verification code
            </p>
          </CardHeader>
        )}

        {!isEmbedded &&
          resetState.step === ExtendedPasswordResetStep.SUCCESS && (
            <CardHeader className="space-y-1 pb-6">
              <CardTitle className="text-center text-2xl font-semibold tracking-tight">
                Password Reset Complete
              </CardTitle>
            </CardHeader>
          )}

        <CardContent className={isEmbedded ? "p-0" : ""}>
          {/* Multi-step form content */}
          <div className="relative overflow-hidden">
            <AnimatePresence mode="wait">
              {resetState.step === ExtendedPasswordResetStep.EMAIL ? (
                <motion.div
                  key="email-form"
                  initial={{
                    opacity: isEmbedded ? 0 : 1,
                    x: isEmbedded ? 100 : 0,
                  }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -100 }}
                  transition={{ duration: 0.3, ease: "easeOut" }}
                >
                  {/* Header for embedded mode */}
                  {isEmbedded && (
                    <div className="mb-6 space-y-1 text-center">
                      <div className="bg-primary/10 mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full">
                        <KeyRound className="text-primary h-6 w-6" />
                      </div>
                      <h2 className="text-2xl font-semibold tracking-tight">
                        Reset Your Password
                      </h2>
                      <p className="text-muted-foreground text-sm">
                        Enter your email to receive a verification code
                      </p>
                    </div>
                  )}

                  <form
                    onSubmit={handleSubmit(onSubmitEmail)}
                    className="space-y-6"
                  >
                    {/* Email Field */}
                    <ForgotPasswordFields
                      register={register}
                      errors={errors}
                      isLoading={resetState.isLoading}
                    />

                    {/* Global Alert */}
                    {resetState.error && (
                      <GlobalAlert
                        type="error"
                        title="Error"
                        message={resetState.error}
                        isVisible={!!resetState.error}
                        onClose={clearAlerts}
                      />
                    )}

                    {resetState.success && (
                      <GlobalAlert
                        type="success"
                        title="Success"
                        message={resetState.success}
                        isVisible={!!resetState.success}
                        onClose={clearAlerts}
                      />
                    )}

                    {/* Submit Button */}
                    <Button
                      type="submit"
                      className="h-11 w-full font-medium"
                      disabled={resetState.isLoading}
                    >
                      {resetState.isLoading ? (
                        <>
                          <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                          Sending Code...
                        </>
                      ) : (
                        "Send Verification Code"
                      )}
                    </Button>

                    {/* Back to Login */}
                    <Button
                      type="button"
                      variant="ghost"
                      onClick={handleBack}
                      disabled={resetState.isLoading}
                      className="h-10 w-full"
                    >
                      <ArrowLeft className="mr-2 h-4 w-4" />
                      Back to Login
                    </Button>
                  </form>
                </motion.div>
              ) : resetState.step ===
                ExtendedPasswordResetStep.OTP_VERIFICATION ? (
                <motion.div
                  key="otp-verification"
                  initial={{ opacity: 0, x: 100 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -100 }}
                  transition={{ duration: 0.3, ease: "easeOut" }}
                >
                  <OtpVerificationForm
                    email={resetState.email}
                    type="password-reset"
                    onBack={handleBack}
                    onVerify={handleOtpVerification}
                    onResendOtp={handleResendOtp}
                    isLoading={resetState.isLoading}
                  />
                </motion.div>
              ) : resetState.step ===
                ExtendedPasswordResetStep.RESET_PASSWORD ? (
                <motion.div
                  key="reset-password"
                  initial={{ opacity: 0, x: 100 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -100 }}
                  transition={{ duration: 0.3, ease: "easeOut" }}
                >
                  {/* Success Alert at the top of reset form */}
                  {resetState.success && (
                    <GlobalAlert
                      type="success"
                      title="Success"
                      message={resetState.success}
                      isVisible={!!resetState.success}
                      onClose={clearAlerts}
                    />
                  )}

                  <ResetPasswordForm
                    email={resetState.email}
                    onReset={handlePasswordReset}
                    isLoading={resetState.isLoading}
                  />

                  {/* Error Alert */}
                  {resetState.error && (
                    <div className="mt-4">
                      <GlobalAlert
                        type="error"
                        title="Error"
                        message={resetState.error}
                        isVisible={!!resetState.error}
                        onClose={clearAlerts}
                      />
                    </div>
                  )}
                </motion.div>
              ) : (
                <motion.div
                  key="password-reset-success"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.3, ease: "easeOut" }}
                >
                  <AuthSuccess
                    type="password-reset"
                    userEmail={resetState.email}
                    onRedirect={handleRedirect}
                  />
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </CardContent>
      </ContentWrapper>
    </div>
  );
}
