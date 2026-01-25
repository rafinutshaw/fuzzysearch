const Database = require("better-sqlite3");
const { MeiliSearch } = require("meilisearch");
const { faker } = require("@faker-js/faker");

const db = new Database("starstuff.db");
const meiliClient = new MeiliSearch({
  host: "http://127.0.0.1:7700",
  apiKey: "starstuff_master_key",
});

const seedDatabase = async () => {
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
  const indexesToReset = ["users", "spaces", "communities", "suggestions"];
  for (const uid of indexesToReset) {
    try {
      await meiliClient.deleteIndex(uid);
    } catch (e) {
      // Index might not exist yet, ignore error
    }
  }

  console.log("🚀 Generating new mock data...");
  const users = [];
  const spaces = [];
  const communities = [];

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

  // 5. Create the "Google-style" Suggestions Index
  const suggestions = [
    ...users.map((u) => ({ id: `s-${u.id}`, query: u.title })),
    ...spaces.map((c) => ({ id: `s-${c.id}`, query: c.title })),
    ...communities.map((c) => ({ id: `s-${c.id}`, query: c.title })),
  ];
  await meiliClient.index("suggestions").addDocuments(suggestions);

  console.log("✨ Seed complete: 10,000 records synchronized.");
};

module.exports = { db, seedDatabase, meiliClient };
