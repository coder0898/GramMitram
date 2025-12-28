import express from "express";
import { logActionDirect } from "../middleware/actionLogger.js"; // import helper

const router = express.Router();

/**
 * POST /api/log
 * Body: { userId, role, action, details }
 * Can be called by admin, staff, or regular users
 */
router.post("/log", (req, res) => {
  const { userId, role, action, details } = req.body;

  if (!userId || !action) {
    return res.status(400).json({ error: "userId and action are required" });
  }

  try {
    logActionDirect({ action, userId, role, details });
    res.status(200).json({ message: "Action logged successfully" });
  } catch (err) {
    console.error("Logging route error:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
