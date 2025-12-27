# Dubizzle Motors Vertical — Design & Implementation Notes

Goal: Adapt this project into a Dubizzle-style vertical for vehicles focused on the Nigerian market. Keep the implementation modular so the vertical can be scaled, templatized, or extended to other categories (property, jobs) later.

Contents
- Summary
- High-level UX / Pages mapping
- API + data model changes
- Folder / code organization (scalable vertical pattern)
- Short-term implementation plan (what we'll do now)
- Scaling / infra notes

## Summary

Dubizzle's strengths: location-first discovery, fast list/grid browsing, rich filters, clear CTAs for contacting sellers (WhatsApp), and trust signals (dealer verification, featured/paid listings). For Nigeria optimize for mobile, pre-filled WhatsApp messages, and quick upload flow.

## High-level UX / Pages mapping

- Homepage: location selector → localized feed of featured + recent cars.
- Listings (inventory): grid with filters, infinite scroll, sort options.
- Car detail: gallery, price, specs, contact (WhatsApp + phone), report abuse, similar cars.
- Sell flow: stepper with images, details, preview, paid/featured upsell.
- Dashboard: seller inventory, edit, mark-unavailable, feature/promotion.

## API + data model suggestions

- `cars` table fields to ensure: id, seller_id, title, make, model, year, price, currency, condition, mileage, transmission, fuel, location_city, location_state, description, images (json array), featured_until, approved, created_at, updated_at.
- Add `views_count` and `favorite_count` for signals.
- `sellers` / `dealers` table for verified sellers, with verification status, whatsapp number.
- Endpoints:
  - `GET /api/makes` and `GET /api/makes/models?make=` (already present)
  - `POST /api/sell/upload` (exists) and `POST /api/sell/submit` (exists)
  - `GET /api/cars?state=&city=&make=&model=&price_min=&price_max=&page=` — support cursor pagination
  - `POST /api/cars/:id/contact` to log inquiries

## Folder / code organization (vertical pattern)

We recommend a `src/verticals/<vertical-name>/` area that contains vertical-specific pages, components, and API routes. Example structure:

```
src/
  verticals/
    dubizzle/
      pages/            # optional, alternative to app/ where vertical-specific routes live
      components/       # vertical-specific UI (filters, hero)
      api/              # vertical-specific API wrappers or routes
      migrations/       # any vertical-specific DB scripts
      README.md
```

Runtime code that is generic (CarCard, CarGrid, lib/supabase helpers) remains in `src/components` and `src/lib` and is reused by the vertical.

## Short-term implementation plan (now)

1. Add this design doc to `docs/` and link from project `README.md` (done).
2. Add minimal scaffolding: `src/verticals/dubizzle/README.md` describing the mapping and next tasks.
3. Implement quick wins in next PRs:
   - Location-first homepage UX (component + state store)
   - Enhanced filters in `InventoryFilters` and API query params
   - Seller verification flag & WhatsApp prefill template
   - Add `views_count` column and increment endpoint for `/car/[id]`

## Scaling & infra notes

- Storage: continue using Supabase buckets; consider CDN/public buckets for images and signed URLs for private content.
- Search: for richer filters and scale, add an indexed search layer (e.g., Typesense, Meilisearch, or Postgres full-text + indexes).
- Background jobs: use serverless functions or a small worker (e.g., Supabase Edge Functions or a job queue) to process images, generate thumbnails, and send WhatsApp notifications.
- Payments/Featured: integrate a payment provider for paid listings; store `featured_until` and a ledger table.

## Next steps I can take (pick one)

- Implement `views_count` and API increment endpoint + DB migration.
- Add location-first homepage prototype and `InventoryFilters` enhancement (frontend changes only).
- Scaffold vertical API routes under `src/app/api/dubizzle/*` and wire a simple health route.

Choose one and I will implement it next.
