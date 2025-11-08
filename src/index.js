import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import sequelize from "./config/database.js";
import userRoutes from "./routes/userRoutes.js";
import eventRoutes from "./routes/eventRoutes.js"; // ✅ Add this line
import adminRoutes from "./routes/adminRoutes.js";


dotenv.config();

const app = express();
app.use(express.json());
app.use(cors());
app.use(helmet());
app.use(morgan("dev"));

// Routes
app.use("/api/users", userRoutes);
app.use("/api/events", eventRoutes); // ✅ Add this line
app.use("/api/admin", adminRoutes);

app.get("/", (req, res) => {
  res.send("✅ Ayojon backend running!");
});

const PORT = process.env.PORT || 5000;

sequelize
  .authenticate()
  .then(() => {
    console.log("✅ MySQL connected successfully");
    return sequelize.sync();
  })
  .then(() => {
    console.log("✅ Database synced successfully");
    app.listen(PORT, () =>
      console.log(`🚀 Server running on http://localhost:${PORT}`)
    );
  })
  .catch((err) => console.error("❌ Database sync error:", err));
