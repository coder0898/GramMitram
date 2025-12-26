import multer from "multer";
import path from "path";
import fs from "fs";

// Upload folder path
const uploadFolder = path.join(process.cwd(), "uploads");

// Ensure folder exists
if (!fs.existsSync(uploadFolder))
  fs.mkdirSync(uploadFolder, { recursive: true });

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadFolder),
  filename: (req, file, cb) => {
    const uniqueName =
      Date.now() +
      "-" +
      Math.round(Math.random() * 1e9) +
      path.extname(file.originalname);
    cb(null, uniqueName);
  },
});

const fileFilter = (req, file, cb) => {
  const allowedTypes = ["application/pdf", "image/jpeg", "image/png"];
  if (!allowedTypes.includes(file.mimetype))
    return cb(new Error("Invalid file type"));
  cb(null, true);
};

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 },
}); // 5MB

export default upload;
