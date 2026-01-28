// src/config/meilisearch.ts
import { MeiliSearch } from "meilisearch";
import dotenv from "dotenv";

dotenv.config();

export const meiliClient = new MeiliSearch({
  host: process.env.MEILI_HOST || "http://localhost:7700",
  apiKey: process.env.MEILI_MASTER_KEY,
});
