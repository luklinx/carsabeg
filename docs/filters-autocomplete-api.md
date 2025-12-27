# Filters — Autocomplete API Contract

Status: Draft / Implemented (basic)

This document specifies the API contract for `GET /api/cars/suggest` implemented at `src/app/api/cars/suggest/route.ts`.

## Purpose

Provide short, relevant suggestions for Make / Model / Dealer autocompletion to be used by the listing form and filter inputs.

## Endpoint

GET /api/cars/suggest

## Query parameters

- q (string, required) — search term
- type (string, optional) — one of: `make`, `model`, `dealer`, or `all` (default `all`)
- limit (int, optional) — default 10, max 50

## Response

200 OK

{ success: true, data: [ { id, label, type } ], cached?: boolean }

Error 400 when `q` missing.

## Implementation notes

- Uses `ilike` partial matches on `makes.name`, `models.name`, and `dealers.name` for the initial implementation.
- Returns deduplicated results with a short in-memory cache (10s) to reduce repeated hits for identical terms; this will be replaced by Redis-based caching in the Cache & Infra task.

## Next steps

- Replace in-memory cache with Redis (`src/lib/cache.ts`) and add TTL + invalidation hooks when makes/models/dealers are updated.
- Improve ranking using pg_trgm `similarity()` in SQL and return a score to the client for sorting (needs pg_trgm extension and order by similarity).
- Add integration & E2E tests that verify autocomplete UX in the frontend (debouncing, keyboard interaction).

Document author: GitHub Copilot
Date: 2025-12-26
