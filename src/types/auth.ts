/**
 * Authentication form data types
 */
export interface RegisterFormData {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
}

/**
 * OTP verification form data
 */
export interface OtpFormData {
  otp: string;
}

/**
 * API response types for authentication
 */
export interface AuthResponse {
  success: boolean;
  message: string;
  data?: RegisterFormData | OtpFormData | null;
  error?: string;
}

/**
 * Registration step enum for multi-step form
 */
export enum RegistrationStep {
  FORM = "form",
  OTP_VERIFICATION = "otp_verification",
}

/**
 * Form field error type
 */
export interface FieldError {
  message: string;
}

/**
 * Global alert types
 */
export type AlertType = "success" | "error" | "warning" | "info";

export interface GlobalAlertProps {
  type: AlertType;
  title: string;
  message: string;
  isVisible: boolean;
  onClose: () => void;
}

/**
 * User registration state
 */
export interface RegistrationState {
  step: RegistrationStep;
  email: string;
  isLoading: boolean;
  error: string | null;
  success: string | null;
}
