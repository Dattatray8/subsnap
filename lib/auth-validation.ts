export interface ValidationResult {
  valid: boolean;
  message?: string;
}

/**
 * Validates email format using a practical regex pattern
 */
export const validateEmail = (email: string): ValidationResult => {
  if (!email.trim()) {
    return { valid: false, message: "Email is required" };
  }

  // Simple but practical email regex
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return { valid: false, message: "Please enter a valid email address" };
  }

  return { valid: true };
};

/**
 * Validates password strength
 * Min 8 characters required
 */
export const validatePassword = (password: string): ValidationResult => {
  if (!password) {
    return { valid: false, message: "Password is required" };
  }

  if (password.length < 8) {
    return { valid: false, message: "Password must be at least 8 characters" };
  }

  return { valid: true };
};

/**
 * Validates password confirmation matches password
 */
export const validatePasswordMatch = (
  password: string,
  confirmPassword: string,
): ValidationResult => {
  if (!confirmPassword) {
    return { valid: false, message: "Please confirm your password" };
  }

  if (password !== confirmPassword) {
    return { valid: false, message: "Passwords do not match" };
  }

  return { valid: true };
};

/**
 * Validates verification code (6 digits)
 */
export const validateVerificationCode = (code: string): ValidationResult => {
  if (!code.trim()) {
    return { valid: false, message: "Verification code is required" };
  }

  if (code.length !== 6 || !/^\d{6}$/.test(code)) {
    return { valid: false, message: "Verification code must be 6 digits" };
  }

  return { valid: true };
};
