// src/components/auth/login-success.tsx
import React from "react";

import { motion } from "framer-motion";
import { CheckCircle2, Home } from "lucide-react";

import { Button } from "@/components/ui/button";

interface LoginSuccessProps {
  /** User's name for personalized greeting */
  userName?: string;
  /** Callback when redirect button is clicked */
  onRedirect: () => void;
}

/**
 * Login success state component
 * Displays success message with smooth animations
 */
export function LoginSuccess({ userName, onRedirect }: LoginSuccessProps) {
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
        <CheckCircle2 className="h-8 w-8 text-green-600 dark:text-green-400" />
      </motion.div>

      {/* Success Message */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.4, ease: "easeOut" }}
        className="space-y-2"
      >
        <h2 className="text-2xl font-semibold tracking-tight">
          Welcome Back{userName ? `, ${userName}` : ""}!
        </h2>
        <p className="text-muted-foreground text-sm leading-relaxed">
          You have successfully signed in to your Emetals account.
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
          <Home className="mr-2 h-4 w-4" />
          Go to Dashboard
        </Button>
      </motion.div>

      {/* Auto-redirect Notice */}
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1, duration: 0.3 }}
        className="text-muted-foreground text-xs"
      >
        You will be automatically redirected in a few seconds...
      </motion.p>
    </motion.div>
  );
}
