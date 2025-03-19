import { MongoClient } from "mongodb";
import dotenv from "dotenv";

dotenv.config();

const MONGO_URI = process.env.MONGO_URI as string;

let client: MongoClient;

const connectDB = async () => {
  try {
    client = new MongoClient(MONGO_URI);
    await client.connect();
    console.log("✅ MongoDB connected successfully!");
  } catch (error) {
    console.error("❌ MongoDB connection error:", error);
    process.exit(1);
  }
};

const close = async () => {
  try {
    await client.close();
    console.log("✅ MongoDB connection closed successfully!");
  } catch (error) {
    console.error("❌ MongoDB disconnection error:", error);
  }
};

const getDB = () => {
  if (!client) {
    throw new Error("MongoDB client is not initialized.");
  }
  return client.db(process.env.DB_NAME);
};

export { connectDB, getDB, close };