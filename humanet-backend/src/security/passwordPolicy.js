const bcrypt = require('bcryptjs');

const SALT_ROUNDS = 12;
const PASSWORD_HISTORY_LIMIT = 3;

const PASSWORD_REQUIREMENTS = [
  {
    test: (password) => password.length >= 8,
    message: 'Password must be at least 8 characters long.'
  },
  {
    test: (password) => /[A-Z]/.test(password),
    message: 'Password must include at least one uppercase letter.'
  },
  {
    test: (password) => /[a-z]/.test(password),
    message: 'Password must include at least one lowercase letter.'
  },
  {
    test: (password) => /\d/.test(password),
    message: 'Password must include at least one number.'
  },
  {
    test: (password) => /[^A-Za-z0-9]/.test(password),
    message: 'Password must include at least one special character.'
  }
];

const validatePasswordStrength = (password) => {
  const failures = PASSWORD_REQUIREMENTS
    .filter((requirement) => !requirement.test(password))
    .map((requirement) => requirement.message);

  const hasLower = /[a-z]/.test(password);
  const hasUpper = /[A-Z]/.test(password);
  const hasNumber = /\d/.test(password);
  const hasSpecial = /[^A-Za-z0-9]/.test(password);
  const lengthScore = Math.min(password.length / 12, 1);

  const diversityScore = [hasLower, hasUpper, hasNumber, hasSpecial]
    .filter(Boolean).
    length / 4;

  const strengthScore = Math.round((0.6 * lengthScore + 0.4 * diversityScore) * 100);

  return {
    isValid: failures.length === 0,
    failures,
    strengthScore: Math.min(strengthScore, 100)
  };
};

const hashPassword = async (password) => {
  return bcrypt.hash(password, SALT_ROUNDS);
};

const comparePassword = async (password, hash) => {
  return bcrypt.compare(password, hash);
};

const isPasswordReused = async (password, history = []) => {
  for (const hash of history.slice(0, PASSWORD_HISTORY_LIMIT)) {
    if (await bcrypt.compare(password, hash)) {
      return true;
    }
  }
  return false;
};

const updatePasswordHistory = (history = [], newHash) => {
  const updatedHistory = [newHash, ...history];
  return updatedHistory.slice(0, PASSWORD_HISTORY_LIMIT);
};

module.exports = {
  SALT_ROUNDS,
  PASSWORD_HISTORY_LIMIT,
  PASSWORD_REQUIREMENTS,
  validatePasswordStrength,
  hashPassword,
  comparePassword,
  isPasswordReused,
  updatePasswordHistory
};
