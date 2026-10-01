// Mirrors server/src/validators. Each returns an error string or "" when valid.

export const validateName = (value, label = "Name") => {
  const length = value.trim().length;
  if (length < 20 || length > 60) {
    return `${label} must be 20 to 60 characters (now ${length}).`;
  }
  return "";
};

export const validateEmail = (value) =>
  /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim())
    ? ""
    : "Enter a valid email address, like name@example.com.";

export const validateAddress = (value) => {
  const length = value.trim().length;
  if (length === 0) return "Address is required.";
  if (length > 400) return `Address must be 400 characters or fewer (now ${length}).`;
  return "";
};

export const validatePassword = (value) => {
  if (value.length < 8 || value.length > 16) {
    return "Password must be 8 to 16 characters.";
  }
  if (!/[A-Z]/.test(value)) return "Password needs at least one uppercase letter.";
  if (!/[^A-Za-z0-9]/.test(value)) return "Password needs at least one special character.";
  return "";
};

export const hasErrors = (errors) => Object.values(errors).some(Boolean);

export const ROLE_LABELS = {
  ADMIN: "Administrator",
  USER: "User",
  STORE_OWNER: "Store owner",
};
