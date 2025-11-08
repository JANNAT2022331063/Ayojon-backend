import express from "express";
import { protect } from "../middleware/auth.js";
import User from "../models/User.js";

const router = express.Router();

// A simple admin-check middleware (you can expand)
const adminOnly = (req, res, next) => {
  if (req.user.role !== "admin") return res.status(403).json({ message: "Admins only" });
  next();
};

router.put("/verify-organizer/:id", protect, adminOnly, async (req, res) => {
  const id = req.params.id;
  try {
    const user = await User.findByPk(id);
    if (!user || user.role !== "organizer") return res.status(404).json({ message: "Organizer not found" });
    user.isVerified = true;
    await user.save();
    res.json({ message: "Organizer verified", user: { id: user.id, email: user.email, isVerified: user.isVerified } });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

export default router;
