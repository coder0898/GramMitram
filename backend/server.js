import "dotenv/config"; // loads .env automatically
import express from "express";
import cors from "cors";

const app = express();
app.use(cors());
app.use(express.json());

// Health check route
app.get("/app", (req, res) => {
  res.send({ status: "ok" });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
