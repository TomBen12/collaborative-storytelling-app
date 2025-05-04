import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";

import authRoutes from "./routes/authRoutes.js";
import protectedRoutes from "./routes/protectedRoutes.js";
import storyRoutes from "./routes/storyRoutes.js";
import contributorRoutes from "./routes/contributorRoutes.js";

// Load environment variables from .env
dotenv.config();

// Create express app
const app = express();

// Middleware
app.use(express.json()); // parse JSON bodies
app.use(cookieParser()); // parse cookies (refreshToken)
app.use(
  cors({
    origin: "http://localhost:5173", // frontend address
    credentials: true, // allow cookies to be sent
  })
);

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/protected", protectedRoutes);
app.use("/api/stories", storyRoutes);
app.use("/api/contributors", contributorRoutes);

// Default route (optional)
// app.get("/", (req, res) => {
//   res.send("API is running!");
// });

// Start the server
const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
