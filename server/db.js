import mongoose from 'mongoose';
import { log } from './vite.js';

const connectDB = async () => {
  if (!process.env.MONGODB_URI) {
    log('MONGODB_URI not found in .env file. Please add it.', 'database-error');
    process.exit(1);
  }

  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI);
    log(`MongoDB Connected: ${conn.connection.host}`, 'database');
  } catch (error) {
    log(`Error: ${error.message}`, 'database-error');
    process.exit(1);
  }
};

export default connectDB;