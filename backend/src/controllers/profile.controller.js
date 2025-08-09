import User from "../models/User.js";
import cloudinary from "../lib/cloudinary.js";
import { upsertStreameUser } from "../lib/stream.js";

export async function uploadProfileImage(req, res) {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No image file provided" });
    }

    const userId = req.user._id;

    // Convert buffer to base64
    const b64 = Buffer.from(req.file.buffer).toString("base64");
    const dataURI = `data:${req.file.mimetype};base64,${b64}`;

    // Upload to Cloudinary
    const result = await cloudinary.uploader.upload(dataURI, {
      folder: "vibely-profiles",
      transformation:
        req.file.mimetype === "image/svg+xml"
          ? [
              { width: 400, height: 400, crop: "scale" }, // Use scale for SVG to maintain aspect ratio
              { quality: "auto" },
            ]
          : [
              { width: 400, height: 400, crop: "fill", gravity: "face" },
              { quality: "auto", fetch_format: "auto" },
            ],
    });

    // Update user profile
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { profilePic: result.secure_url },
      { new: true }
    );

    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    // Update Stream user
    try {
      await upsertStreameUser({
        id: updatedUser._id.toString(),
        name: updatedUser.fullName,
        image: updatedUser.profilePic,
      });
      console.log(
        `Stream user profile image updated for ${updatedUser.fullName}`
      );
    } catch (streamError) {
      console.log(
        "Error updating Stream user profile image:",
        streamError.message
      );
    }

    res.status(200).json({
      success: true,
      message: "Profile image uploaded successfully",
      profilePic: result.secure_url,
      user: updatedUser,
    });
  } catch (error) {
    console.error("Error uploading profile image:", error);
    res.status(500).json({ message: "Error uploading profile image" });
  }
}

export async function deleteProfileImage(req, res) {
  try {
    const userId = req.user._id;
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Generate a default avatar
    const idx = Math.floor(Math.random() * 100) + 1;
    const defaultAvatar = `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.fullName}&backgroundColor=b6e3f4,c0aede,d1d4f9,ffd5dc,ffdfbf`;

    // Update user profile
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { profilePic: defaultAvatar },
      { new: true }
    );

    // Update Stream user
    try {
      await upsertStreameUser({
        id: updatedUser._id.toString(),
        name: updatedUser.fullName,
        image: updatedUser.profilePic,
      });
      console.log(
        `Stream user profile image reset for ${updatedUser.fullName}`
      );
    } catch (streamError) {
      console.log(
        "Error updating Stream user profile image:",
        streamError.message
      );
    }

    res.status(200).json({
      success: true,
      message: "Profile image reset to default",
      profilePic: defaultAvatar,
      user: updatedUser,
    });
  } catch (error) {
    console.error("Error deleting profile image:", error);
    res.status(500).json({ message: "Error deleting profile image" });
  }
}
