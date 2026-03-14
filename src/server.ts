import express from "express";
import { config } from "dotenv";
import JournalRoutes from "./routes/route.journal.js";
import cors from "cors";
config();

const PORT = Number(process.env.PORT) || 3000;

const app = express();

app.use(cors());
app.use(express.json());

app.get("/health", (req, res) => {
  res.json({ success: "ok" });
});

app.get("/", (req, res) => {
  res.send("API is running");
});

app.use("/api/journal", JournalRoutes);

app.listen(PORT, "0.0.0.0", () => {
  console.log(`Server is running on http://0.0.0.0:${PORT}`);
});
