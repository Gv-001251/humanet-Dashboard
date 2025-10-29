const { hashPassword } = require('../utils/passwordUtils');
const { v4: uuidv4 } = require('uuid');

let users = [];
let dbUsersCollection = null;

const seedUsers = [
  {
    id: 'user-hr',
    email: 'hr@humanet.com',
    password: 'hr123',
    name: 'Gayathri G',
    role: 'hr'
  },
  {
    id: 'user-admin',
    email: 'admin@humanet.com',
    password: 'admin123',
    name: 'Alex Doe',
    role: 'admin'
  },
  {
    id: 'user-lead',
    email: 'lead@humanet.com',
    password: 'lead123',
    name: 'Priya Singh',
    role: 'team_lead'
  },
  {
    id: 'user-ceo',
    email: 'ceo@humanet.com',
    password: 'ceo123',
    name: 'Vikram Rao',
    role: 'ceo'
  },
  {
    id: 'user-investor',
    email: 'investor@humanet.com',
    password: 'investor123',
    name: 'Nisha Patel',
    role: 'investor'
  },
  {
    id: 'user-employee',
    email: 'employee@humanet.com',
    password: 'emp123',
    name: 'Employee User',
    role: 'employee'
  }
];

const normalizeUser = ({ password, passwordHash, passwordHistory = [], ...rest }) => {
  const safeUser = {
    ...rest,
    passwordHash: passwordHash || null,
    passwordHistory,
    status: rest.status || 'active',
    mfaEnabled: rest.mfaEnabled || false,
    lastPasswordChange: rest.lastPasswordChange ? new Date(rest.lastPasswordChange) : null,
    failedLoginAttempts: rest.failedLoginAttempts || 0,
    lockedUntil: rest.lockedUntil ? new Date(rest.lockedUntil) : null,
    createdAt: rest.createdAt ? new Date(rest.createdAt) : new Date(),
    updatedAt: rest.updatedAt ? new Date(rest.updatedAt) : new Date()
  };

  if (passwordHistory && passwordHistory.length) {
    safeUser.passwordHistory = passwordHistory.map(hash => String(hash));
  }

  return safeUser;
};

const ensurePasswordHistory = (user) => {
  if (!Array.isArray(user.passwordHistory)) {
    user.passwordHistory = [];
  }
  return user;
};

const persistUserToDB = async (user) => {
  if (!dbUsersCollection) {
    return;
  }

  try {
    const { id } = user;
    await dbUsersCollection.updateOne(
      { id },
      { $set: { ...user, password: undefined } },
      { upsert: true }
    );
  } catch (error) {
    console.error('Failed to persist user to MongoDB:', error);
  }
};

const initializeUserStore = async (db = null) => {
  try {
    if (db) {
      dbUsersCollection = db.collection('users');
      await dbUsersCollection.createIndex({ id: 1 }, { unique: true });
      await dbUsersCollection.createIndex({ email: 1 }, { unique: true });

      const existingUsers = await dbUsersCollection.find({}).toArray();
      if (existingUsers.length > 0) {
        users = existingUsers.map(normalizeUser);
        return users;
      }
    }

    const hashedSeedUsers = [];
    for (const seedUser of seedUsers) {
      const hashed = await hashPassword(seedUser.password);
      hashedSeedUsers.push(
        normalizeUser({
          ...seedUser,
          passwordHash: hashed,
          passwordHistory: [hashed],
          lastPasswordChange: new Date(),
          createdAt: new Date(),
          updatedAt: new Date()
        })
      );
    }

    users = hashedSeedUsers;

    for (const user of users) {
      await persistUserToDB(user);
    }

    return users;
  } catch (error) {
    console.error('Failed to initialize user store:', error);
    return users;
  }
};

const getAllUsers = () => users.map(user => sanitizeUser(user));

const findUserByEmail = (email) => users.find(user => user.email.toLowerCase() === email.toLowerCase());

const findUserById = (id) => users.find(user => user.id === id);

const addUser = async ({ email, name, role = 'employee', password }) => {
  const timestamp = new Date();
  const passwordHash = await hashPassword(password);
  const user = normalizeUser({
    id: uuidv4(),
    email,
    name,
    role,
    passwordHash,
    passwordHistory: [passwordHash],
    lastPasswordChange: timestamp,
    createdAt: timestamp,
    updatedAt: timestamp
  });

  users.push(user);
  await persistUserToDB(user);
  return user;
};

const updateUser = async (id, updates) => {
  const user = findUserById(id);
  if (!user) {
    return null;
  }

  Object.assign(user, updates, { updatedAt: new Date() });
  ensurePasswordHistory(user);
  await persistUserToDB(user);
  return user;
};

const updateUserPassword = async (id, newPasswordHash) => {
  const user = findUserById(id);
  if (!user) {
    return null;
  }

  ensurePasswordHistory(user);
  user.passwordHash = newPasswordHash;
  user.lastPasswordChange = new Date();
  user.updatedAt = new Date();
  user.passwordHistory = [newPasswordHash, ...user.passwordHistory]
    .slice(0, 3);

  await persistUserToDB(user);
  return user;
};

const recordFailedLoginAttempt = async (id) => {
  const user = findUserById(id);
  if (!user) return null;

  user.failedLoginAttempts = (user.failedLoginAttempts || 0) + 1;
  user.updatedAt = new Date();

  if (user.failedLoginAttempts >= 5) {
    user.lockedUntil = new Date(Date.now() + 15 * 60 * 1000);
  }

  await persistUserToDB(user);
  return user;
};

const resetLoginAttempts = async (id) => {
  const user = findUserById(id);
  if (!user) return null;

  user.failedLoginAttempts = 0;
  user.lockedUntil = null;
  user.updatedAt = new Date();
  await persistUserToDB(user);
  return user;
};

const sanitizeUser = (user) => {
  if (!user) return null;

  const { passwordHash, passwordHistory, failedLoginAttempts, lockedUntil, ...safeUser } = user;
  return safeUser;
};

module.exports = {
  initializeUserStore,
  getAllUsers,
  findUserByEmail,
  findUserById,
  addUser,
  updateUser,
  updateUserPassword,
  recordFailedLoginAttempt,
  resetLoginAttempts,
  sanitizeUser
};
