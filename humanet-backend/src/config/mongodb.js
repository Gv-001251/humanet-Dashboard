const { MongoClient } = require('mongodb');

let db = null;
let client = null;

const connectDB = async () => {
  try {
    const uri = process.env.MONGODB_URI;
    const dbName = process.env.DB_NAME || 'humanet_hr';

    if (!uri) {
      console.warn('MongoDB URI not found in environment variables. Using in-memory storage.');
      return null;
    }

    const clientOptions = {
      serverApi: {
        version: '1',
        strict: true,
        deprecationErrors: true
      }
    };

    if (process.env.NODE_ENV !== 'production') {
      clientOptions.tlsAllowInvalidCertificates = true;
    }

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
