// src/components/auth/auth-success.tsx
import React from "react";

import { motion } from "framer-motion";
import { CheckCircle2, Home, LogIn, UserPlus } from "lucide-react";

import { Button } from "@/components/ui/button";

/**
 * Success types for different auth flows
 */
export type AuthSuccessType = "login" | "register" | "password-reset";

interface AuthSuccessProps {
  /** Type of success state */
  type: AuthSuccessType;
  /** User's name for personalized greeting (optional) */
  userName?: string;
  /** User's email for display (optional) */
  userEmail?: string;
  /** Callback when redirect button is clicked */
  onRedirect: () => void;
  /** Custom redirect button text */
  redirectButtonText?: string;
  /** Whether to show auto-redirect message */
  showAutoRedirect?: boolean;
}

/**
 * Generic authentication success state component
 * Can be used for login, registration, and password reset success states
 */
export function AuthSuccess({
  type,
  userName,
  userEmail,
  onRedirect,
  redirectButtonText,
  showAutoRedirect = true,
}: AuthSuccessProps) {
  // Get content based on success type
  const getContent = () => {
    switch (type) {
      case "login":
        return {
          icon: LogIn,
          title: userName ? `Welcome Back, ${userName}!` : "Welcome Back!",
          description:
            "You have successfully signed in to your Emetals account.",
          buttonText: redirectButtonText || "Go to Dashboard",
          buttonIcon: Home,
        };
      case "register":
        return {
          icon: UserPlus,
          title: userName ? `Welcome, ${userName}!` : "Welcome to Emetals!",
          description: userEmail
            ? `Your account has been created and verified. We've sent a confirmation to ${userEmail}.`
            : "Your account has been created and verified successfully.",
          buttonText: redirectButtonText || "Get Started",
          buttonIcon: Home,
        };
      case "password-reset":
        return {
          icon: CheckCircle2,
          title: "Password Reset Successful!",
          description: userEmail
            ? `Your password has been reset successfully for ${userEmail}.`
            : "Your password has been reset successfully. You can now sign in with your new password.",
          buttonText: redirectButtonText || "Sign In Now",
          buttonIcon: LogIn,
        };
      default:
        return {
          icon: CheckCircle2,
          title: "Success!",
          description: "Operation completed successfully.",
          buttonText: redirectButtonText || "Continue",
          buttonIcon: Home,
        };
    }
  };

  const content = getContent();
  const Icon = content.icon;
  const ButtonIcon = content.buttonIcon;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="space-y-6 text-center"
    >
      {/* Success Icon with Pulse Animation */}
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 0.2, type: "spring", stiffness: 200, damping: 15 }}
        className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-green-100 dark:bg-green-950/20"
      >
        <Icon className="h-8 w-8 text-green-600 dark:text-green-400" />
      </motion.div>

      {/* Success Message */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.4, ease: "easeOut" }}
        className="space-y-2"
      >
        <h2 className="text-2xl font-semibold tracking-tight">
          {content.title}
        </h2>
        <p className="text-muted-foreground text-sm leading-relaxed">
          {content.description}
        </p>
      </motion.div>

      {/* Animated Progress Dots */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5, duration: 0.3 }}
        className="flex justify-center space-x-1"
      >
        {[0, 1, 2].map((index) => (
          <motion.div
            key={index}
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.5, 1, 0.5],
            }}
            transition={{
              duration: 1,
              repeat: Infinity,
              delay: index * 0.2,
              ease: "easeInOut",
            }}
            className="bg-primary/60 h-2 w-2 rounded-full"
          />
        ))}
      </motion.div>

      {/* Redirect Button */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7, duration: 0.4, ease: "easeOut" }}
      >
        <Button
          onClick={onRedirect}
          className="h-11 w-full font-medium"
          size="lg"
        >
          <ButtonIcon className="mr-2 h-4 w-4" />
          {content.buttonText}
        </Button>
      </motion.div>

      {/* Auto-redirect Notice */}
      {showAutoRedirect && (
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1, duration: 0.3 }}
          className="text-muted-foreground text-xs"
        >
          You will be automatically redirected in a few seconds...
        </motion.p>
      )}
    </motion.div>
  );
}
