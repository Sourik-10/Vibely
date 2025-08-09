import express from "express";
import { protectRoute } from "../middleware/auth.middleware.js";
import { getStreamToken } from "../controllers/chat.controller.js";
import Message from "../models/Message.js";
const router = express.Router();

router.get("/token", protectRoute, getStreamToken);

// Chat history
router.get("/history/:roomId", protectRoute, async (req, res) => {
  try {
    const { roomId } = req.params;
    if (!roomId) return res.status(400).json({ message: "roomId required" });

    const messages = await Message.find({ roomId }).sort({ ts: 1 }).limit(500);
    res.json({ messages });
  } catch (err) {
    console.error("Error fetching history:", err);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

export default router;
