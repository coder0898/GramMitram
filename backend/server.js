import "dotenv/config"; // loads .env automatically
import express from "express";
import cors from "cors";
import uploadRoutes from "./routes/upload.routes.js";
import downloadRoutes from "./routes/download.routes.js";

const app = express();

app.use(cors());
app.use(express.json());

// Health check route
app.get("/app", (req, res) => {
  res.json({ status: "ok" });
});

// Routes
app.use("/api", uploadRoutes);
app.use("/api", downloadRoutes);

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
