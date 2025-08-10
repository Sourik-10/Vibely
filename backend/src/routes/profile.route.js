import express from "express";
import { protectRoute } from "../middleware/auth.middleware.js";
import {
  uploadProfileImage,
  deleteProfileImage,
  updateProfile,
} from "../controllers/profile.controller.js";
import upload from "../middleware/upload.middleware.js";

const router = express.Router();

// Upload profile image
router.post(
  "/upload-image",
  protectRoute,
  upload.single("profileImage"),
  uploadProfileImage
);

// Delete/reset profile image
router.delete("/delete-image", protectRoute, deleteProfileImage);

// Update profile information
router.put("/update", protectRoute, updateProfile);

export default router;
