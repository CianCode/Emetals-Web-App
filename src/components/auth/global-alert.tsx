import React from "react";

import { AnimatePresence, motion } from "framer-motion";
import { AlertCircle, CheckCircle2, Info } from "lucide-react";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { cn } from "@/lib/utils";
import type { AlertType, GlobalAlertProps } from "@/types/auth";

/**
 * Icon mapping for different alert types
 */
const alertIcons: Record<
  AlertType,
  React.ComponentType<{ className?: string }>
> = {
  success: CheckCircle2,
  error: AlertCircle,
  warning: AlertCircle,
  info: Info,
};

/**
 * CSS classes for different alert variants
 */
const alertVariants: Record<AlertType, string> = {
  success:
    "border-green-200 bg-green-50 text-green-800 dark:border-green-800/20 dark:bg-green-950/20 dark:text-green-300",
  error:
    "border-destructive/20 bg-destructive/5 text-destructive dark:border-destructive/20 dark:bg-destructive/10",
  warning:
    "border-orange-200 bg-orange-50 text-orange-800 dark:border-orange-800/20 dark:bg-orange-950/20 dark:text-orange-300",
  info: "border-blue-200 bg-blue-50 text-blue-800 dark:border-blue-800/20 dark:bg-blue-950/20 dark:text-blue-300",
};

/**
 * Global alert component for top-level notifications
 * Displays success, error, warning, or info messages with animations
 */
export function GlobalAlert({
  type,
  title,
  message,
  isVisible,
}: GlobalAlertProps) {
  const Icon = alertIcons[type];

  return (
    <AnimatePresence mode="wait">
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: -20, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -20, scale: 0.95 }}
          transition={{ duration: 0.3, ease: "easeOut" }}
          className="mb-6"
        >
          <Alert className={cn("relative pr-12", alertVariants[type])}>
            <Icon className="h-4 w-4" />
            <AlertTitle className="font-semibold">{title}</AlertTitle>
            <AlertDescription className="mt-1 text-sm leading-relaxed">
              {message}
            </AlertDescription>
          </Alert>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
