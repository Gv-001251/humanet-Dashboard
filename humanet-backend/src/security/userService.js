const { v4: uuidv4 } = require('uuid');
const { getDB } = require('../config/mongodb');
const {
  hashPassword,
  comparePassword,
  isPasswordReused,
  updatePasswordHistory,
  validatePasswordStrength
} = require('./passwordPolicy');

let usersCollection = null;
const inMemoryUsers = new Map();
const inMemoryResetTokens = new Map();

const sanitizeUser = (user) => {
  if (!user) {
    return null;
  }

  const {
    passwordHash,
    passwordHistory,
    passwordResetToken,
    passwordResetExpiresAt,
    loginAttempts,
    isLocked,
    lockedAt,
    ...safeUser
  } = user;

  return {
    ...safeUser,
    id: safeUser.userId,
    userId: safeUser.userId,
    loginAttempts: typeof loginAttempts === 'number' ? loginAttempts : undefined,
    isLocked: typeof isLocked === 'boolean' ? isLocked : undefined
  };
};

const initializeUsersCollection = async () => {
  try {
    const db = getDB();
    if (!db) {
      console.warn('MongoDB not available. User service using in-memory storage.');
      return;
    }

    usersCollection = db.collection('users');

    await usersCollection.createIndex({ email: 1 }, { unique: true });
    await usersCollection.createIndex({ userId: 1 }, { unique: true });
  } catch (error) {
    console.error('Failed to initialize users collection:', error);
  }
};

const seedDefaultUsers = async () => {
  const defaultUsers = [
    {
      userId: 'user1',
      email: 'hr@humanet.com',
      name: 'Gayathri G',
      role: 'hr',
      password: 'Hr@Secure123'
    },
    {
      userId: 'user2',
      email: 'admin@humanet.com',
      name: 'Alex Doe',
      role: 'admin',
      password: 'Admin@Secure123'
    },
    {
      userId: 'user3',
      email: 'lead@humanet.com',
      name: 'Priya Singh',
      role: 'team_lead',
      password: 'Lead@Secure123'
    },
    {
      userId: 'user4',
      email: 'ceo@humanet.com',
      name: 'Vikram Rao',
      role: 'ceo',
      password: 'Ceo@Secure123'
    },
    {
      userId: 'user5',
      email: 'investor@humanet.com',
      name: 'Nisha Patel',
      role: 'investor',
      password: 'Investor@Secure123'
    }
  ];

  for (const user of defaultUsers) {
    await createUser({
      userId: user.userId,
      email: user.email,
      name: user.name,
      role: user.role,
      password: user.password,
      force: true
    });
  }
};

const getCollectionOrMemory = () => {
  const db = getDB();
  if (db && usersCollection) {
    return usersCollection;
  }
  return null;
};

const createUser = async ({ userId, email, name, role, password, force = false }) => {
  const passwordCheck = validatePasswordStrength(password);
  if (!passwordCheck.isValid && !force) {
    throw new Error(passwordCheck.failures.join(' '));
  }

  const passwordHash = await hashPassword(password);
  const passwordHistory = updatePasswordHistory([], passwordHash);

  const user = {
    userId: userId || uuidv4(),
    email: email.toLowerCase(),
    name,
    role: role || 'hr',
    passwordHash,
    passwordHistory,
    createdAt: new Date(),
    updatedAt: new Date(),
    lastLoginAt: null,
    loginAttempts: 0,
    isLocked: false,
    passwordChangedAt: new Date()
  };

  const collection = getCollectionOrMemory();

  if (collection) {
    try {
      await collection.updateOne(
        { email: user.email },
        { $setOnInsert: user },
        { upsert: true }
      );
    } catch (error) {
      if (!force) {
        throw error;
      }
    }
  } else {
    inMemoryUsers.set(user.email, user);
  }

  return user;
};

const findUserByEmail = async (email) => {
  if (!email) return null;

  const normalizedEmail = email.toLowerCase();
  const collection = getCollectionOrMemory();

  if (collection) {
    const user = await collection.findOne({ email: normalizedEmail });
    return user;
  }

  return inMemoryUsers.get(normalizedEmail) || null;
};

const findUserById = async (userId) => {
  if (!userId) return null;

  const collection = getCollectionOrMemory();

  if (collection) {
    return await collection.findOne({ userId });
  }

  for (const user of inMemoryUsers.values()) {
    if (user.userId === userId) {
      return user;
    }
  }

  return null;
};

const verifyUserPassword = async (user, password) => {
  if (!user) return false;
  return comparePassword(password, user.passwordHash);
};

const updateUserPassword = async (userId, newPassword) => {
  const user = await findUserById(userId);
  if (!user) {
    throw new Error('User not found');
  }

  const isReused = await isPasswordReused(newPassword, user.passwordHistory);
  if (isReused) {
    throw new Error('You cannot reuse your recent passwords.');
  }

  const passwordCheck = validatePasswordStrength(newPassword);
  if (!passwordCheck.isValid) {
    throw new Error(passwordCheck.failures.join(' '));
  }

  const newHash = await hashPassword(newPassword);
  const updatedHistory = updatePasswordHistory(user.passwordHistory, newHash);

  const update = {
    $set: {
      passwordHash: newHash,
      passwordHistory: updatedHistory,
      passwordChangedAt: new Date(),
      updatedAt: new Date(),
      isLocked: false,
      loginAttempts: 0
    }
  };

  const collection = getCollectionOrMemory();

  if (collection) {
    await collection.updateOne({ userId }, update);
  } else {
    const updatedUser = {
      ...user,
      passwordHash: newHash,
      passwordHistory: updatedHistory,
      passwordChangedAt: new Date(),
      updatedAt: new Date(),
      isLocked: false,
      loginAttempts: 0
    };
    inMemoryUsers.set(user.email, updatedUser);
  }

  return true;
};

const recordSuccessfulLogin = async (userId) => {
  const collection = getCollectionOrMemory();

  if (collection) {
    await collection.updateOne(
      { userId },
      {
        $set: {
          lastLoginAt: new Date(),
          loginAttempts: 0,
          isLocked: false
        }
      }
    );
  } else {
    const user = await findUserById(userId);
    if (user) {
      inMemoryUsers.set(user.email, {
        ...user,
        lastLoginAt: new Date(),
        loginAttempts: 0,
        isLocked: false
      });
    }
  }
};

const recordFailedLogin = async (userId) => {
  const collection = getCollectionOrMemory();

  if (collection) {
    await collection.updateOne(
      { userId },
      {
        $inc: { loginAttempts: 1 },
        $set: { updatedAt: new Date() }
      }
    );
  } else {
    const user = await findUserById(userId);
    if (user) {
      const loginAttempts = (user.loginAttempts || 0) + 1;
      const isLocked = loginAttempts >= 5;

      inMemoryUsers.set(user.email, {
        ...user,
        loginAttempts,
        isLocked,
        updatedAt: new Date()
      });
    }
  }
};

const lockUserAccount = async (userId) => {
  const collection = getCollectionOrMemory();

  if (collection) {
    await collection.updateOne(
      { userId },
      { $set: { isLocked: true, lockedAt: new Date() } }
    );
  } else {
    const user = await findUserById(userId);
    if (user) {
      inMemoryUsers.set(user.email, {
        ...user,
        isLocked: true,
        lockedAt: new Date()
      });
    }
  }
};

const storePasswordResetToken = async (userId, token, expiresAt) => {
  const collection = getCollectionOrMemory();

  if (collection) {
    await collection.updateOne(
      { userId },
      {
        $set: {
          passwordResetToken: token,
          passwordResetExpiresAt: expiresAt
        }
      }
    );
  } else {
    inMemoryResetTokens.set(userId, {
      token,
      expiresAt
    });
  }
};

const getPasswordResetToken = async (userId) => {
  const collection = getCollectionOrMemory();

  if (collection) {
    const user = await collection.findOne({ userId }, { projection: { passwordResetToken: 1, passwordResetExpiresAt: 1 } });
    return {
      token: user?.passwordResetToken,
      expiresAt: user?.passwordResetExpiresAt
    };
  }

  return inMemoryResetTokens.get(userId) || null;
};

const clearPasswordResetToken = async (userId) => {
  const collection = getCollectionOrMemory();

  if (collection) {
    await collection.updateOne(
      { userId },
      {
        $unset: {
          passwordResetToken: '',
          passwordResetExpiresAt: ''
        }
      }
    );
  } else {
    inMemoryResetTokens.delete(userId);
  }
};

const listUsers = async () => {
  const collection = getCollectionOrMemory();

  if (collection) {
    const users = await collection
      .find({}, { projection: { passwordHash: 0, passwordHistory: 0, passwordResetToken: 0, passwordResetExpiresAt: 0 } })
      .toArray();

    return users;
  }

  return Array.from(inMemoryUsers.values()).map(({ passwordHash, passwordHistory, ...user }) => user);
};

const updateUserProfile = async (userId, updates = {}) => {
  const user = await findUserById(userId);
  if (!user) {
    throw new Error('User not found');
  }

  const collection = getCollectionOrMemory();
  const sanitizedUpdates = { updatedAt: new Date() };

  if (updates.name) {
    sanitizedUpdates.name = updates.name;
  }

  if (updates.role) {
    sanitizedUpdates.role = updates.role;
  }

  if (updates.email && typeof updates.email === 'string') {
    sanitizedUpdates.email = updates.email.toLowerCase();
  }

  if (collection) {
    await collection.updateOne({ userId }, { $set: sanitizedUpdates });
    const updatedUser = await collection.findOne({ userId }, { projection: { passwordHash: 0, passwordHistory: 0 } });
    return updatedUser;
  }

  const updatedUser = {
    ...user,
    ...sanitizedUpdates
  };

  inMemoryUsers.delete(user.email);
  inMemoryUsers.set(updatedUser.email, updatedUser);

  const { passwordHash, passwordHistory, ...safeUser } = updatedUser;
  return safeUser;
};

const deleteUser = async (userId) => {
  const user = await findUserById(userId);
  if (!user) {
    throw new Error('User not found');
  }

  const collection = getCollectionOrMemory();

  if (collection) {
    await collection.deleteOne({ userId });
  }

  inMemoryUsers.delete(user.email);
  inMemoryResetTokens.delete(userId);

  return true;
};

module.exports = {
  initializeUsersCollection,
  seedDefaultUsers,
  createUser,
  findUserByEmail,
  findUserById,
  verifyUserPassword,
  updateUserPassword,
  updateUserProfile,
  deleteUser,
  recordSuccessfulLogin,
  recordFailedLogin,
  lockUserAccount,
  storePasswordResetToken,
  getPasswordResetToken,
  clearPasswordResetToken,
  listUsers,
  validatePasswordStrength,
  isPasswordReused
};
