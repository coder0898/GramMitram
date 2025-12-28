import express from "express";
import upload from "../middleware/multer.js";
import verifyFirebaseToken from "../middleware/verifyFirebaseToken.js";
import { actionLogger } from "../middleware/actionLogger.js";

const router = express.Router();

router.post(
  "/applications/:id/upload",
  actionLogger("upload doc"),
  verifyFirebaseToken,
  upload.single("file"),
  (req, res) => {
    if (!req.file) return res.status(400).json({ error: "File not uploaded" });

    // Optional: Save metadata in database
    res.json({
      message: "File uploaded successfully",
      filename: req.file.filename,
      uploadedBy: req.user.uid,
      serviceId: req.params.id,
    });
  }
);

export default router;
