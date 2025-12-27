# Dubizzle vertical (scaffold)

This folder contains vertical-specific notes and scaffolding for the Dubizzle-style vehicles vertical. Keep generic UI and helpers in `src/components` and `src/lib` — use this area for vertical-specific overrides and experiments.

Initial tasks:

- Build a `LocationSelector` component and wire it into `src/app/page.tsx` or a vertical homepage.
- Create `src/verticals/dubizzle/components/Filters/*` for advanced inventory filters.
- Add `src/app/api/dubizzle/health/route.ts` as a simple health check for vertical APIs.

When ready, move stable vertical routes into `src/app/verticals/dubizzle` or integrate them into `src/app` with a prefix.
