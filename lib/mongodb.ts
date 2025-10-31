import mongoose from "mongoose";

/**
 * Global type declaration to cache the Mongoose connection in development mode.
 * This prevents Next.js hot reloading from creating multiple database connections.
 */
declare global {
  // eslint-disable-next-line no-var
  var mongoose: {
    conn: mongoose.Connection | null;
    promise: Promise<mongoose.Connection> | null;
  };
}

/**
 * MongoDB connection URI from environment variables.
 * Throws an error if MONGODB_URI is not defined.
 */
const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  throw new Error(
    "Please define the MONGODB_URI environment variable inside .env"
  );
}

/**
 * Interface for cached MongoDB connection.
 * Stores both the active connection and the connection promise.
 */
interface MongooseCache {
  conn: mongoose.Connection | null;
  promise: Promise<mongoose.Connection> | null;
}

/**
 * Initialize the cached connection object.
 * In development, we use a global variable to preserve the connection across hot reloads.
 * In production, we create a new connection for each instance.
 */
let cached: MongooseCache = global.mongoose || { conn: null, promise: null };

if (!global.mongoose) {
  global.mongoose = cached;
}

/**
 * Establishes and returns a MongoDB connection using Mongoose.
 *
 * This function implements connection caching to optimize performance:
 * - In development: Reuses existing connections across hot reloads
 * - In production: Creates new connections as needed
 *
 * @returns {Promise<mongoose.Connection>} A promise that resolves to the Mongoose connection
 *
 * @example
 * ```typescript
 * import connectDB from '@/lib/mongodb';
 *
 * async function handler() {
 *   const db = await connectDB();
 *   // Use the connection
 * }
 * ```
 */
async function connectDB(): Promise<mongoose.Connection> {
  // Return existing connection if available
  if (cached.conn) {
    return cached.conn;
  }

  // Return existing connection promise if one is in progress
  if (!cached.promise) {
    const opts: mongoose.ConnectOptions = {
      bufferCommands: false, // Disable Mongoose buffering to fail fast if connection is not established
    };

    // Create a new connection promise
    cached.promise = mongoose
      .connect(MONGODB_URI as string, opts)
      .then((mongooseInstance) => {
        return mongooseInstance.connection;
      });
  }

  try {
    // Wait for the connection to be established
    cached.conn = await cached.promise;
  } catch (error) {
    // Reset the promise on error so the next call can retry
    cached.promise = null;
    throw error;
  }

  return cached.conn;
}

export default connectDB;
