const express = require("express");
const app = express();
const cors = require("cors");
const { seedDatabase, meiliClient } = require("./seed");
const port = 3000;

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors());

seedDatabase();

app.listen(port, () => {
  console.log(`listeding at http://localhost:${port}`);
});

app.get("/", cors(), async (request, response) => {
  return response.send("Hello World!");
});

app.get("/api/search/ranked", async (req, res) => {
  const { q, page = 1, hitsPerPage = 10 } = req.query;

  try {
    const response = await meiliClient.multiSearch({
      federation: {
        // This is the magic: it merges all hits into one list
        // and provides a global ranking based on relevancy scores.
        limit: parseInt(hitsPerPage),
        offset: (parseInt(page) - 1) * parseInt(hitsPerPage),
      },
      queries: [
        { indexUid: "users", q },
        { indexUid: "spaces", q },
        { indexUid: "communities", q },
      ],
    });

    // Meilisearch returns a single 'hits' array in the root of the response
    res.json({
      hits: response.hits,
      totalHits: response.estimatedTotalHits,
      page: parseInt(page),
      hitsPerPage: parseInt(hitsPerPage),
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get("/api/search/grouped", async (req, res) => {
  const { q, uPage = 1, sPage = 1, cPage = 1 } = req.query;
  const limit = 3; // Keep the grouped view dense

  try {
    const { results } = await meiliClient.multiSearch({
      queries: [
        {
          indexUid: "users",
          q,
          hitsPerPage: limit,
          page: parseInt(uPage),
          attributesToHighlight: ["title"],
        },
        {
          indexUid: "spaces",
          q,
          hitsPerPage: limit,
          page: parseInt(sPage),
          attributesToHighlight: ["title"],
        },
        {
          indexUid: "communities",
          q,
          hitsPerPage: limit,
          page: parseInt(cPage),
          attributesToHighlight: ["title"],
        },
      ],
    });

    res.json({
      users: {
        hits: results[0].hits,
        totalPages: results[0].totalPages,
        page: results[0].page,
        hitsPerPage: parseInt(limit),
      },
      spaces: {
        hits: results[1].hits,
        totalPages: results[1].totalPages,
        page: results[1].page,
        hitsPerPage: parseInt(limit),
      },
      communities: {
        hits: results[2].hits,
        totalPages: results[2].totalPages,
        page: results[2].page,
        hitsPerPage: parseInt(limit),
      },
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
