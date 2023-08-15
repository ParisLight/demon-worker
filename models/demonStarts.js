import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();

mongoose.connect(process.env.MONGO_CREDENTIALS);

const demonLogSchema = new mongoose.Schema({
  message: String,
  timestamp: { 
    type: Date, 
    default: Date.now 
  },
  url: String,
  options: Object
})

export const demonLog = mongoose.model('demon-start', demonLogSchema);
