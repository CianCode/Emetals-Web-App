"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useState } from "react";

import { zodResolver } from "@hookform/resolvers/zod";
import { AnimatePresence, motion } from "framer-motion";
import { Eye, EyeOff, Lock, LogIn, Mail, RefreshCw } from "lucide-react";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { authClient } from "@/lib/auth-client";
import { cn } from "@/lib/utils";

import { ForgotPasswordForm } from "./forgot-password-form";
import { FormErrorMessage } from "./form-error-message";
import { GlobalAlert } from "./global-alert";
import { LoginSuccess } from "./login-success";

/**
 * Login form validation schema
 */
const loginSchema = z.object({
  email: z
    .string()
    .email("Please enter a valid email address")
    .min(1, "Email is required"),
  password: z.string().min(1, "Password is required"),
});

type LoginFormData = z.infer<typeof loginSchema>;

/**
 * View modes for the login component
 */
enum LoginView {
  LOGIN = "login",
  FORGOT_PASSWORD = "forgot_password",
  SUCCESS = "success",
}

/**
 * Login form component with forgot password flow integration
 * Handles user authentication and password reset
 */
export function LoginForm() {
  const router = useRouter();
  const [currentView, setCurrentView] = useState<LoginView>(LoginView.LOGIN);
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [globalError, setGlobalError] = useState<string | null>(null);
  const [globalSuccess, setGlobalSuccess] = useState<string | null>(null);
  const [userName, setUserName] = useState<string>("");

  // React Hook Form setup
  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    mode: "onBlur",
  });

  /**
   * Clear global alerts
   */
  const clearAlerts = () => {
    setGlobalError(null);
    setGlobalSuccess(null);
  };

  /**
   * Handle login form submission
   */
  const onSubmit = async (data: LoginFormData) => {
    try {
      clearAlerts();
      setIsLoading(true);

      // Call better-auth sign in
      const response = await authClient.signIn.email({
        email: data.email,
        password: data.password,
        rememberMe: true, // 30-day session as configured
      });

      if (response.error) {
        throw new Error(response.error.message || "Invalid credentials");
      }

      // Get user data from response if available
      if (response.data?.user) {
        setUserName(response.data.user.name || "");
      }

      // Success - show success state
      setCurrentView(LoginView.SUCCESS);
      setIsLoading(false);

      // Auto-redirect after 3 seconds
      setTimeout(() => {
        router.push("/dashboard");
      }, 3000);
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "An unexpected error occurred";

      // Handle specific errors
      if (
        errorMessage.includes("credentials") ||
        errorMessage.includes("Invalid")
      ) {
        setGlobalError("Invalid email or password. Please try again.");
        setError("password", {
          type: "manual",
          message: "Check your credentials",
        });
      } else if (errorMessage.includes("verified")) {
        setGlobalError("Please verify your email before logging in.");
      } else {
        setGlobalError(errorMessage);
      }

      setIsLoading(false);
    }
  };

  /**
   * Handle navigation to forgot password
   */
  const handleForgotPassword = () => {
    clearAlerts();
    setCurrentView(LoginView.FORGOT_PASSWORD);
  };

  /**
   * Handle back to login from forgot password
   */
  const handleBackToLogin = () => {
    clearAlerts();
    setCurrentView(LoginView.LOGIN);
    // Optionally show a success message if password was reset
    if (globalSuccess?.includes("reset")) {
      setGlobalSuccess("Password reset successful! You can now log in.");
    }
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
        {currentView === LoginView.LOGIN && (
          <CardHeader className="space-y-1 pb-6">
            <div className="bg-primary/10 mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full">
              <LogIn className="text-primary h-6 w-6" />
            </div>
            <CardTitle className="text-center text-2xl font-semibold tracking-tight">
              Welcome Back
            </CardTitle>
            <p className="text-muted-foreground text-center text-sm">
              Sign in to your Emetals account
            </p>
          </CardHeader>
        )}

        {currentView === LoginView.SUCCESS && (
          <CardHeader className="space-y-1 pb-6">
            <CardTitle className="text-center text-2xl font-semibold tracking-tight">
              Login Successful
            </CardTitle>
          </CardHeader>
        )}

        <CardContent>
          <div className="relative overflow-hidden">
            <AnimatePresence mode="wait">
              {currentView === LoginView.LOGIN ? (
                <motion.div
                  key="login-form"
                  initial={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -100 }}
                  transition={{ duration: 0.3, ease: "easeOut" }}
                >
                  <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                    {/* Email Field */}
                    <div className="space-y-2">
                      <Label htmlFor="email" className="text-sm font-medium">
                        <Mail className="mr-2 inline h-4 w-4" />
                        Email Address
                      </Label>
                      <Input
                        id="email"
                        type="email"
                        placeholder="Enter your email"
                        disabled={isLoading}
                        className={cn(
                          "transition-colors",
                          errors.email &&
                            "border-destructive focus-visible:ring-destructive/20",
                        )}
                        {...register("email")}
                        aria-invalid={!!errors.email}
                        aria-describedby={
                          errors.email ? "email-error" : undefined
                        }
                        autoComplete="email"
                        autoFocus
                      />
                      <FormErrorMessage message={errors.email?.message} />
                    </div>

                    {/* Password Field */}
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <Label
                          htmlFor="password"
                          className="text-sm font-medium"
                        >
                          <Lock className="mr-2 inline h-4 w-4" />
                          Password
                        </Label>
                        <button
                          type="button"
                          onClick={handleForgotPassword}
                          className="text-primary text-sm font-medium hover:underline focus:underline focus:outline-none"
                          disabled={isLoading}
                        >
                          Forgot Password?
                        </button>
                      </div>
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
                          aria-describedby={
                            errors.password ? "password-error" : undefined
                          }
                          autoComplete="current-password"
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          className="absolute top-1 right-1 h-7 w-7 hover:bg-transparent"
                          onClick={() => setShowPassword(!showPassword)}
                          disabled={isLoading}
                          aria-label={
                            showPassword ? "Hide password" : "Show password"
                          }
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

                    {/* Global Alerts */}
                    {globalError && (
                      <GlobalAlert
                        type="error"
                        title="Login Error"
                        message={globalError}
                        isVisible={!!globalError}
                        onClose={clearAlerts}
                      />
                    )}

                    {globalSuccess && (
                      <GlobalAlert
                        type="success"
                        title="Success"
                        message={globalSuccess}
                        isVisible={!!globalSuccess}
                        onClose={clearAlerts}
                      />
                    )}

                    {/* Submit Button */}
                    <Button
                      type="submit"
                      className="h-11 w-full font-medium"
                      disabled={isLoading}
                    >
                      {isLoading ? (
                        <>
                          <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                          Signing In...
                        </>
                      ) : (
                        "Sign In"
                      )}
                    </Button>

                    {/* Terms */}
                    <p className="text-muted-foreground text-center text-xs leading-relaxed">
                      By signing in, you agree to our{" "}
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

                  {/* Register Link */}
                  <div className="mt-6 border-t pt-6 text-center">
                    <p className="text-muted-foreground text-sm">
                      Don&apos;t have an account?{" "}
                      <Link
                        href="/register"
                        className="text-primary font-medium hover:underline"
                      >
                        Create account
                      </Link>
                    </p>
                  </div>
                </motion.div>
              ) : currentView === LoginView.FORGOT_PASSWORD ? (
                <motion.div
                  key="forgot-password"
                  initial={{ opacity: 0, x: 100 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -100 }}
                  transition={{ duration: 0.3, ease: "easeOut" }}
                >
                  <ForgotPasswordForm
                    onBackToLogin={handleBackToLogin}
                    isEmbedded={true}
                  />
                </motion.div>
              ) : (
                <motion.div
                  key="login-success"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.3, ease: "easeOut" }}
                >
                  <LoginSuccess
                    userName={userName}
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
