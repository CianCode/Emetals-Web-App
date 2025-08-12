/**
 * ============================
 * Auth Form Data Types
 * ============================
 */

/** Registration form data */
export interface RegisterFormData {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
}

/** Login form data */
export interface LoginFormData {
  email: string;
  password: string;
}

/** Forgot password form data */
export interface ForgotPasswordFormData {
  email: string;
}

/** OTP verification form data */
export interface OtpFormData {
  otp: string;
}

/** Reset password form data */
export interface ResetPasswordFormData {
  password: string;
  confirmPassword: string;
}

/**
 * ============================
 * API Response Types
 * ============================
 */
export interface AuthResponse {
  success: boolean;
  message: string;
  data?:
    | RegisterFormData
    | LoginFormData
    | ForgotPasswordFormData
    | ResetPasswordFormData
    | OtpFormData
    | null;
  error?: string;
}

/**
 * ============================
 * Step Enums for Multi-Step Forms
 * ============================
 */
export enum RegistrationStep {
  FORM = "form",
  OTP_VERIFICATION = "otp_verification",
}

export enum LoginStep {
  FORM = "form",
  SUCCESS = "success",
}

export enum PasswordResetStep {
  EMAIL = "email",
  OTP_VERIFICATION = "otp_verification",
  RESET_PASSWORD = "reset_password",
}

/**
 * ============================
 * UI Error & Alert Types
 * ============================
 */
export interface FieldError {
  message: string;
}

export type AlertType = "success" | "error" | "warning" | "info";

export interface GlobalAlertProps {
  type: AlertType;
  title: string;
  message: string;
  isVisible: boolean;
  onClose: () => void;
}

/**
 * ============================
 * State Types
 * ============================
 */
export interface RegistrationState {
  step: RegistrationStep;
  email: string;
  isLoading: boolean;
  error: string | null;
  success: string | null;
}

export interface LoginState {
  step: LoginStep;
  isLoading: boolean;
  error: string | null;
  success: string | null;
}

export interface PasswordResetState {
  step: PasswordResetStep;
  email: string;
  otp: string; // Store OTP for final reset
  isLoading: boolean;
  error: string | null;
  success: string | null;
}
