import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { DB_NAME } from "../constants.js";

// Load environment variables
dotenv.config();

const connectDB = async () => {
  try {
    // Log the MongoDB URI to verify it's correct

    // Connect to MongoDB
    const connectionInstance = await mongoose.connect(`${process.env.MONGODB_URL}/${DB_NAME}`);
    console.log(`MongoDB connected: ${connectionInstance.connection.host}`);
  } catch (error) {
    console.error('MongoDB connection error:', error);
    process.exit(1);  // Exit the app on failure
  }
};

connectDB();
export default connectDB;