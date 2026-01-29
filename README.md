# Starstuff — Search Portal

A full-stack fuzzy search application with **ranked** and **grouped** result views. The backend powers search over users, spaces, and communities using Meilisearch; the frontend is a responsive SvelteKit app with a clear layered architecture and graceful API handling.

---

## How to Start the Project

### Prerequisites

- **Docker** and **Docker Compose** installed on your machine.
- Ports **3000**, **5173**, and **7700** available.

### Steps

1. **Backend environment**
   - Go to `starstuff-backend/`.
   - Copy `.env.example` to `.env`:
     ```bash
     cp .env.example .env
     ```
   - Adjust values if needed (defaults work with the Compose setup).

2. **Run everything with Docker Compose** (from the **project root**):

   ```bash
   docker-compose up --build
   ```

3. **Access the app**
   - **Frontend:** [http://localhost:5173](http://localhost:5173)
   - **Backend API:** [http://localhost:3000](http://localhost:3000)
   - **Meilisearch:** [http://localhost:7700](http://localhost:7700) (optional; for debugging)

4. **Stop**
   ```bash
   docker-compose down
   ```

On startup, the backend seeds SQLite and Meilisearch with ~10,000 mock records (users, spaces, communities). Use the search box with at least 3 characters and switch between **Ranked List** and **Grouped Accordion** modes.

---

## Project Structure & Technologies

### Backend (`starstuff-backend/`)

| Layer / Area    | Path / Role                                                                                          |
| --------------- | ---------------------------------------------------------------------------------------------------- |
| **Entry**       | `src/server.ts` — starts HTTP server; `src/app.ts` — Express app, CORS, JSON, routes, seed.          |
| **Routes**      | `src/routes/search.routes.ts` — `/api/search/ranked`, `/api/search/grouped`.                         |
| **Middleware**  | `src/middleware/validate.ts` — Zod-based query validation; returns 400 with error details.           |
| **Controllers** | `src/controllers/search.controller.ts` — `getRanked`, `getGrouped`; call services, send JSON or 500. |
| **Services**    | `src/services/search.service.ts` — Meilisearch multi-search (ranked/grouped).                        |
| **Schemas**     | `src/schemas/search.schema.ts` — Zod schemas and TypeScript types for query and responses.           |
| **Config**      | `src/config/meilisearch.ts` — MeiliSearch client (host, API key from env).                           |
| **Seed**        | `src/seed.ts` — SQLite + Meilisearch reset and ~10k record seed.                                     |

**Tech:** Node.js, Express 5, TypeScript, Zod, Meilisearch SDK, better-sqlite3, Faker (seed), dotenv, cors.  
**Runtime:** ESM; `tsx` for dev, `tsc` then `node dist/server.js` for production.

### Frontend (`starstuff-frontend/`)

| Layer / Area           | Path / Role                                                                                                                                                                                                                                 |
| ---------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Routes / Pages**     | `src/routes/+layout.svelte`, `+page.svelte` — layout, main page; `layout.css` — Tailwind entry.                                                                                                                                             |
| **Components**         | `src/lib/components/` — `Search.svelte`, `Header.svelte`, `Paginator.svelte`, `Accordion.svelte`; `Results/` — `Results.svelte`, `RankedResults.svelte`, `GroupedResults.svelte`, `ListItems.svelte`, `Loading.svelte`, `NoResults.svelte`. |
| **Stores (ViewModel)** | `src/lib/stores/searchViewModel.ts` — single source of truth: `results`, `loading`, `error`; `executeRankedSearch`, `executeGroupedSearch`.                                                                                                 |
| **Use cases**          | `src/lib/core/useCases/searchUseCase.ts` — `rankedSearchUseCase`, `groupedSearchUseCase`: fetch → validate with Zod → return typed data.                                                                                                    |
| **Services**           | `src/lib/core/services/SearchService.ts` — `fetchRankedResults`, `fetchGroupedResults` (calls backend API).                                                                                                                                 |
| **Schemas**            | `src/lib/core/schemas/searchSchema.ts` — Zod schemas and types mirroring backend (RankedSearchResult, GroupedSearchResult).                                                                                                                 |
| **Assets**             | `src/lib/assets/` — favicon, etc.                                                                                                                                                                                                           |

**Tech:** Svelte 5, SvelteKit 2, TypeScript, Vite 7, Tailwind CSS 4, Zod.  
**Build:** `vite build`; SvelteKit adapter-node for production (`node build/index.js`).

---

## Layered Architecture & API Response Handling

### Backend

- **Request flow:** HTTP → **Routes** → **Validation middleware** (Zod) → **Controller** → **Service** (Meilisearch) → **Controller** → **Response**.
- **Validation:** Query params (`q`, `page`, `index`) are validated with `SearchQuerySchema`. On failure, middleware returns **400** and a structured body:
  ```json
  { "status": "error", "errors": [{ "path": "q", "message": "..." }] }
  ```
- **Controllers:** Wrap service calls in try/catch. On success they send **200** and the typed payload (e.g. `RankedSearchResult`). On error they return **500** and a consistent shape:
  ```json
  { "status": "error", "data": [], "message": "<error message>" }
  ```
- **Schemas:** Shared Zod schemas and inferred types keep request/response contracts consistent and type-safe.

So: invalid input → 400 with validation errors; server/search errors → 500 with a single message; success → 200 with typed data.

### Frontend

- **Flow:** User action (e.g. submit search) → **Store** (`executeRankedSearch` / `executeGroupedSearch`) → **Use case** → **SearchService** (fetch) → **Use case** (Zod parse) → **Store** updates `results` / `loading` / `error`.
- **API handling:**
  - **SearchService** uses `fetch`; if `!response.ok` it throws (e.g. “Network error”), so 4xx/5xx are treated as failures.
  - **Use cases** call the service then run **Zod `.parse()`** on the JSON. Invalid payloads throw; the store catches and sets `error` and clears `results`.
  - **Store** centralizes state: `loading` during request, `results` on success, `error` on failure. No silent failures; UI always reflects one of these states.
- **UI feedback:**
  - **Loading:** Skeleton list (`Loading.svelte`) with pulse animation.
  - **No results:** Dedicated “No results found” message and icon.
  - **Error:** Error message from store shown to the user.
  - **Success:** Ranked list with pagination or grouped accordion.

So: network or validation errors are caught, stored, and shown; success path is validated and typed end-to-end (service → use case → store → components).

---

## UI: Snappy, Responsive & Modern

- **Tailwind CSS 4** for layout and styling: utilities, design tokens, and responsive breakpoints.
- **Responsive layout:**
  - **Mobile:** Single column; stacked search form; nav hidden (e.g. `hidden … md:flex` in Header); full-width cards and lists; touch-friendly tap targets.
  - **Desktop:** Multi-column grid (e.g. `md:grid-cols-12`) for search bar, mode selector, and button; max-width container (`max-w-4xl`) for readable content.
- **Snappy feel:**
  - **Svelte 5** reactivity and minimal re-renders; **Vite** for fast builds and HMR in development.
  - **Loading states:** Skeleton placeholders instead of blank space; **transitions** (e.g. `transition-colors`, `active:scale-95`) for immediate feedback.
  - **URL-driven state:** Query and mode in `?q=…&mode=…` so results are shareable and back/forward work without extra delay.
- **Modern look:** Slate palette, clear typography, rounded corners, light shadows, focus rings (`focus:ring-4 focus:ring-blue-100`), and consistent spacing so the app feels clean and current on both mobile and desktop.

---

## Why Meilisearch Here (≈10k Rows) & When to Consider Elasticsearch (≈10M Rows)

### Meilisearch for ~10,000 rows

- **Simple to run and integrate:** Single binary / Docker image; small config surface; SDK fits directly into the existing service layer. No cluster or index templates.
- **Fast enough for this scale:** Sub-50ms typo-tolerant search is typical at 10k documents; multi-search (users, spaces, communities) stays within comfortable latency for a snappy UI.
- **Great DX:** Default relevance and typo tolerance work well out of the box; minimal tuning required for “search as you type” and faceted use cases at this size.
- **Low operational cost:** One process, modest RAM and CPU; fits single-node or small deployments.

So for **~10k rows**, Meilisearch is a pragmatic choice: quick to ship, easy to maintain, and performant enough.

### Why Elasticsearch for ~10 million rows would be wise

- **Scale and distribution:** Elasticsearch is built for large, distributed indices. At 10M docs, you need sharding, replication, and multi-node clusters; Elasticsearch provides this natively. Meilisearch can struggle with very large single-node indices and doesn’t offer the same horizontal story.
- **Query and analytics:** Complex filters, aggregations, and analytics over big datasets are core to Elasticsearch. For “search + analytics” or heavy reporting on 10M rows, Elasticsearch is the standard.
- **Ecosystem and operations:** Mature tooling (Kibana, APM, alerting), managed offerings (Elastic Cloud, AWS OpenSearch), and a broad skill set in the industry make it easier to operate and evolve at scale.
- **Performance at volume:** With proper indexing and hardware, Elasticsearch is designed to keep query latency and throughput acceptable at tens of millions of documents and beyond; Meilisearch’s sweet spot is smaller to medium datasets.

**Summary:** For this project’s **~10k row** search, Meilisearch is the right fit. If the dataset grew to **~10M rows** and you needed distributed indexing, advanced analytics, and production-grade scaling, **migrating to Elasticsearch (or OpenSearch)** would be a wise choice.

---

## Environment Variables

| Variable           | Where   | Description                                                 |
| ------------------ | ------- | ----------------------------------------------------------- |
| `PORT`             | Backend | HTTP port (default `3000`).                                 |
| `MEILI_HOST`       | Backend | Meilisearch URL (e.g. `http://meilisearch:7700` in Docker). |
| `MEILI_MASTER_KEY` | Backend | Meilisearch API key (must match Meilisearch container).     |

Copy `starstuff-backend/.env.example` to `starstuff-backend/.env` and set these for local or Docker runs.

---

## Optional: Running Without Docker

- **Backend:** `cd starstuff-backend && npm install && npm run dev`. Ensure Meilisearch is running (e.g. Docker) and `MEILI_HOST` points to it.
- **Frontend:** `cd starstuff-frontend && npm install && npm run dev`. Set or proxy API base URL to `http://localhost:3000` if needed (e.g. in `SearchService.ts`).

---

## Repo Layout (high level)

```
starstuff/
├── docker-compose.yml      # meilisearch, backend, frontend
├── README.md               # this file
├── starstuff-backend/      # Express + Meilisearch API
│   ├── .env.example
│   ├── Dockerfile
│   ├── package.json
│   └── src/
│       ├── app.ts
│       ├── server.ts
│       ├── config/
│       ├── controllers/
│       ├── middleware/
│       ├── routes/
│       ├── schemas/
│       ├── services/
│       └── seed.ts
└── starstuff-frontend/     # SvelteKit + Tailwind
    ├── Dockerfile
    ├── package.json
    ├── svelte.config.js
    ├── vite.config.ts
    └── src/
        ├── app.html
        ├── lib/
        │   ├── components/
        │   ├── core/        # schemas, services, useCases
        │   └── stores/
        └── routes/
```
