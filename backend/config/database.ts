import mongoose from 'mongoose';

/**
 * Connects the backend to MongoDB using the provided connection string
 * or the MONGODB_URI environment variable.
 *
 * @param {string} [connectionUri] - Explicit MongoDB connection string override.
 * @returns {Promise<typeof mongoose>} Active mongoose connection instance.
 */
export async function connectToDatabase(connectionUri?: string) {
  const resolvedConnectionUri = connectionUri ?? process.env.MONGODB_URI;

  if (!resolvedConnectionUri) {
    throw new Error('MongoDB connection URI is required.');
  }

  return mongoose.connect(resolvedConnectionUri);
}

/**
 * Closes the active mongoose connection.
 *
 * @returns {Promise<void>} Promise that resolves when disconnected.
 */
export async function disconnectFromDatabase() {
  await mongoose.disconnect();
}
