const jwt = require('jsonwebtoken');
const { v4: uuidv4 } = require('uuid');

const ACCESS_TOKEN_SECRET = process.env.JWT_SECRET || 'humanet-super-secret-jwt-key-change-in-production';
const REFRESH_TOKEN_SECRET = process.env.JWT_REFRESH_SECRET || 'humanet-super-secret-refresh-key-change-in-production';

const ACCESS_TOKEN_EXPIRY = '24h';
const REFRESH_TOKEN_EXPIRY = '7d';

let tokenBlacklist = new Set();

const initBlacklist = (db) => {
  return db;
};

const generateAccessToken = (payload) => {
  return jwt.sign(
    {
      id: payload.id,
      email: payload.email,
      role: payload.role,
      tokenId: uuidv4()
    },
    ACCESS_TOKEN_SECRET,
    { expiresIn: ACCESS_TOKEN_EXPIRY }
  );
};

const generateRefreshToken = (payload) => {
  return jwt.sign(
    {
      id: payload.id,
      email: payload.email,
      tokenId: uuidv4()
    },
    REFRESH_TOKEN_SECRET,
    { expiresIn: REFRESH_TOKEN_EXPIRY }
  );
};

const generateTokenPair = (payload) => {
  return {
    accessToken: generateAccessToken(payload),
    refreshToken: generateRefreshToken(payload)
  };
};

const verifyAccessToken = (token) => {
  try {
    return jwt.verify(token, ACCESS_TOKEN_SECRET);
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      throw new Error('Token expired');
    }
    throw new Error('Invalid token');
  }
};

const verifyRefreshToken = (token) => {
  try {
    return jwt.verify(token, REFRESH_TOKEN_SECRET);
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      throw new Error('Refresh token expired');
    }
    throw new Error('Invalid refresh token');
  }
};

const blacklistToken = async (token, db = null) => {
  tokenBlacklist.add(token);
  
  if (db) {
    try {
      const tokenBlacklistCollection = db.collection('token_blacklist');
      const decoded = jwt.decode(token);
      await tokenBlacklistCollection.insertOne({
        token,
        tokenId: decoded?.tokenId,
        userId: decoded?.id,
        blacklistedAt: new Date(),
        expiresAt: new Date(decoded?.exp * 1000)
      });
    } catch (error) {
      console.error('Failed to store token in database blacklist:', error);
    }
  }
};

const isTokenBlacklisted = async (token, db = null) => {
  if (tokenBlacklist.has(token)) {
    return true;
  }
  
  if (db) {
    try {
      const tokenBlacklistCollection = db.collection('token_blacklist');
      const blacklisted = await tokenBlacklistCollection.findOne({ token });
      return !!blacklisted;
    } catch (error) {
      console.error('Failed to check token blacklist in database:', error);
    }
  }
  
  return false;
};

const cleanupExpiredTokens = async (db) => {
  if (!db) return;
  
  try {
    const tokenBlacklistCollection = db.collection('token_blacklist');
    await tokenBlacklistCollection.deleteMany({
      expiresAt: { $lt: new Date() }
    });
  } catch (error) {
    console.error('Failed to cleanup expired tokens:', error);
  }
};

const generatePasswordResetToken = (userId) => {
  return jwt.sign(
    { id: userId, purpose: 'password-reset' },
    ACCESS_TOKEN_SECRET,
    { expiresIn: '1h' }
  );
};

const verifyPasswordResetToken = (token) => {
  try {
    const decoded = jwt.verify(token, ACCESS_TOKEN_SECRET);
    if (decoded.purpose !== 'password-reset') {
      throw new Error('Invalid token purpose');
    }
    return decoded;
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      throw new Error('Password reset token expired');
    }
    throw new Error('Invalid password reset token');
  }
};

module.exports = {
  generateAccessToken,
  generateRefreshToken,
  generateTokenPair,
  verifyAccessToken,
  verifyRefreshToken,
  blacklistToken,
  isTokenBlacklisted,
  cleanupExpiredTokens,
  generatePasswordResetToken,
  verifyPasswordResetToken,
  initBlacklist,
  ACCESS_TOKEN_EXPIRY,
  REFRESH_TOKEN_EXPIRY
};
