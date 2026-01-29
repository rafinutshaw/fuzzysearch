import { meiliClient } from "./config/meilisearch.js";
import Database from "better-sqlite3";
import { faker } from "@faker-js/faker";

export const db = new Database("starstuff.db");

export const seedDatabase = async () => {
  console.log("🏗️ Ensuring tables exist...");

  // 1. Drop tables if they exist (order matters if you have Foreign Keys!)
  db.exec(`
    DROP TABLE IF EXISTS users;
    DROP TABLE IF EXISTS spaces;
    DROP TABLE IF EXISTS communities;
  `);
  db.exec(`
    CREATE TABLE  users (
      id TEXT PRIMARY KEY ,
      title TEXT NOT NULL,
      sub TEXT NOT NULL,
      avatar NOT NULL
    );

    CREATE TABLE  spaces (
      id TEXT PRIMARY KEY ,
      title TEXT NOT NULL,
      sub TEXT NOT NULL
    );

    CREATE TABLE  communities (
     id TEXT PRIMARY KEY,
      title TEXT NOT NULL,
      sub TEXT NOT NULL
    );
  `);
  console.log("🧹 Cleaning old data...");

  // 1. Clean SQLite
  // We use TRUNCATE-like behavior by deleting all rows
  db.exec(`
    DELETE FROM users;
    DELETE FROM spaces;
    DELETE FROM communities;
  `);

  // 2. Clean Meilisearch
  // Deleting the index is the fastest way to "reset"
  const indexesToReset = ["users", "spaces", "communities"];
  for (const uid of indexesToReset) {
    try {
      await meiliClient.deleteIndex(uid);
    } catch (e) {
      // Index might not exist yet, ignore error
    }
  }

  console.log("🚀 Generating new mock data...");
  const users: { id: string; title: string; sub: string; avatar: string }[] =
    [];
  const spaces: { id: string; title: string; sub: string }[] = [];
  const communities: { id: string; title: string; sub: string }[] = [];

  for (let i = 0; i < 4000; i++) {
    users.push({
      id: faker.string.uuid(),
      title: faker.person.fullName(),
      sub: `@${faker.person.firstName()}`,
      avatar: faker.image.avatar(),
    });
  }
  for (let i = 0; i < 3000; i++) {
    spaces.push({
      id: faker.string.uuid(),
      title: faker.commerce.department() + " Space",
      sub: `${faker.number.int({ min: 10, max: 2000 })} members`,
    });
  }
  for (let i = 0; i < 3000; i++) {
    communities.push({
      id: faker.string.uuid(),
      title: faker.company.name(),
      sub: "Community",
    });
  }

  // 3. Batch Insert into SQLite
  const insertUser = db.prepare("INSERT INTO users VALUES (?, ?, ?, ?)");
  const insertSpace = db.prepare("INSERT INTO spaces VALUES (?, ?, ?)");
  const insertCommunity = db.prepare(
    "INSERT INTO communities VALUES (?, ?, ?)",
  );

  db.transaction(() => {
    users.forEach((u) => insertUser.run(u.id, u.title, u.sub, u.avatar));
    spaces.forEach((s) => insertSpace.run(s.id, s.title, s.sub));
    communities.forEach((c) => insertCommunity.run(c.id, c.title, c.sub));
  })();

  // 4. Batch Insert into Meilisearch
  console.log("📡 Syncing to Meilisearch...");
  await meiliClient.index("users").addDocuments(users);
  await meiliClient.index("spaces").addDocuments(spaces);
  await meiliClient.index("communities").addDocuments(communities);

  console.log("✨ Seed complete: 10,000 records synchronized.");
};
