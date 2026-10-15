import mongoose from 'mongoose';

let isConnected = false;
let isInMemoryFallback = false;

export async function connectDatabase(): Promise<boolean> {
  const mongoUri = process.env.MONGODB_URI;

  if (!mongoUri || process.env.USE_MEMORY_STORE === 'true') {
    console.log('[Database] Running in safe standalone in-memory store mode for local development/testing.');
    isInMemoryFallback = true;
    return true;
  }

  try {
    mongoose.set('strictQuery', true);
    await mongoose.connect(mongoUri, {
      serverSelectionTimeoutMS: 3000, // Quick timeout to fallback if no local Mongo is listening
    });
    isConnected = true;
    console.log('[Database] Connected successfully to MongoDB Atlas / Instance.');
    return true;
  } catch (err: any) {
    console.warn(`[Database] MongoDB connection error (${err.message}). Falling back to safe in-memory store mode.`);
    isInMemoryFallback = true;
    return false;
  }
}

export function getDatabaseStatus() {
  return {
    isConnected,
    isInMemoryFallback,
    ready: isConnected || isInMemoryFallback,
    engine: isConnected ? 'mongodb' : 'memory_store',
  };
}
