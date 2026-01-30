import { meiliClient } from "./config/meilisearch.js";
import Database from "better-sqlite3";
import { faker } from "@faker-js/faker";

export const db = new Database("starstuff.db");

export const seedDatabase = async () => {
  console.log("🏗️ Ensuring tables exist...");

  // 1. Re-create tables without the 'sub' column
  db.exec(`
    DROP TABLE IF EXISTS users;
    DROP TABLE IF EXISTS spaces;
    DROP TABLE IF EXISTS communities;
    
    CREATE TABLE users (
      id TEXT PRIMARY KEY,
      title TEXT NOT NULL,
      avatar TEXT NOT NULL,
      popularity INTEGER DEFAULT 0
    );

    CREATE TABLE spaces (
      id TEXT PRIMARY KEY,
      title TEXT NOT NULL,
      popularity INTEGER DEFAULT 0
    );

    CREATE TABLE communities (
      id TEXT PRIMARY KEY,
      title TEXT NOT NULL,
      popularity INTEGER DEFAULT 0
    );
  `);

  // Reset Meilisearch Indexes
  const indexesToReset = ["users", "spaces", "communities"];
  for (const uid of indexesToReset) {
    try {
      await meiliClient.deleteIndex(uid);
    } catch (e) {
      /* ignore */
    }
  }

  console.log("🚀 Generating 10k records (no sub) with fake popularity...");

  // 2. Helper to generate data without the 'sub' field
  const createMockData = (
    count: number,
    type: "user" | "space" | "community",
  ) => {
    return Array.from({ length: count }, () => ({
      id: faker.string.uuid(),
      title:
        type === "user"
          ? faker.person.fullName()
          : type === "space"
            ? `${faker.commerce.department()} ${faker.company.buzzAdjective()}`
            : faker.company.name(),
      avatar: type === "user" ? faker.image.avatar() : undefined,
      popularity: faker.number.int({ min: 0, max: 10000 }),
    }));
  };

  const users = createMockData(4000, "user");
  const spaces = createMockData(3000, "space");
  const communities = createMockData(3000, "community");

  // 3. SQLite Transaction - Updated placeholders to match new column count
  const insertUser = db.prepare("INSERT INTO users VALUES (?, ?, ?, ?)");
  const insertSpace = db.prepare("INSERT INTO spaces VALUES (?, ?, ?)");
  const insertCommunity = db.prepare(
    "INSERT INTO communities VALUES (?, ?, ?)",
  );

  db.transaction(() => {
    users.forEach((u) => insertUser.run(u.id, u.title, u.avatar, u.popularity));
    spaces.forEach((s) => insertSpace.run(s.id, s.title, s.popularity));
    communities.forEach((c) =>
      insertCommunity.run(c.id, c.title, c.popularity),
    );
  })();

  // 4. Meilisearch Sync + Ranking Configuration
  console.log("📡 Syncing to Meilisearch & configuring ranking rules...");

  for (const [uid, data] of Object.entries({ users, spaces, communities })) {
    const index = meiliClient.index(uid);
    await index.addDocuments(data);

    await index.updateSettings({
      filterableAttributes: ["type"],
      sortableAttributes: ["popularity"],
      rankingRules: [
        "words",
        "typo",
        "proximity",
        "attribute",
        "sort",
        "exactness",
      ],
    });
  }

  console.log("✨ Seed complete: Cleaned schema (removed 'sub').");
};
