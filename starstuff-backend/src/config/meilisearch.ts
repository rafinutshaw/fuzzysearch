import { MeiliSearch } from "meilisearch";
import dotenv from "dotenv";

dotenv.config();

export const meiliClient = new MeiliSearch({
  host: process.env.MEILI_HOST || "http://127.0.0.1:7700",
  apiKey: process.env.MEILI_MASTER_KEY,
});
