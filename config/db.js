import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

export const connectDB = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGO_URI) // connect to the database
        console.log(`MongoDB Connected: ${conn.connection.host}`); // log the connection
    } catch (error) {
        console.log(error);
        process.exit(1); // exit with failure
    }
};

