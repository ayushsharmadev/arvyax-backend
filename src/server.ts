import express from "express";
import { config } from "dotenv";
import JournalRoutes from "./routes/route.journal"
config();

const PORT = process.env.PORT || 3000;

const app = express();

app.use(express.json());

app.get("/health", (req, res) => {
  res.json({ success: "ok" });
});

app.use('/api/journal',JournalRoutes)

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
