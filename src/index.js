import express from "express";
import connectDB from "./config/db.js";
import dotenv from "dotenv";
import router from "./routers/route.js";   
import authRoutes from "./routers/route.js";
import cors from "cors";
dotenv.config();

const app = express();

// Connect to MongoDB
connectDB();

// Middleware to parse JSON requests
app.use(express.json());
// Cors
app.use(cors());
// Use your router for API endpoints
app.use("/api", router);

// routes for authentication
app.use("/api/auth", authRoutes);

// Root route
app.get("/", (req, res) => {
  res.send("API is running...");
});

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
