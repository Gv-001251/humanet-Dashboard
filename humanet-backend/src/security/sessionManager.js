const { getDB } = require('../config/mongodb');

let sessionsCollection = null;
let tokenBlacklistCollection = null;

const memorySessions = new Map(); // tokenId -> session
const memoryBlacklist = new Map(); // token -> expiresAt

const initializeSessionCollections = async () => {
  try {
    const db = getDB();
    if (!db) {
      console.warn('MongoDB not available. Session management will use in-memory fallback.');
      return;
    }

    sessionsCollection = db.collection('sessions');
    tokenBlacklistCollection = db.collection('token_blacklist');

    await sessionsCollection.createIndex({ userId: 1 });
    await sessionsCollection.createIndex({ expiresAt: 1 }, { expireAfterSeconds: 0 });
    await sessionsCollection.createIndex({ tokenId: 1 }, { unique: true });

    await tokenBlacklistCollection.createIndex({ token: 1 }, { unique: true });
    await tokenBlacklistCollection.createIndex({ expiresAt: 1 }, { expireAfterSeconds: 0 });

    console.log('Session collections initialized successfully');
  } catch (error) {
    console.error('Failed to initialize session collections:', error);
  }
};

const createSession = async (userId, email, role, tokenId, expiresAt, ipAddress, userAgent, sessionId) => {
  const session = {
    tokenId,
    sessionId: sessionId || tokenId,
    userId,
    email,
    role,
    createdAt: new Date(),
    expiresAt,
    lastActivity: new Date(),
    ipAddress,
    userAgent,
    isActive: true
  };

  if (sessionsCollection) {
    try {
      await sessionsCollection.insertOne(session);
      return session;
    } catch (error) {
      console.error('Error creating session:', error);
    }
  }

  memorySessions.set(tokenId, session);
  return session;
};

const getSession = async (tokenId) => {
  if (sessionsCollection) {
    try {
      return await sessionsCollection.findOne({ tokenId, isActive: true });
    } catch (error) {
      console.error('Error retrieving session:', error);
    }
  }

  const session = memorySessions.get(tokenId);
  if (session && session.isActive && session.expiresAt > new Date()) {
    return session;
  }

  return null;
};

const updateSessionActivity = async (tokenId) => {
  if (sessionsCollection) {
    try {
      await sessionsCollection.updateOne(
        { tokenId },
        { $set: { lastActivity: new Date() } }
      );
      return;
    } catch (error) {
      console.error('Error updating session activity:', error);
    }
  }

  const session = memorySessions.get(tokenId);
  if (session) {
    session.lastActivity = new Date();
    memorySessions.set(tokenId, session);
  }
};

const invalidateSession = async (tokenId) => {
  if (sessionsCollection) {
    try {
      await sessionsCollection.updateOne(
        { tokenId },
        { $set: { isActive: false, invalidatedAt: new Date() } }
      );
    } catch (error) {
      console.error('Error invalidating session:', error);
    }
  }

  const session = memorySessions.get(tokenId);
  if (session) {
    session.isActive = false;
    session.invalidatedAt = new Date();
    memorySessions.set(tokenId, session);
  }
};

const invalidateAllUserSessions = async (userId) => {
  if (sessionsCollection) {
    try {
      await sessionsCollection.updateMany(
        { userId, isActive: true },
        { $set: { isActive: false, invalidatedAt: new Date() } }
      );
    } catch (error) {
      console.error('Error invalidating user sessions:', error);
    }
  }

  for (const [tokenId, session] of memorySessions.entries()) {
    if (session.userId === userId && session.isActive) {
      session.isActive = false;
      session.invalidatedAt = new Date();
      memorySessions.set(tokenId, session);
    }
  }
};

const getUserActiveSessions = async (userId) => {
  if (sessionsCollection) {
    try {
      return await sessionsCollection
        .find({ userId, isActive: true })
        .sort({ lastActivity: -1 })
        .toArray();
    } catch (error) {
      console.error('Error retrieving user sessions:', error);
    }
  }

  return Array.from(memorySessions.values())
    .filter((session) => session.userId === userId && session.isActive)
    .sort((a, b) => new Date(b.lastActivity) - new Date(a.lastActivity));
};

const blacklistToken = async (token, expiresAt) => {
  if (tokenBlacklistCollection) {
    try {
      await tokenBlacklistCollection.insertOne({
        token,
        blacklistedAt: new Date(),
        expiresAt
      });
      return true;
    } catch (error) {
      console.error('Error blacklisting token:', error);
    }
  }

  memoryBlacklist.set(token, expiresAt);
  return true;
};

const isTokenBlacklisted = async (token) => {
  if (tokenBlacklistCollection) {
    try {
      const blacklisted = await tokenBlacklistCollection.findOne({ token });
      if (blacklisted) {
        return true;
      }
    } catch (error) {
      console.error('Error checking token blacklist:', error);
    }
  }

  if (memoryBlacklist.has(token)) {
    const expiresAt = memoryBlacklist.get(token);
    if (expiresAt > new Date()) {
      return true;
    }
    memoryBlacklist.delete(token);
  }

  return false;
};

const cleanupExpiredSessions = async () => {
  if (!sessionsCollection || !tokenBlacklistCollection) {
    return;
  }

  try {
    const now = new Date();
    await sessionsCollection.deleteMany({
      expiresAt: { $lt: now }
    });
    await tokenBlacklistCollection.deleteMany({
      expiresAt: { $lt: now }
    });
  } catch (error) {
    console.error('Error cleaning up expired sessions:', error);
  }
};

module.exports = {
  initializeSessionCollections,
  createSession,
  getSession,
  updateSessionActivity,
  invalidateSession,
  invalidateAllUserSessions,
  getUserActiveSessions,
  blacklistToken,
  isTokenBlacklisted,
  cleanupExpiredSessions
};
