import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import sequelize from "./config/database.js";

// Import routes
import userRoutes from "./routes/userRoutes.js";
import eventRoutes from "./routes/eventRoutes.js"; // 👈 added for create/delete events

dotenv.config();

const app = express();

// Middlewares
app.use(express.json());
app.use(cors());
app.use(helmet());
app.use(morgan("dev"));
app.use("/uploads", express.static("uploads")); // 👈 serve uploaded files

// Routes
app.use("/api/users", userRoutes);
app.use("/api/events", eventRoutes); // 👈 event routes

// Root route
app.get("/", (req, res) => {
  res.send("✅ Ayojon backend running!");
});

const PORT = process.env.PORT || 5000;

// Connect to MySQL and start server
sequelize
  .authenticate()
  .then(() => {
    console.log("✅ MySQL connected successfully");
    return sequelize.sync({ alter: true }); // auto update DB schema
  })
  .then(() => {
    console.log("✅ Database synced successfully");
    app.listen(PORT, () =>
      console.log(`🚀 Server running on http://localhost:${PORT}`)
    );
  })
  .catch((err) => console.error("❌ Database sync error:", err));
