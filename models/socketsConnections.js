import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();

mongoose.connect(process.env.MONGO_CREDENTIALS);

const connectionsLogSchema = new mongoose.Schema({
  socketId: {
    type: String,
    required: true
  },
  timestamp: {
    type: Date, 
    default: Date.now
  },
  success: {
    type: Boolean,
    required: true,
    default: false
  },
  wasSended: {
    type: Boolean,
    required: true,
    default: false
  },
  wasDisconnected: {
    type: Boolean,
    required: true,
    default: false
  }
})

export const connectionLog = mongoose.model('sockets-connections', connectionsLogSchema);