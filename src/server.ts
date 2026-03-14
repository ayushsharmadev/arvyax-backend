import express from "express";
import { config } from "dotenv";
import JournalRoutes from "./routes/route.journal";
import cors from "cors";
config();

const PORT = Number(process.env.PORT) || 3000;

const app = express();

const corsOptions = {
  origin: process.env.FRONTEND_URL,
};
app.use(cors(corsOptions));
app.use(express.json());

app.get("/health", (req, res) => {
  res.json({ success: "ok" });
});

app.use("/api/journal", JournalRoutes);

app.listen(PORT, "0.0.0.0", () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
