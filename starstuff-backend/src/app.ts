import express from "express";
import cors from "cors";
import searchRoutes from "./routes/search.routes.js";
import { seedDatabase } from "./seed.js";

const app = express();
app.use(cors());

// Middleware to parse JSON
app.use(express.json());
seedDatabase();
// Routes
app.use("/api/search", searchRoutes);

export default app;
