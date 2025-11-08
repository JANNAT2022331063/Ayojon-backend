import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/userModel.js";

// 🧩 Register new user or organizer
export const registerUser = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    // Check if user already exists
    const existing = await User.findOne({ where: { email } });
    if (existing) {
      return res.status(400).json({ message: "User already exists" });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Decide verification based on role
    let isVerified = true;
    if (role === "organizer") {
      isVerified = false; // requires admin approval
    }

    // Create new user
    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      role: role || "user", // default role = user
      isVerified,
    });

    res.status(201).json({
      message:
        role === "organizer"
          ? "Organizer registered successfully. Awaiting verification."
          : "User registered successfully.",
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        isVerified: user.isVerified,
      },
    });
  } catch (error) {
    res.status(500).json({ message: "Registration failed", error: error.message });
  }
};

// 🧩 Login existing user
export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ where: { email } });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // 🔒 Check if organizer is verified
    if (user.role === "organizer" && !user.isVerified) {
      return res.status(403).json({
        message: "Organizer not yet verified by admin. Please wait for approval.",
      });
    }

    // Generate JWT with role and verification info
    const token = jwt.sign(
      {
        id: user.id,
        role: user.role,
        isVerified: user.isVerified,
      },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.status(200).json({
      message: "Login successful",
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        isVerified: user.isVerified,
      },
    });
  } catch (error) {
    res.status(500).json({ message: "Login failed", error: error.message });
  }
};
