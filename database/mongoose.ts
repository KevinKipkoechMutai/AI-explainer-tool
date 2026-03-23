import mongoose from "mongoose";

const MONGO_URI = process.env.MONGO_URI;

if (!MONGO_URI) {
  throw new Error("MONGO_URI environment variable is not set");
}

declare global {
    var mongooseCache: {
        conn: typeof mongoose | null
        promise: Promise<typeof mongoose> | null
    }
}

let cached = global.mongooseCache || (global.mongooseCache = { conn: null, promise: null })

export const connectToDatabase = async () => {
    if (cached.conn) {
        return cached.conn
    }

    if (!cached.promise) {
        cached.promise = mongoose.connect(MONGO_URI, {
            bufferCommands: false
            })
    }

    try {
        cached.conn = await cached.promise
    } catch (error) {
        cached.promise = null
        console.error("MongoDB connection error. Ensure it's running" + error)
        throw error
    }

    console.info("Connected to MongoDB")
    return cached.conn
}
