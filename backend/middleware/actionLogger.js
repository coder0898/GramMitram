import fs from "fs";
import path from "path";

// Ensure logs folder exists
const logsFolder = path.join(process.cwd(), "logs");
if (!fs.existsSync(logsFolder)) {
  fs.mkdirSync(logsFolder);
}

/**
 * Middleware factory to log backend route actions
 * Or can be used directly to log from frontend route
 * @param {string} action - Description of action
 * @param {object} [options] - Optional: { userId, role, details }
 */
export function actionLogger(action, options = {}) {
  return (req, res, next) => {
    try {
      const timestamp = new Date().toISOString();
      const userId = options.userId || req.user?.uid || "unknown";
      const role = options.role || req.user?.role || "unknown";
      const details = options.details || {};

      const logLine = `[${timestamp}] [${role}] User: ${userId} - Action: ${action} - Details: ${JSON.stringify(
        details
      )}\n`;

      const date = timestamp.split("T")[0];
      const logFile = path.join(logsFolder, `${date}.log`);

      fs.appendFile(logFile, logLine, (err) => {
        if (err) console.error("Error writing log:", err);
      });

      next();
    } catch (err) {
      console.error("Logging middleware error:", err);
      next();
    }
  };
}

/**
 * Helper to log directly without using middleware
 */
export function logActionDirect({ action, userId, role, details }) {
  try {
    const timestamp = new Date().toISOString();
    const logLine = `[${timestamp}] [${role || "unknown"}] User: ${
      userId || "unknown"
    } - Action: ${action} - Details: ${JSON.stringify(details || {})}\n`;
    const date = timestamp.split("T")[0];
    const logFile = path.join(logsFolder, `${date}.log`);

    fs.appendFileSync(logFile, logLine); // sync is fine for direct calls
  } catch (err) {
    console.error("Error logging action directly:", err);
  }
}
