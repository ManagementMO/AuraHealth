import { MongoClient, Db } from 'mongodb';

interface MongoConnection {
  client: MongoClient;
  db: Db;
}

// Global variable to cache the connection in serverless environments
let cachedConnection: MongoConnection | null = null;

/**
 * Connects to MongoDB with connection caching for serverless optimization
 * Uses MONGODB_URI environment variable for connection configuration
 * @returns Promise<MongoConnection> - Cached or new MongoDB connection
 */
export async function connectToDatabase(): Promise<MongoConnection> {
  // Return cached connection if it exists and is still connected
  if (cachedConnection && cachedConnection.client.topology?.isConnected()) {
    return cachedConnection;
  }

  // Validate environment variable
  const uri = process.env.MONGODB_URI;
  if (!uri) {
    throw new Error('MONGODB_URI environment variable is not defined');
  }

  try {
    // Create new MongoDB client
    const client = new MongoClient(uri, {
      // Connection options for serverless optimization
      maxPoolSize: 10, // Maintain up to 10 socket connections
      serverSelectionTimeoutMS: 5000, // Keep trying to send operations for 5 seconds
      socketTimeoutMS: 45000, // Close sockets after 45 seconds of inactivity
      bufferMaxEntries: 0, // Disable mongoose buffering
      bufferCommands: false, // Disable mongoose buffering
    });

    // Connect to MongoDB
    await client.connect();

    // Get database name from URI or use default
    const dbName = new URL(uri).pathname.slice(1) || 'aura-health';
    const db = client.db(dbName);

    // Cache the connection
    cachedConnection = {
      client,
      db,
    };

    console.log('Successfully connected to MongoDB');
    return cachedConnection;
  } catch (error) {
    console.error('Failed to connect to MongoDB:', error);
    throw new Error(`MongoDB connection failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

/**
 * Closes the MongoDB connection
 * Useful for cleanup in non-serverless environments
 */
export async function closeDatabaseConnection(): Promise<void> {
  if (cachedConnection) {
    try {
      await cachedConnection.client.close();
      cachedConnection = null;
      console.log('MongoDB connection closed');
    } catch (error) {
      console.error('Error closing MongoDB connection:', error);
      throw new Error(`Failed to close MongoDB connection: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }
}

/**
 * Gets the current database connection status
 * @returns boolean - True if connected, false otherwise
 */
export function isDatabaseConnected(): boolean {
  return cachedConnection?.client.topology?.isConnected() ?? false;
}