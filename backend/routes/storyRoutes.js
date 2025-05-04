import express from "express";
import * as storyController from "../controllers/storyController.js";
import { authenticateToken } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/", authenticateToken, storyController.getAll);
router.get("/:id", authenticateToken, storyController.getOne);
router.post("/", authenticateToken, storyController.create);
router.patch("/:id", authenticateToken, storyController.update);
router.delete("/:id", authenticateToken, storyController.remove);

export default router;
