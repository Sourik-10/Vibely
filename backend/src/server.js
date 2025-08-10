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

// Always ensure PORT is numeric
const PORT = parseInt(process.env.PORT, 10) || 5001;

// Allowed origins (local + production)
const allowedOrigins = [
  "http://localhost:5173",
  process.env.FRONTEND_URL || "https://vibely-7mk7.vercel.app"
];

// CORS for REST API
app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin) return callback(null, true); // allow tools like Postman
      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      } else {
        return callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true
  })
);

app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/chat", chatRoutes);
app.use("/api/profile", profileRoutes);

// Create HTTP server and Socket.IO
const httpServer = http.createServer(app);

const io = new SocketIOServer(httpServer, {
  cors: {
    origin: allowedOrigins,
    credentials: true
  }
});

io.on("connection", (socket) => {
  console.log("Socket connected:", socket.id);

  socket.on("register-user", (userId) => {
    if (!userId) return;
    const room = `user:${userId}`;
    socket.join(room);
    console.log(`Socket ${socket.id} registered user room ${room}`);
  });

  socket.on("join-conversation", (roomId) => {
    if (!roomId) return;
    socket.join(roomId);
    console.log(`Socket ${socket.id} joined room ${roomId}`);
  });

  socket.on("send-message", ({ roomId, message }) => {
    if (!roomId || !message) return;
    try {
      const persist = new Message({
        roomId,
        from: message.from,
        text: message.text,
        ts: message.ts
      });
      persist.save().catch((e) => console.error("Save message error:", e));
    } catch (e) {
      console.error("Persist error:", e);
    }
    socket.to(roomId).emit("receive-message", message);
  });

  socket.on("start-call", ({ roomId, targetUserId, caller }) => {
    if (!roomId) return;
    const payload = { roomId, caller };
    socket.to(roomId).emit("incoming-call", payload);
    if (targetUserId) {
      socket.to(`user:${targetUserId}`).emit("incoming-call", payload);
    }
  });

  socket.on("end-call", ({ roomId }) => {
    if (!roomId) return;
    socket.to(roomId).emit("call-ended", { roomId });
  });

  socket.on("disconnect", () => {
    console.log("Socket disconnected:", socket.id);
  });
});

// Connect DB first, then start server
connectDB()
  .then(() => {
    httpServer.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error("Database connection failed:", err);
    process.exit(1);
  });

