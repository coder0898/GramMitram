import express from "express";
import upload from "../middleware/multer.js";
import verifyFirebaseToken from "../middleware/verifyFirebaseToken.js";
import { actionLogger } from "../middleware/actionLogger.js";

const router = express.Router();

router.post(
  "/applications/:id/upload",
  actionLogger("upload doc"),
  verifyFirebaseToken,
  upload.any(),
  (req, res) => {
    if (!req.files || req.files.length === 0)
      return res.status(400).json({ error: "No files uploaded" });

    // Map files to metadata
    const uploadedFiles = req.files.map((file) => ({
      documentName: file.originalname,
      fileName: file.filename,
      fileUrl: `/uploads/${file.filename}`, // optional: add URL for download
    }));

    res.json({
      message: "Files uploaded successfully",
      uploadedFiles,
      uploadedBy: req.user.uid,
      serviceId: req.params.id,
    });
  }
);

export default router;
