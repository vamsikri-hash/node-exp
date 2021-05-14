import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();
const URI = process.env.MONGO_URI

const {connect} = mongoose;

export const connectDB = async () => {
  const conn = await connect(URI, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
    useUnifiedTopology: true
  });

  console.log(`MongoDB Connected: ${conn.connection.host}`);
};
