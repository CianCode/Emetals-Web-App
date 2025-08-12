import { z } from "zod";

/**
 * Login form validation schema
 * Validates email format and password presence
 */
export const loginSchema = z.object({
  email: z
    .string()
    .email("Please enter a valid email address")
    .min(1, "Email is required")
    .max(254, "Email is too long"), // RFC 5321 limit

  password: z
    .string()
    .min(1, "Password is required")
    .max(128, "Password is too long"), // Reasonable upper limit
});

/**
 * Forgot password schema
 */
export const forgotPasswordSchema = z.object({
  email: z
    .string()
    .email("Please enter a valid email address")
    .min(1, "Email is required")
    .max(254, "Email is too long"),
});

/**
 * Type inference from schemas
 */
export type LoginFormData = z.infer<typeof loginSchema>;
export type ForgotPasswordFormData = z.infer<typeof forgotPasswordSchema>;
