import express from "express";
import { logActionDirect } from "../middleware/actionLogger.js";
import fs from "fs";
import path from "path";

const router = express.Router();
const logsFolder = path.join(process.cwd(), "logs");

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

/**
 * GET /api/logs or /api/logs?date=YYYY-MM-DD
 * Returns all logs for the given date (or today by default)
 */
router.get("/logs", (req, res) => {
  try {
    const date = req.query.date || new Date().toISOString().split("T")[0];
    const logFile = path.join(logsFolder, `${date}.log`);

    if (!fs.existsSync(logFile)) {
      return res.json([]); // no logs for that date
    }

    const content = fs.readFileSync(logFile, "utf-8");
    const lines = content.trim().split("\n");

    const logs = lines
      .map((line, index) => {
        const match = line.match(
          /^\[(.+)\] \[(.+)\] User: (.+) - Action: (.+) - Details: (.+)$/
        );
        if (!match) return null;
        const [, timestamp, role, user, action, details] = match;
        let parsedDetails = {};
        try {
          parsedDetails = JSON.parse(details);
        } catch (err) {}
        return {
          id: index,
          timestamp,
          role,
          user,
          action,
          ...parsedDetails, // include fileName, applicationId, etc.
        };
      })
      .filter(Boolean);

    res.json(logs);
  } catch (err) {
    console.error("Error reading audit logs:", err);
    res.status(500).json({ error: "Failed to fetch audit logs" });
  }
});

export default router;
