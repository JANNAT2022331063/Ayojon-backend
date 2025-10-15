import express from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";
import cors from "cors";

import eventRoutes from "./routes/eventRoutes.js";

dotenv.config();
const app = express();
app.use(express.json());
app.use(cors());

// MongoDB connection
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB connected"))
  .catch((err) => console.log(err));

// Routes
app.use("/api/events", eventRoutes);

app.get("/", (req, res) => res.send("Ayojon Backend Running 🚀"));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
