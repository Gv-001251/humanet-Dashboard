const bcrypt = require('bcrypt');

const SALT_ROUNDS = 12;

const PASSWORD_REGEX = {
  MIN_LENGTH: 8,
  UPPERCASE: /[A-Z]/,
  LOWERCASE: /[a-z]/,
  NUMBER: /[0-9]/,
  SPECIAL: /[!@#$%^&*(),.?":{}|<>]/
};

const hashPassword = async (password) => {
  try {
    return await bcrypt.hash(password, SALT_ROUNDS);
  } catch (error) {
    throw new Error('Failed to hash password');
  }
};

const comparePassword = async (password, hashedPassword) => {
  try {
    return await bcrypt.compare(password, hashedPassword);
  } catch (error) {
    throw new Error('Failed to compare passwords');
  }
};

const validatePasswordStrength = (password) => {
  const errors = [];

  if (!password || password.length < PASSWORD_REGEX.MIN_LENGTH) {
    errors.push(`Password must be at least ${PASSWORD_REGEX.MIN_LENGTH} characters long`);
  }

  if (!PASSWORD_REGEX.UPPERCASE.test(password)) {
    errors.push('Password must contain at least one uppercase letter');
  }

  if (!PASSWORD_REGEX.LOWERCASE.test(password)) {
    errors.push('Password must contain at least one lowercase letter');
  }

  if (!PASSWORD_REGEX.NUMBER.test(password)) {
    errors.push('Password must contain at least one number');
  }

  if (!PASSWORD_REGEX.SPECIAL.test(password)) {
    errors.push('Password must contain at least one special character (!@#$%^&*(),.?":{}|<>)');
  }

  return {
    isValid: errors.length === 0,
    errors
  };
};

const calculatePasswordStrength = (password) => {
  let strength = 0;
  
  if (password.length >= PASSWORD_REGEX.MIN_LENGTH) strength += 20;
  if (password.length >= 12) strength += 10;
  if (password.length >= 16) strength += 10;
  
  if (PASSWORD_REGEX.UPPERCASE.test(password)) strength += 15;
  if (PASSWORD_REGEX.LOWERCASE.test(password)) strength += 15;
  if (PASSWORD_REGEX.NUMBER.test(password)) strength += 15;
  if (PASSWORD_REGEX.SPECIAL.test(password)) strength += 15;
  
  const uniqueChars = new Set(password).size;
  if (uniqueChars >= 8) strength += 10;

  return Math.min(strength, 100);
};

const isPasswordInHistory = async (newPassword, passwordHistory = []) => {
  for (const oldHashedPassword of passwordHistory) {
    const isSame = await comparePassword(newPassword, oldHashedPassword);
    if (isSame) {
      return true;
    }
  }
  return false;
};

module.exports = {
  hashPassword,
  comparePassword,
  validatePasswordStrength,
  calculatePasswordStrength,
  isPasswordInHistory,
  SALT_ROUNDS
};
