import "dotenv/config";
import express from "express";
import cors from "cors";
import { initializeDatabase, seedDatabase } from "./db/database.js";
import routes from "./routes/routes.js";
import { errorHandler } from "./middleware/errorHandler.js";

const app = express();
const PORT = process.env.PORT || 4000;

initializeDatabase();
seedDatabase();

app.use(cors());
app.use(express.json({ limit: "20kb" }));

app.get("/api/health", (req, res) => {
  res.json({ success: true, message: "CodeYoung booking API is running." });
});

app.use("/api", routes);

app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "API route not found."
  });
});

app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`CodeYoung booking API running on http://localhost:${PORT}`);
});
