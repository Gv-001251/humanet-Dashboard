const jwt = require('jsonwebtoken');
const { v4: uuidv4 } = require('uuid');

const JWT_SECRET = process.env.JWT_SECRET || 'your-super-secret-jwt-key-change-in-production';
const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET || 'your-super-secret-refresh-key-change-in-production';

const ACCESS_TOKEN_EXPIRY = '24h';
const REFRESH_TOKEN_EXPIRY = '7d';

const generateAccessToken = ({ userId, email, role, sessionId }) => {
  const tokenId = uuidv4();

  return {
    token: jwt.sign(
      {
        userId,
        email,
        role,
        sessionId,
        tokenId,
        type: 'access'
      },
      JWT_SECRET,
      { expiresIn: ACCESS_TOKEN_EXPIRY }
    ),
    tokenId
  };
};

const generateRefreshToken = ({ userId, email, role, sessionId }) => {
  const tokenId = uuidv4();

  return {
    token: jwt.sign(
      {
        userId,
        email,
        role,
        sessionId,
        tokenId,
        type: 'refresh'
      },
      JWT_REFRESH_SECRET,
      { expiresIn: REFRESH_TOKEN_EXPIRY }
    ),
    tokenId
  };
};

const verifyAccessToken = (token) => {
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    if (decoded.type !== 'access') {
      throw new Error('Invalid token type');
    }
    return decoded;
  } catch (error) {
    if (error instanceof jwt.TokenExpiredError) {
      throw new Error('Access token expired');
    }
    throw new Error('Invalid or expired access token');
  }
};

const verifyRefreshToken = (token) => {
  try {
    const decoded = jwt.verify(token, JWT_REFRESH_SECRET);
    if (decoded.type !== 'refresh') {
      throw new Error('Invalid token type');
    }
    return decoded;
  } catch (error) {
    if (error instanceof jwt.TokenExpiredError) {
      throw new Error('Refresh token expired');
    }
    throw new Error('Invalid or expired refresh token');
  }
};

const generatePasswordResetToken = (userId, email) => {
  return jwt.sign(
    {
      userId,
      email,
      type: 'password-reset'
    },
    JWT_SECRET,
    { expiresIn: '1h' }
  );
};

const verifyPasswordResetToken = (token) => {
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    if (decoded.type !== 'password-reset') {
      throw new Error('Invalid token type');
    }
    return decoded;
  } catch (error) {
    if (error instanceof jwt.TokenExpiredError) {
      throw new Error('Password reset token expired');
    }
    throw new Error('Invalid or expired password reset token');
  }
};

module.exports = {
  ACCESS_TOKEN_EXPIRY,
  REFRESH_TOKEN_EXPIRY,
  generateAccessToken,
  generateRefreshToken,
  verifyAccessToken,
  verifyRefreshToken,
  generatePasswordResetToken,
  verifyPasswordResetToken,
  JWT_SECRET,
  JWT_REFRESH_SECRET
};
