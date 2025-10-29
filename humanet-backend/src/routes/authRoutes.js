const express = require('express');
const { v4: uuidv4 } = require('uuid');
const {
  findUserByEmail,
  verifyUserPassword,
  recordSuccessfulLogin,
  recordFailedLogin,
  updateUserPassword,
  storePasswordResetToken,
  clearPasswordResetToken,
  findUserById,
  validatePasswordStrength
} = require('../security/userService');
const {
  generateAccessToken,
  generateRefreshToken,
  verifyRefreshToken,
  generatePasswordResetToken,
  verifyPasswordResetToken
} = require('../security/jwtUtils');
const {
  createSession,
  invalidateSession,
  invalidateAllUserSessions,
  blacklistToken,
  getUserActiveSessions,
  isTokenBlacklisted
} = require('../security/sessionManager');
const { authenticateToken } = require('../security/authMiddleware');
const { loginLimiter, passwordResetLimiter } = require('../security/rateLimiter');

const router = express.Router();

const setCookies = (res, accessToken, refreshToken) => {
  const isProduction = process.env.NODE_ENV === 'production';

  res.cookie('accessToken', accessToken, {
    httpOnly: true,
    secure: isProduction,
    sameSite: isProduction ? 'strict' : 'lax',
    maxAge: 24 * 60 * 60 * 1000,
    path: '/'
  });

  res.cookie('refreshToken', refreshToken, {
    httpOnly: true,
    secure: isProduction,
    sameSite: isProduction ? 'strict' : 'lax',
    maxAge: 7 * 24 * 60 * 60 * 1000,
    path: '/'
  });
};

const clearAuthCookies = (res) => {
  res.clearCookie('accessToken', { path: '/' });
  res.clearCookie('refreshToken', { path: '/' });
};

router.post('/login', loginLimiter, async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Email and password are required'
      });
    }

    const user = await findUserByEmail(email);

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password'
      });
    }

    if (user.isLocked) {
      return res.status(423).json({
        success: false,
        message: 'Account is locked due to multiple failed login attempts. Please contact support.'
      });
    }

    const isValidPassword = await verifyUserPassword(user, password);

    if (!isValidPassword) {
      await recordFailedLogin(user.userId);
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password'
      });
    }

    await recordSuccessfulLogin(user.userId);

    const ipAddress = req.ip || req.connection?.remoteAddress;
    const userAgent = req.headers['user-agent'] || 'Unknown';
    const sessionId = uuidv4();

    const refreshAccessExpiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
    const { token: refreshToken, tokenId: refreshTokenId } = generateRefreshToken({
      userId: user.userId,
      email: user.email,
      role: user.role,
      sessionId
    });

    await createSession(
      user.userId,
      user.email,
      user.role,
      refreshTokenId,
      refreshAccessExpiresAt,
      ipAddress,
      userAgent,
      sessionId
    );

    const { token: accessToken } = generateAccessToken({
      userId: user.userId,
      email: user.email,
      role: user.role,
      sessionId
    });

    setCookies(res, accessToken, refreshToken);

    res.json({
      success: true,
      message: 'Login successful',
      user: {
        userId: user.userId,
        email: user.email,
        name: user.name,
        role: user.role
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      success: false,
      message: 'An error occurred during login'
    });
  }
});

router.post('/refresh', async (req, res) => {
  try {
    const refreshToken = req.cookies?.refreshToken;

    if (!refreshToken) {
      return res.status(401).json({
        success: false,
        message: 'Refresh token not found'
      });
    }

    const blacklisted = await isTokenBlacklisted(refreshToken);
    if (blacklisted) {
      return res.status(401).json({
        success: false,
        message: 'Refresh token has been revoked'
      });
    }

    const decoded = verifyRefreshToken(refreshToken);

    const user = await findUserById(decoded.userId);
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'User not found'
      });
    }

    const { token: newAccessToken } = generateAccessToken({
      userId: user.userId,
      email: user.email,
      role: user.role,
      sessionId: decoded.sessionId
    });

    res.cookie('accessToken', newAccessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: process.env.NODE_ENV === 'production' ? 'strict' : 'lax',
      maxAge: 24 * 60 * 60 * 1000,
      path: '/'
    });

    res.json({
      success: true,
      message: 'Access token refreshed successfully'
    });
  } catch (error) {
    console.error('Token refresh error:', error);
    clearAuthCookies(res);
    res.status(401).json({
      success: false,
      message: 'Failed to refresh token. Please login again.'
    });
  }
});

router.post('/logout', authenticateToken, async (req, res) => {
  try {
    const accessToken = req.cookies?.accessToken;
    const refreshToken = req.cookies?.refreshToken;

    if (accessToken) {
      const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000);
      await blacklistToken(accessToken, expiresAt);
    }

    if (refreshToken) {
      const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
      await blacklistToken(refreshToken, expiresAt);

      try {
        const decoded = verifyRefreshToken(refreshToken);
        if (decoded.tokenId) {
          await invalidateSession(decoded.tokenId);
        }
      } catch (error) {
        console.error('Error invalidating session:', error);
      }
    }

    clearAuthCookies(res);

    res.json({
      success: true,
      message: 'Logged out successfully'
    });
  } catch (error) {
    console.error('Logout error:', error);
    clearAuthCookies(res);
    res.status(500).json({
      success: false,
      message: 'An error occurred during logout'
    });
  }
});

router.post('/logout-all', authenticateToken, async (req, res) => {
  try {
    await invalidateAllUserSessions(req.user.userId);

    clearAuthCookies(res);

    res.json({
      success: true,
      message: 'Logged out from all devices successfully'
    });
  } catch (error) {
    console.error('Logout all error:', error);
    res.status(500).json({
      success: false,
      message: 'An error occurred while logging out from all devices'
    });
  }
});

router.get('/sessions', authenticateToken, async (req, res) => {
  try {
    const sessions = await getUserActiveSessions(req.user.userId);

    res.json({
      success: true,
      data: sessions.map((session) => ({
        tokenId: session.tokenId,
        createdAt: session.createdAt,
        lastActivity: session.lastActivity,
        ipAddress: session.ipAddress,
        userAgent: session.userAgent
      }))
    });
  } catch (error) {
    console.error('Get sessions error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve sessions'
    });
  }
});

router.post('/password/forgot', passwordResetLimiter, async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        success: false,
        message: 'Email is required'
      });
    }

    const user = await findUserByEmail(email);

    if (!user) {
      return res.json({
        success: true,
        message: 'If the email exists, a password reset link has been sent.'
      });
    }

    const resetToken = generatePasswordResetToken(user.userId, user.email);
    const expiresAt = new Date(Date.now() + 60 * 60 * 1000);

    await storePasswordResetToken(user.userId, resetToken, expiresAt);

    console.log(`Password reset link: ${process.env.FRONTEND_URL || 'http://localhost:5173'}/reset-password?token=${resetToken}`);

    res.json({
      success: true,
      message: 'If the email exists, a password reset link has been sent.',
      resetToken
    });
  } catch (error) {
    console.error('Forgot password error:', error);
    res.status(500).json({
      success: false,
      message: 'An error occurred while processing your request'
    });
  }
});

router.post('/password/reset', async (req, res) => {
  try {
    const { token, newPassword } = req.body;

    if (!token || !newPassword) {
      return res.status(400).json({
        success: false,
        message: 'Token and new password are required'
      });
    }

    const decoded = verifyPasswordResetToken(token);

    const user = await findUserById(decoded.userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    const passwordCheck = validatePasswordStrength(newPassword);
    if (!passwordCheck.isValid) {
      return res.status(400).json({
        success: false,
        message: 'Password does not meet requirements',
        failures: passwordCheck.failures
      });
    }

    await updateUserPassword(user.userId, newPassword);
    await clearPasswordResetToken(user.userId);
    await invalidateAllUserSessions(user.userId);

    res.json({
      success: true,
      message: 'Password has been reset successfully. Please login with your new password.'
    });
  } catch (error) {
    console.error('Password reset error:', error);

    if (error.message.includes('expired') || error.message.includes('Invalid')) {
      return res.status(400).json({
        success: false,
        message: 'Invalid or expired reset token'
      });
    }

    if (error.message.includes('reuse')) {
      return res.status(400).json({
        success: false,
        message: error.message
      });
    }

    res.status(500).json({
      success: false,
      message: 'An error occurred while resetting password'
    });
  }
});

router.post('/password/change', authenticateToken, async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({
        success: false,
        message: 'Current password and new password are required'
      });
    }

    const user = await findUserById(req.user.userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    const isValidPassword = await verifyUserPassword(user, currentPassword);
    if (!isValidPassword) {
      return res.status(401).json({
        success: false,
        message: 'Current password is incorrect'
      });
    }

    const passwordCheck = validatePasswordStrength(newPassword);
    if (!passwordCheck.isValid) {
      return res.status(400).json({
        success: false,
        message: 'Password does not meet requirements',
        failures: passwordCheck.failures
      });
    }

    await updateUserPassword(user.userId, newPassword);

    res.json({
      success: true,
      message: 'Password has been changed successfully'
    });
  } catch (error) {
    console.error('Password change error:', error);

    if (error.message.includes('reuse')) {
      return res.status(400).json({
        success: false,
        message: error.message
      });
    }

    res.status(500).json({
      success: false,
      message: 'An error occurred while changing password'
    });
  }
});

router.post('/password/validate', (req, res) => {
  try {
    const { password } = req.body;

    if (!password) {
      return res.status(400).json({
        success: false,
        message: 'Password is required'
      });
    }

    const result = validatePasswordStrength(password);

    res.json({
      success: true,
      data: result
    });
  } catch (error) {
    console.error('Password validation error:', error);
    res.status(500).json({
      success: false,
      message: 'An error occurred while validating password'
    });
  }
});

router.get('/me', authenticateToken, async (req, res) => {
  try {
    const user = await findUserById(req.user.userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    res.json({
      success: true,
      user: {
        userId: user.userId,
        email: user.email,
        name: user.name,
        role: user.role,
        lastLoginAt: user.lastLoginAt,
        passwordChangedAt: user.passwordChangedAt,
        createdAt: user.createdAt
      }
    });
  } catch (error) {
    console.error('Get user error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve user information'
    });
  }
});

module.exports = router;
