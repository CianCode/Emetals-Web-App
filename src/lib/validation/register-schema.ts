import { z } from "zod";

/**
 * Password validation schema with comprehensive rules
 */
const passwordSchema = z
  .string()
  .min(8, "Password must be at least 8 characters long")
  .regex(/[a-z]/, "Password must contain at least one lowercase letter")
  .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
  .regex(/[0-9]/, "Password must contain at least one number")
  .regex(
    /[^A-Za-z0-9]/,
    "Password must contain at least one special character",
  );

/**
 * Registration form validation schema
 */
export const registerSchema = z
  .object({
    name: z
      .string()
      .min(2, "Name must be at least 2 characters long")
      .max(50, "Name must be less than 50 characters")
      .regex(/^[a-zA-Z\s]+$/, "Name can only contain letters and spaces"),

    email: z
      .string()
      .email("Please enter a valid email address")
      .min(1, "Email is required")
      .max(254, "Email is too long"), // RFC 5321 limit

    password: passwordSchema,

    confirmPassword: z.string().min(1, "Please confirm your password"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"], // Set error path to confirmPassword field
  });

/**
 * OTP verification schema
 */
export const otpSchema = z.object({
  otp: z
    .string()
    .length(6, "OTP must be exactly 6 digits")
    .regex(/^\d+$/, "OTP must contain only numbers"),
});

/**
 * Type inference from schemas
 */
export type RegisterFormData = z.infer<typeof registerSchema>;
export type OtpFormData = z.infer<typeof otpSchema>;
