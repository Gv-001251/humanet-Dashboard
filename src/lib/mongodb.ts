import { MongoClient, Db } from 'mongodb';

const MONGODB_URI = 'mongodb+srv://navageevithang_db_user:BdvFg2iBkcz750gt@humanet-cluster.xxxxx.mongodb.net/?retryWrites=true&w=majority';
const DB_NAME = 'humanet_hr';

if (!MONGODB_URI) {
  throw new Error('Please define the MONGODB_URI environment variable');
}

interface MongoConnection {
  client: MongoClient;
  db: Db;
}

declare global {
  var _mongoClientPromise: Promise<MongoClient> | undefined;
}

let client: MongoClient;
let clientPromise: Promise<MongoClient>;

if (process.env.NODE_ENV === 'development') {
  // In development mode, use a global variable so that the value
  // is preserved across module reloads caused by HMR (Hot Module Replacement).
  if (!global._mongoClientPromise) {
    client = new MongoClient(MONGODB_URI);
    global._mongoClientPromise = client.connect();
  }
  clientPromise = global._mongoClientPromise;
} else {
  // In production mode, it's best to not use a global variable.
  client = new MongoClient(MONGODB_URI);
  clientPromise = client.connect();
}

export async function connectToDatabase(): Promise<MongoConnection> {
  try {
    const client = await clientPromise;
    const db = client.db(DB_NAME);
    return { client, db };
  } catch (error) {
    console.error('MongoDB connection error:', error);
    throw new Error('Failed to connect to MongoDB');
  }
}

export default clientPromise;
