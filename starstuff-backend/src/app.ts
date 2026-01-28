import express from "express";
import searchRoutes from "./routes/search.routes";

const app = express();
const cors = require("cors");
app.use(cors());

const { seedDatabase } = require("./seed");

// Middleware to parse JSON
app.use(express.json());
seedDatabase();
// Routes
app.use("/api/search", searchRoutes);

export default app;
