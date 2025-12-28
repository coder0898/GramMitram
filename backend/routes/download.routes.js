// import express from "express";
// import path from "path";
// import fs from "fs";
// import { verifyFirebaseToken } from "../middleware/verifyFirebaseToken.js";
// import requireStaff from "../middleware/requiredStaff.js";

// const router = express.Router();

// router.get(
//   "/files/:filename",
//   verifyFirebaseToken,
//   requireStaff,
//   (req, res) => {
//     const filePath = path.join(process.cwd(), "uploads", req.params.filename);

//     if (!fs.existsSync(filePath))
//       return res.status(404).json({ error: "File not found" });

//     res.download(filePath, (err) => {
//       if (err) res.status(500).json({ error: "Error downloading file" });
//     });
//   }
// );

// export default router;

import express from "express";
import path from "path";
import fs from "fs";
import verifyFirebaseToken from "../middleware/verifyFirebaseToken.js";
import requiredStaff from "../middleware/requiredStaff.js";
import { actionLogger } from "../middleware/actionLogger.js";
const router = express.Router();

router.get(
  "/files/:filename",
  actionLogger("download doc"),
  verifyFirebaseToken,
  requiredStaff,
  (req, res) => {
    const filePath = path.join(process.cwd(), "uploads", req.params.filename);

    if (!fs.existsSync(filePath))
      return res.status(404).json({ error: "File not found" });

    res.download(filePath, (err) => {
      if (err) res.status(500).json({ error: "Error downloading file" });
    });
  }
);

export default router;
