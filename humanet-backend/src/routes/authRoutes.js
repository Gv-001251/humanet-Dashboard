const express = require('express');
const { body, validationResult } = require('express-validator');
const {
  findUserByEmail,
  findUserById,
  addUser,
  updateUserPassword,
  sanitizeUser,
  recordFailedLoginAttempt,
  resetLoginAttempts
} = require('../data/userStore');
const {
  comparePassword,
  hashPassword,
  validatePasswordStrength,
  calculatePasswordStrength,
  isPasswordInHistory
} = require('../utils/passwordUtils');
const {
  generateTokenPair,
  verifyRefreshToken,
  blacklistToken,
  generatePasswordResetToken,
  verifyPasswordResetToken
} = require('../utils/jwtUtils');
const {
  accessTokenCookieOptions,
  refreshTokenCookieOptions,
  clearCookieOptions
} = require('../utils/cookieOptions');
const { authenticate } = require('../middleware/authMiddleware');

const router = express.Router();

router.post(
  '/login',
  [
    body('email').isEmail().normalizeEmail().withMessage('Valid email is required'),
    body('password').notEmpty().withMessage('Password is required')
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          success: false,
          message: 'Validation failed',
          errors: errors.array()
        });
      }

      const { email, password } = req.body;

      const user = findUserByEmail(email);
      if (!user) {
        return res.status(401).json({
          success: false,
          message: 'Invalid email or password'
        });
      }

      if (user.lockedUntil && new Date() < user.lockedUntil) {
        const minutesLeft = Math.ceil((user.lockedUntil - new Date()) / 60000);
        return res.status(403).json({
          success: false,
          message: `Account is temporarily locked. Please try again in ${minutesLeft} minutes.`,
          code: 'ACCOUNT_LOCKED'
        });
      }

      const isPasswordValid = await comparePassword(password, user.passwordHash);
      if (!isPasswordValid) {
        await recordFailedLoginAttempt(user.id);
        const updatedUser = findUserById(user.id);

        if (updatedUser.failedLoginAttempts >= 5) {
          return res.status(403).json({
            success: false,
            message: 'Account locked due to multiple failed login attempts. Please try again in 15 minutes.',
            code: 'ACCOUNT_LOCKED'
          });
        }

        return res.status(401).json({
          success: false,
          message: 'Invalid email or password',
          attemptsRemaining: 5 - updatedUser.failedLoginAttempts
        });
      }

      await resetLoginAttempts(user.id);

      const { accessToken, refreshToken } = generateTokenPair({
        id: user.id,
        email: user.email,
        role: user.role
      });

      res.cookie('accessToken', accessToken, accessTokenCookieOptions);
      res.cookie('refreshToken', refreshToken, refreshTokenCookieOptions);

      const safeUser = sanitizeUser(user);
      res.json({
        success: true,
        message: 'Login successful',
        token: accessToken,
        refreshToken,
        user: safeUser
      });
    } catch (error) {
      console.error('Login error:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error during login'
      });
    }
  }
);

router.post('/register', [
  body('email').isEmail().normalizeEmail().withMessage('Valid email is required'),
  body('name').notEmpty().trim().withMessage('Name is required'),
  body('password').isLength({ min: 8 }).withMessage('Password must be at least 8 characters'),
  body('role').optional().isIn(['employee', 'hr', 'admin', 'team_lead']).withMessage('Invalid role')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const { email, name, password, role = 'employee' } = req.body;

    const existingUser = findUserByEmail(email);
    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: 'User with this email already exists'
      });
    }

    const passwordValidation = validatePasswordStrength(password);
    if (!passwordValidation.isValid) {
      return res.status(400).json({
        success: false,
        message: 'Password does not meet security requirements',
        errors: passwordValidation.errors
      });
    }

    const user = await addUser({ email, name, password, role });

    const { accessToken, refreshToken } = generateTokenPair({
      id: user.id,
      email: user.email,
      role: user.role
    });

    res.cookie('accessToken', accessToken, accessTokenCookieOptions);
    res.cookie('refreshToken', refreshToken, refreshTokenCookieOptions);

    const safeUser = sanitizeUser(user);
    res.status(201).json({
      success: true,
      message: 'User registered successfully',
      token: accessToken,
      refreshToken,
      user: safeUser
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error during registration'
    });
  }
});

router.post('/refresh', async (req, res) => {
  try {
    let refreshToken = req.cookies?.refreshToken;

    if (!refreshToken && req.body.refreshToken) {
      refreshToken = req.body.refreshToken;
    }

    if (!refreshToken) {
      return res.status(401).json({
        success: false,
        message: 'Refresh token required',
        code: 'NO_REFRESH_TOKEN'
      });
    }

    const decoded = verifyRefreshToken(refreshToken);
    const user = findUserById(decoded.id);

    if (!user || user.status !== 'active') {
      return res.status(401).json({
        success: false,
        message: 'User not found or inactive',
        code: 'INVALID_USER'
      });
    }

    const { accessToken, refreshToken: newRefreshToken } = generateTokenPair({
      id: user.id,
      email: user.email,
      role: user.role
    });

    res.cookie('accessToken', accessToken, accessTokenCookieOptions);
    res.cookie('refreshToken', newRefreshToken, refreshTokenCookieOptions);

    res.json({
      success: true,
      token: accessToken,
      refreshToken: newRefreshToken
    });
  } catch (error) {
    console.error('Token refresh error:', error);
    res.status(401).json({
      success: false,
      message: error.message || 'Invalid refresh token',
      code: 'REFRESH_FAILED'
    });
  }
});

router.post('/logout', authenticate, async (req, res) => {
  try {
    const token = req.token;
    const refreshToken = req.cookies?.refreshToken || req.body.refreshToken;

    if (token) {
      await blacklistToken(token, req.db);
    }

    if (refreshToken) {
      await blacklistToken(refreshToken, req.db);
    }

    res.clearCookie('accessToken', clearCookieOptions);
    res.clearCookie('refreshToken', clearCookieOptions);

    res.json({
      success: true,
      message: 'Logged out successfully'
    });
  } catch (error) {
    console.error('Logout error:', error);
    res.status(500).json({
      success: false,
      message: 'Error during logout'
    });
  }
});

router.post('/change-password', authenticate, [
  body('currentPassword').notEmpty().withMessage('Current password is required'),
  body('newPassword').isLength({ min: 8 }).withMessage('New password must be at least 8 characters')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const { currentPassword, newPassword } = req.body;
    const user = findUserById(req.user.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    const isCurrentPasswordValid = await comparePassword(currentPassword, user.passwordHash);
    if (!isCurrentPasswordValid) {
      return res.status(401).json({
        success: false,
        message: 'Current password is incorrect'
      });
    }

    const passwordValidation = validatePasswordStrength(newPassword);
    if (!passwordValidation.isValid) {
      return res.status(400).json({
        success: false,
        message: 'New password does not meet security requirements',
        errors: passwordValidation.errors
      });
    }

    const isInHistory = await isPasswordInHistory(newPassword, user.passwordHistory || []);
    if (isInHistory) {
      return res.status(400).json({
        success: false,
        message: 'Cannot reuse any of your last 3 passwords'
      });
    }

    const newPasswordHash = await hashPassword(newPassword);
    await updateUserPassword(user.id, newPasswordHash);

    res.json({
      success: true,
      message: 'Password changed successfully'
    });
  } catch (error) {
    console.error('Change password error:', error);
    res.status(500).json({
      success: false,
      message: 'Error changing password'
    });
  }
});

router.post('/forgot-password', [
  body('email').isEmail().normalizeEmail().withMessage('Valid email is required')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const { email } = req.body;
    const user = findUserByEmail(email);

    if (!user) {
      return res.json({
        success: true,
        message: 'If the email exists, a password reset link has been sent'
      });
    }

    const resetToken = generatePasswordResetToken(user.id);

    console.log(`Password reset token for ${email}: ${resetToken}`);

    res.json({
      success: true,
      message: 'If the email exists, a password reset link has been sent',
      resetToken
    });
  } catch (error) {
    console.error('Forgot password error:', error);
    res.status(500).json({
      success: false,
      message: 'Error processing password reset request'
    });
  }
});

router.post('/reset-password', [
  body('token').notEmpty().withMessage('Reset token is required'),
  body('newPassword').isLength({ min: 8 }).withMessage('New password must be at least 8 characters')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const { token, newPassword } = req.body;

    const decoded = verifyPasswordResetToken(token);
    const user = findUserById(decoded.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    const passwordValidation = validatePasswordStrength(newPassword);
    if (!passwordValidation.isValid) {
      return res.status(400).json({
        success: false,
        message: 'New password does not meet security requirements',
        errors: passwordValidation.errors
      });
    }

    const isInHistory = await isPasswordInHistory(newPassword, user.passwordHistory || []);
    if (isInHistory) {
      return res.status(400).json({
        success: false,
        message: 'Cannot reuse any of your last 3 passwords'
      });
    }

    const newPasswordHash = await hashPassword(newPassword);
    await updateUserPassword(user.id, newPasswordHash);

    res.json({
      success: true,
      message: 'Password has been reset successfully'
    });
  } catch (error) {
    console.error('Reset password error:', error);
    res.status(400).json({
      success: false,
      message: error.message || 'Error resetting password'
    });
  }
});

router.post('/validate-password', [
  body('password').notEmpty().withMessage('Password is required')
], (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const { password } = req.body;
    const validation = validatePasswordStrength(password);
    const strength = calculatePasswordStrength(password);

    res.json({
      success: true,
      isValid: validation.isValid,
      errors: validation.errors,
      strength,
      strengthLabel: strength < 40 ? 'Weak' : strength < 70 ? 'Medium' : 'Strong'
    });
  } catch (error) {
    console.error('Validate password error:', error);
    res.status(500).json({
      success: false,
      message: 'Error validating password'
    });
  }
});

router.get('/me', authenticate, (req, res) => {
  try {
    const user = findUserById(req.user.id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    const safeUser = sanitizeUser(user);
    res.json({
      success: true,
      user: safeUser
    });
  } catch (error) {
    console.error('Get current user error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching user information'
    });
  }
});

module.exports = router;
