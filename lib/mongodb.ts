import mongoose from "mongoose"

const MONGODB_URI = process.env.MONGODB_URI || "mongodb+srv://booking:12345@cluster0.ef59n.mongodb.net/drivex?retryWrites=true&w=majority"
// Optional non-SRV fallback (e.g., direct seed list) to mitigate DNS SRV issues on some networks
const MONGODB_URI_FALLBACK = process.env.MONGODB_URI_FALLBACK

if (!MONGODB_URI) {
  throw new Error("Please define the MONGODB_URI environment variable inside .env.local")
}

let cached = global.mongoose

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null }
}

async function connectDB() {
  if (cached.conn) {
    return cached.conn
  }

  if (!cached.promise) {
    const opts = {
      bufferCommands: false,
      // Reduce time spent waiting during DNS/server selection issues
      serverSelectionTimeoutMS: 10000,
      // Prefer IPv4 on environments where IPv6/DNS SRV resolution is flaky
      family: 4,
    } as any

    // Try primary URI first; on failure and when a fallback is provided, attempt fallback
    cached.promise = (async () => {
      try {
        return await mongoose.connect(MONGODB_URI, opts)
      } catch (primaryError) {
        // Only attempt fallback if provided; helps when SRV records cannot be resolved (ETIMEOUT)
        if (MONGODB_URI_FALLBACK) {
          try {
            return await mongoose.connect(MONGODB_URI_FALLBACK, opts)
          } catch (fallbackError) {
            throw fallbackError
          }
        }
        throw primaryError
      }
    })()
  }

  try {
    cached.conn = await cached.promise
  } catch (e) {
    cached.promise = null
    throw e
  }

  return cached.conn
}

export { connectDB }
export default connectDB
