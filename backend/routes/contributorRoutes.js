import express from "express";
import * as contributorController from "../controllers/contributorController.js";
import { authenticateToken } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/", authenticateToken, contributorController.add);
router.get("/:story_id", authenticateToken, contributorController.get);
router.delete("/:id", authenticateToken, contributorController.remove);
router.get("/all", contributorController.getAllContributors);

export default router;
