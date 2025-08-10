import express from "express";
import {
  login,
  logout,
  onboard,
  signup,
  me,
} from "../controllers/auth.controller.js";
import { protectRoute } from "../middleware/auth.middleware.js";

const router = express.Router();

router.post("/signup", signup);
router.post("/api/login", login);
router.post("/logout", logout);
router.get("/me", protectRoute, me);

router.post("/onboarding", protectRoute, onboard);

//check if user is logged in ot not
router.get("/me", protectRoute, (req, res) => {
  res.status(200).json({ success: true, user: req.user });
});

export default router;
