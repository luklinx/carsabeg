# Filters — DB Design & Migrations

Status: Draft

This document describes the database-level design and migration steps required to support performant, accurate, and scalable filtering across the listings workflow (listing form → inventory → car detail). It includes schema proposals, migrations (UP/DOWN), indexing strategy (including pg_trgm), test queries, rollback strategy, acceptance criteria, and a rough rollout plan.

---

## Goals

- Support server-driven filtering (fast queries using indexes) with accurate facet counts.
- Provide fast autocomplete for Make/Model/Dealer name.
- Minimize locking and downtime during migration for large production tables.
- Provide rollbackable migrations and testing guidance.

---

## Key schema proposals (high-level)

1. Normalize filterable lookup tables (if not already present):

   - `makes(id, name)`
   - `models(id, make_id, name)`
   - `cities(id, name, slug)`
   - `dealers(id, name, ... )`
   - `features(id, key, label)` — generic catalog of feature badges
   - `car_features(car_id, feature_id)` — many-to-many

2. Ensure `cars` table uses normalized FK columns where possible:

   - `cars.make_id INT REFERENCES makes(id)`
   - `cars.model_id INT REFERENCES models(id)`
   - `cars.city_id INT REFERENCES cities(id)`
   - `cars.dealer_id INT REFERENCES dealers(id)`
   - Leave free-text fields (title, description) for search only

3. Keep numeric filtering columns typed:

   - `price INTEGER`, `year INTEGER`, `kilometers INTEGER`

4. Optionally keep feature flags as both normalized entries and a JSONB `attributes` column for flexible searching (useful but GIN indexes required).

---

## Indexing Strategy (recommended)

- TEXT SEARCH / AUTOCOMPLETE

  - Enable pg_trgm extension (one-time):
    - `CREATE EXTENSION IF NOT EXISTS pg_trgm;`
  - Trigram index for title/keyword/dealer name (lowercase):
    - `CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_cars_title_trgm ON cars USING gin (lower(title) gin_trgm_ops);`
    - `CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_dealers_name_trgm ON dealers USING gin (lower(name) gin_trgm_ops);`
  - Consider additional index on `lower(make_name || ' ' || model_name)` or maintain a denormalized `search_name` for suggestions.

- FILTER COLUMNS

  - Single-column indexes:
    - `CREATE INDEX CONCURRENTLY idx_cars_city_id ON cars(city_id);`
    - `CREATE INDEX CONCURRENTLY idx_cars_make_id ON cars(make_id);`
    - `CREATE INDEX CONCURRENTLY idx_cars_model_id ON cars(model_id);`
    - `CREATE INDEX CONCURRENTLY idx_cars_price ON cars(price);`
    - `CREATE INDEX CONCURRENTLY idx_cars_year ON cars(year);`
    - `CREATE INDEX CONCURRENTLY idx_cars_kilometers ON cars(kilometers);`

- JSONB / FEATURES

  - If you store multi-value features in JSONB, add a GIN index:
    - `CREATE INDEX CONCURRENTLY idx_cars_attributes_gin ON cars USING gin (attributes jsonb_path_ops);`
  - If normalized via `car_features`, add indexes:
    - `CREATE INDEX CONCURRENTLY idx_car_features_car_id ON car_features(car_id);`
    - `CREATE INDEX CONCURRENTLY idx_car_features_feature_id ON car_features(feature_id);`

- COMPOSITE INDEXES (if queries show hotspots)
  - Example: if many queries filter by (make_id, city_id) frequently:
    - `CREATE INDEX CONCURRENTLY idx_cars_make_city_price ON cars(make_id, city_id, price);`
  - Add composites conservatively after profiling.

Notes: Use `CONCURRENTLY` for index creation on large tables to avoid exclusive locks. Some migrations systems don’t support `CONCURRENTLY` inside transactions — handle accordingly.

---

## Suggested Migration Files & SQL

Place these under `db/migrations/` with sequential filenames (follow project convention). Example filenames:

- `016_add_pg_trgm_and_autocomplete_indexes.sql` (UP + DOWN blocks)
- `017_add_filter_indexes.sql` (UP + DOWN blocks)
- `018_add_features_table_and_join.sql` (UP + DOWN blocks)

Example: `016_add_pg_trgm_and_autocomplete_indexes.sql`

UP (safe):

```sql
-- enable extension (noop if exists)
CREATE EXTENSION IF NOT EXISTS pg_trgm;

-- trigram indexes for fast autocomplete / similarity
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_cars_title_trgm ON cars USING gin (lower(title) gin_trgm_ops);
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_dealers_name_trgm ON dealers USING gin (lower(name) gin_trgm_ops);
```

DOWN (rollback):

```sql
DROP INDEX IF EXISTS idx_cars_title_trgm;
DROP INDEX IF EXISTS idx_dealers_name_trgm;
```

Example: `017_add_filter_indexes.sql`

UP:

```sql
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_cars_city_id ON cars(city_id);
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_cars_make_id ON cars(make_id);
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_cars_model_id ON cars(model_id);
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_cars_price ON cars(price);
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_cars_year ON cars(year);
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_cars_kilometers ON cars(kilometers);
```

DOWN:

```sql
DROP INDEX IF EXISTS idx_cars_city_id;
DROP INDEX IF EXISTS idx_cars_make_id;
DROP INDEX IF EXISTS idx_cars_model_id;
DROP INDEX IF EXISTS idx_cars_price;
DROP INDEX IF EXISTS idx_cars_year;
DROP INDEX IF EXISTS idx_cars_kilometers;
```

Example: `018_add_features_table_and_join.sql`

UP:

```sql
CREATE TABLE IF NOT EXISTS features (
  id serial PRIMARY KEY,
  key text NOT NULL UNIQUE,
  label text NOT NULL
);

CREATE TABLE IF NOT EXISTS car_features (
  car_id int NOT NULL REFERENCES cars(id) ON DELETE CASCADE,
  feature_id int NOT NULL REFERENCES features(id) ON DELETE CASCADE,
  PRIMARY KEY (car_id, feature_id)
);

CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_car_features_feature_id ON car_features(feature_id);
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_car_features_car_id ON car_features(car_id);
```

DOWN:

```sql
DROP INDEX IF EXISTS idx_car_features_feature_id;
DROP INDEX IF EXISTS idx_car_features_car_id;
DROP TABLE IF EXISTS car_features;
DROP TABLE IF EXISTS features;
```

**Important:** For very large tables, consider:

- Creating indexes `CONCURRENTLY` outside of a single migration transaction (your migration tool may require splitting).
- Avoid actions that perform full-table lock (e.g., `ALTER TABLE ... SET NOT NULL`) without a safe backfill plan.

---

## Range & facet counts (materialized view vs cache)

- For facet counts (e.g., counts per city or per body type), two strategies:
  1. Precompute counts in a materialized view and refresh periodically. Good for static-ish facets.
  2. Cache facet results in Redis (keyed by normalized filter payload). Use short TTL and revalidate in background.

Example materialized view for make counts:

```sql
CREATE MATERIALIZED VIEW mv_make_counts AS
SELECT make_id, count(*) as total
FROM cars
GROUP BY make_id;
-- refresh materialized view: REFRESH MATERIALIZED VIEW CONCURRENTLY mv_make_counts;
```

Use case: For dynamic facets that depend on current filters, compute on the server per-request but cache results for identical payloads.

---

## Test queries & performance validation

1. Validate indexes help with EXPLAIN ANALYZE:

```sql
EXPLAIN ANALYZE
SELECT id, title, price FROM cars
WHERE make_id = 12 AND city_id = 3 AND price BETWEEN 10000 AND 40000
ORDER BY created_at DESC
LIMIT 20;
```

2. Autocomplete speed:

```sql
EXPLAIN ANALYZE
SELECT id, name FROM dealers
WHERE lower(name) ILIKE '%' || lower('toy') || '%'
ORDER BY similarity(lower(name), lower('toy')) DESC
LIMIT 10;
```

3. Feature join cardinality:

```sql
EXPLAIN ANALYZE
SELECT c.id FROM cars c
JOIN car_features cf ON cf.car_id = c.id
WHERE cf.feature_id = 5
LIMIT 10;
```

Collect timings pre/post migration and compare.

---

## Rollback strategy and safety

- Index creation should be CONCURRENT to avoid long locks.
- If your migration toolbar runs all SQL inside a single transaction, split index-creation into separate migration file(s) to run outside transaction.
- Add new nullable FK columns and backfill in batches before adding NOT NULL constraints.
- Provide DOWN scripts (drop indexes/tables) and a rollback playbook (psql commands) for emergency rollbacks.

Rollback example for a bad index:

```bash
psql $DATABASE_URL -c "DROP INDEX IF EXISTS idx_cars_price;"
```

If an index creation failed halfway, re-run `CREATE INDEX CONCURRENTLY` after fixing the root cause.

---

## Acceptance criteria

- Migration SQL files added to `db/migrations/` with `UP` blocks that run successfully on a staging DB.
- Indexes created with minimal locking; queries that previously scanned full table now use indexes (verified using EXPLAIN ANALYZE and reduced planning/execution times).
- Autocomplete queries return <100ms for typical workloads (measured in staging).
- Materialized view / cache approach for facets implemented or a caching strategy documented and tested.
- Rollbacks for these migrations are documented and tested (on staging).

---

## Testing & verification checklist

- [ ] Create temporary staging deployment and run migrations.
- [ ] Run EXPLAIN ANALYZE before/after on representative queries.
- [ ] Load test search and suggest endpoints (k6 or Artillery) to validate latencies.
- [ ] Run integration tests for listing flows that assert correct filters are returned.
- [ ] Validate that migrating live data did not block writes/reads.

---

## Risks & mitigations

- Long-running index creation — mitigate using `CONCURRENTLY`, schedule off-peak, test on staging with realistic data size.
- FK backfill large update impact — perform in small batched updates with a sleep between batches.
- Wrong index choices — only add composite indexes after profiling and seeing real hotspots.

---

## Rollout & timeline (suggested)

1. Add pg_trgm and autocomplete indexes on staging (1–2 days including verification)
2. Add filter column indexes on staging and run query benchmarks (1 day)
3. Add features tables and perform small backfills if needed (1 day)
4. Run load tests and finalize rollout plan (1–2 days)
5. Apply to production in a maintenance window if necessary (1 day)

---

## Next steps

- Implement & commit migration files under `db/migrations/` (following the filenames suggested above).
- Run migrations on dev/staging and execute the test checklist.
- If accepted, mark DB design as complete and start implementation of `GET /api/cars/search` (see todo list).

---

Document author: GitHub Copilot
Date: 2025-12-26
