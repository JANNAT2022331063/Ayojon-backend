// src/middleware/authMiddleware.js
import jwt from "jsonwebtoken";
import User from "../models/userModel.js";
import dotenv from "dotenv";
dotenv.config();

export const authenticate = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader?.startsWith("Bearer ")) return res.status(401).json({ msg: "Missing token" });
  const token = authHeader.split(" ")[1];
  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findByPk(payload.id);
    if (!user) return res.status(401).json({ msg: "Invalid token user" });
    req.user = user; // attach user instance
    next();
  } catch (err) {
    return res.status(401).json({ msg: "Token invalid", error: err.message });
  }
};

export const requireOrganizer = (req, res, next) => {
  if (!req.user) return res.status(401).json({ msg: "Not authenticated" });
  // adapt to your role values: 'organizer' or 'admin'
  if (req.user.role !== "organizer" && req.user.role !== "admin")
    return res.status(403).json({ msg: "Requires organizer role" });
  next();
};
