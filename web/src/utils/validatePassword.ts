/**
 * Validates password complexity requirements
 * @param password - Password to validate
 * @returns Empty string if valid, error message if invalid
 */
export const validatePassword = (password: string): string => {
  const hasUpperCase = /[A-Z]/.test(password);
  const hasNonAlphanumeric = /[^a-zA-Z0-9]/.test(password);

  if (!hasUpperCase) {
    return 'Password must contain at least one uppercase letter';
  }
  if (!hasNonAlphanumeric) {
    return 'Password must contain at least one special character';
  }
  return '';
};
