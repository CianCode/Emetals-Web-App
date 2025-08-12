import React from "react";

import { AnimatePresence, motion } from "framer-motion";
import { AlertCircle } from "lucide-react";

import { cn } from "@/lib/utils";

interface FormErrorMessageProps {
  /** Error message to display */
  message?: string;
  /** Additional CSS classes */
  className?: string;
  /** Whether to show an error icon */
  showIcon?: boolean;
}

/**
 * Reusable form field error message component
 * Shows animated error text below form inputs
 */
export function FormErrorMessage({
  message,
  className,
  showIcon = true,
}: FormErrorMessageProps) {
  return (
    <AnimatePresence mode="wait">
      {message && (
        <motion.div
          initial={{ opacity: 0, y: -8, height: 0 }}
          animate={{ opacity: 1, y: 0, height: "auto" }}
          exit={{ opacity: 0, y: -8, height: 0 }}
          transition={{ duration: 0.2, ease: "easeOut" }}
          className={cn(
            "text-destructive flex items-center gap-1.5 text-sm",
            className,
          )}
          role="alert"
          aria-live="polite"
        >
          {showIcon && <AlertCircle className="h-3.5 w-3.5 flex-shrink-0" />}
          <span className="text-xs leading-tight">{message}</span>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
