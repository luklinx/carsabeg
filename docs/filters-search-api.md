# Filters — Search API Contract

Status: Draft / Implemented (basic)

This document specifies the API contract for `GET /api/cars/search` implemented at `src/app/api/cars/search/route.ts`.

## Purpose

Provide paginated, server-driven search for cars with basic filtering, sorting, and metadata for the frontend.

## Endpoint

GET /api/cars/search

## Query parameters

- page (int, default: 1)
- page_size (int, default: 12, max: 100)
- make (string, optional; case-insensitive partial match)
- model (string, optional; case-insensitive partial match)
- city (string, optional)
- dealer_name (string, optional)
- keyword (string, optional; searches make/model/dealer/description)
- price_min, price_max (int, optional)
- year_min, year_max (int, optional)
- seller_type, body_type, exterior_color, interior_color, market (string, optional)
  Notes: This first implementation uses offset pagination and ilike filters for text matching. Later iterations will replace this with cursor-based pagination and pre-aggregated facets.

## Response

200 OK

{
success: true,
data: [ /* array of car objects (subset fields) */ ],
meta: {
page: number,
page*size: number,
total: number | null, // if Supabase returns exact count, else null
total_pages: number | null
},
facets: { /* counts by seller_type, body_type, exterior_color, interior_color, market \*/ },
timings: { ms: number }
}

## Implementation notes

- The implementation uses `getSupabaseServer()` for DB access and `ilike`/`gte`/`lte` filters; the first pass returns basic fields and total count when available.
- Facet aggregation (counts grouped by make/city/body_type/etc.) is deferred to the next task (cache & infra) to add efficient caching and avoid heavy per-request aggregations.

## Next steps / TODO

- Add cursor-based pagination for larger datasets and more consistent pagination.
- Implement facet aggregation using materialized views or Redis cache with short TTL.
- Add logging/tracing for query times and resource usage for monitoring and alerting.
- Add integration tests and E2E tests for search behaviors (apply filters, pagination, sort).

Document author: GitHub Copilot
Date: 2025-12-26
