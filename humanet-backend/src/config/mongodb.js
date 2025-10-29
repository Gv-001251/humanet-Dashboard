const { MongoClient } = require('mongodb');

const DEFAULT_ATLAS_URI = 'mongodb+srv://navageevithang_db_user:<db_password>@humanet-cluster.h99gras.mongodb.net/';

let db = null;
let client = null;

const resolveMongoUri = () => {
  const uri = process.env.MONGODB_URI;
  if (uri && uri.trim()) {
    return uri.trim();
  }

  console.warn('MONGODB_URI not set. Falling back to default Atlas connection string.');
  return DEFAULT_ATLAS_URI;
};

const connectDB = async () => {
  try {
    const uri = resolveMongoUri();
    const dbName = process.env.DB_NAME || 'humanet_hr';

    if (!uri) {
      console.warn('MongoDB URI not found. Using in-memory storage.');
      return null;
    }

    const isLocalConnection = uri.includes('mongodb://localhost') || uri.includes('mongodb://127.0.0.1');

    const clientOptions = {};

    if (!isLocalConnection) {
      clientOptions.serverApi = {
        version: '1',
        strict: true,
        deprecationErrors: true
      };

      if (process.env.NODE_ENV !== 'production') {
        clientOptions.tlsAllowInvalidCertificates = true;
      }
    }

    console.log(`Attempting to connect to MongoDB at ${uri}...`);
    client = new MongoClient(uri, clientOptions);
    await client.connect();

    db = client.db(dbName);
    console.log(`MongoDB connected successfully to database: ${dbName}`);

    return db;
  } catch (error) {
    console.error('MongoDB connection error:', error);
    console.warn('Falling back to in-memory storage');
    return null;
  }
};

const getDB = () => db;

const closeDB = async () => {
  if (client) {
    await client.close();
    console.log('MongoDB connection closed');
  }
};

module.exports = { connectDB, getDB, closeDB };
