import express from "express";
import "dotenv/config";
import cookieParser from "cookie-parser";
import http from "http";
import { Server as SocketIOServer } from "socket.io";

import authRoutes from "./routes/auth.route.js";
import { connectDB } from "./lib/db.js";
import userRoutes from "./routes/user.route.js";
import chatRoutes from "./routes/chat.route.js";
import profileRoutes from "./routes/profile.route.js";
import cors from "cors";
import Message from "./models/Message.js";
const app = express();
const PORT = process.env.PORT || 5001;

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true, // Allow credentials to be sent cookies
  })
);
app.use(express.json());
app.use(cookieParser());

app.use(express.urlencoded({ extended: true }));
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/chat", chatRoutes);
app.use("/api/profile", profileRoutes);

// Create HTTP server and initialize Socket.IO
const httpServer = http.createServer(app);
const io = new SocketIOServer(httpServer, {
  cors: {
    origin: "http://localhost:5173",
    credentials: true,
  },
});

io.on("connection", (socket) => {
  console.log("Socket connected:", socket.id);

  socket.on("join-conversation", (roomId) => {
    if (!roomId) return;
    socket.join(roomId);
    console.log(`Socket ${socket.id} joined room ${roomId}`);
  });

  socket.on("send-message", ({ roomId, message }) => {
    if (!roomId || !message) return;
    // Persist message
    try {
      const persist = new Message({
        roomId,
        from: message.from,
        text: message.text,
        ts: message.ts,
      });
      persist.save().catch((e) => console.error("Save message error:", e));
    } catch (e) {
      console.error("Persist error:", e);
    }
    // Broadcast to all except sender
    socket.to(roomId).emit("receive-message", message);
  });

  socket.on("disconnect", () => {
    console.log("Socket disconnected:", socket.id);
  });
});

httpServer.listen(PORT, () => {
  console.log(`server is running on port ${PORT}`);
  connectDB();
});
