import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  throw new Error("⚠️ MongoDB URI is missing in .env.local file!");
}

let cached = global.mongoose || { conn: null, promise: null };

async function dbConnect() {
  if (cached.conn) return cached.conn;

  if (!cached.promise) {
    cached.promise = mongoose
      .connect(MONGODB_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      }) 
      .then((mongoose) => mongoose);
      console.log("✅ MongoDB connected successfully");

  }

  cached.conn = await cached.promise;
  return cached.conn;
}

// Store in global for development mode
if (process.env.NODE_ENV === "development") {
  global.mongoose = cached;
}

export default dbConnect;
