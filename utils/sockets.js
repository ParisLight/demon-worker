import dotenv from "dotenv";
import { Server } from "socket.io";
import { createServer } from 'http';
import express from "express";

dotenv.config();

const app = express();

export const httpServer = createServer(app);

export const io = new Server(httpServer, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
    credentials: true
  }
});

httpServer.listen(process.env.SOCKET_PORT, () => {
  console.log(`Sockets started on ${process.env.SOCKET_PORT}`);
});