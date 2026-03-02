/* ============================================================
   MongoDB Connection — Singleton with Mongoose
   Uses cached connection to prevent multiple connections in dev
   ============================================================ */

import mongoose from "mongoose";

// allow a local MongoDB URI when env var is absent (convenient for hackathon/demo)
const MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost:27017/carelytix-demo";

if (!process.env.MONGODB_URI) {
    console.warn(
        "MONGODB_URI not set; defaulting to local mongodb://localhost:27017/carelytix-demo"
    );
}

/**
 * Global cache to reuse existing connection across hot reloads
 * in development. Prevents creating new connections on every HMR.
 */
interface MongooseCache {
    conn: typeof mongoose | null;
    promise: Promise<typeof mongoose> | null;
}

declare global {
    // eslint-disable-next-line no-var
    var mongooseCache: MongooseCache | undefined;
}

const cached: MongooseCache = global.mongooseCache ?? {
    conn: null,
    promise: null,
};

if (!global.mongooseCache) {
    global.mongooseCache = cached;
}

/**
 * Connect to MongoDB. Returns existing connection if available.
 */
async function connectDB(): Promise<typeof mongoose> {
    if (cached.conn) {
        return cached.conn;
    }

    if (!cached.promise) {
        const opts = {
            bufferCommands: false,
        };

        cached.promise = mongoose.connect(MONGODB_URI, opts).then((m) => {
            console.log("✅ MongoDB connected successfully");
            return m;
        });
    }

    try {
        cached.conn = await cached.promise;
    } catch (e) {
        cached.promise = null;
        throw e;
    }

    return cached.conn;
}

export default connectDB;
