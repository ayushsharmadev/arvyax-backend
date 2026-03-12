import express from "express";
import { config } from "dotenv";
config();

const PORT = process.env.PORT || 3000;

const app = express();

app.get("/health", (req, res) => {
  res.json({ success: "ok" });
});

app.listen(PORT, ()=>{
    console.log(`Server is running on http://localhost/${PORT}`)
})