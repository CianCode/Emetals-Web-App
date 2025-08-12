/**
 * Barrel export for authentication components
 * Provides a clean import interface for auth-related components
 */

// Registration components
export { RegisterForm } from "./register-form";
export { RegisterFields } from "./register-fields";

// Login components
export { LoginForm } from "./login-form";

// Password reset components
export { ForgotPasswordForm } from "./forgot-password-form";
export { ForgotPasswordFields } from "./forgot-password-fields";
export { ResetPasswordForm } from "./reset-password-form";

// Shared components
export { OtpVerificationForm } from "./otp-verification-form";
export { FormErrorMessage } from "./form-error-message";
export { GlobalAlert } from "./global-alert";
export { default as PasswordStrengthBar } from "./password-strength-bar";
