import express from "express";
import { authenticateToken } from "../middleware/authMiddleware.js";

const router = express.Router();

// Protected route
router.get("/private", authenticateToken, (req, res) => {
  res.json({
    message: `Hello User ${req.user.userId}, you accessed a protected route.`,
  });
});

export default router;
