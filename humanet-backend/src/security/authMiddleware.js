const { verifyAccessToken } = require('./jwtUtils');
const { isTokenBlacklisted, updateSessionActivity } = require('./sessionManager');

const authenticateToken = async (req, res, next) => {
  try {
    const accessToken = req.cookies?.accessToken;
    
    if (!accessToken) {
      return res.status(401).json({
        success: false,
        message: 'Access token is required. Please login.'
      });
    }

    const blacklisted = await isTokenBlacklisted(accessToken);
    if (blacklisted) {
      return res.status(401).json({
        success: false,
        message: 'Token has been revoked. Please login again.'
      });
    }

    const decoded = verifyAccessToken(accessToken);

    req.user = {
      userId: decoded.userId,
      email: decoded.email,
      role: decoded.role
    };

    if (decoded.tokenId) {
      await updateSessionActivity(decoded.tokenId);
    }

    next();
  } catch (error) {
    if (error.message.includes('expired')) {
      return res.status(401).json({
        success: false,
        message: 'Access token expired. Please refresh your token.',
        code: 'TOKEN_EXPIRED'
      });
    }

    return res.status(401).json({
      success: false,
      message: 'Invalid access token',
      error: error.message
    });
  }
};

const authorizeRoles = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required'
      });
    }

    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: `Access denied. Required role: ${allowedRoles.join(' or ')}`
      });
    }

    next();
  };
};

const optionalAuth = async (req, res, next) => {
  try {
    const accessToken = req.cookies?.accessToken;

    if (!accessToken) {
      return next();
    }

    const blacklisted = await isTokenBlacklisted(accessToken);
    if (blacklisted) {
      return next();
    }

    const decoded = verifyAccessToken(accessToken);

    req.user = {
      userId: decoded.userId,
      email: decoded.email,
      role: decoded.role
    };

    next();
  } catch (error) {
    next();
  }
};

module.exports = {
  authenticateToken,
  authorizeRoles,
  optionalAuth
};
