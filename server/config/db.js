import mongoose from "mongoose";
import dotenv from "dotenv";
import departmentModel from "../models/departmentModel.js";
dotenv.config();

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_DB_URI);
    console.log("Database connected successfully");
    await departmentModel.syncIndexes();
    console.log("syncing department indexes");
  } catch (error) {
    console.error("Database connection failed:", error.message);
    process.exit(1);
  }
};

export default connectDB;
