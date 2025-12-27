<<<<<<< HEAD
This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

````bash
npm run dev
# or
# Cars Abeg

Clean foreign used & Nigerian used cars in Nigeria.

## Local development

```bash
git clone https://github.com/luklinx/carsabeg.git
cd carsabeg
npm install
npm run dev
````

Open http://localhost:3000

## Supabase setup (manual steps)

This project uses Supabase for the database and storage. To set up the required resources:

1. Create a Supabase project at https://app.supabase.com
2. Create the `users` table by running the migration in one of these ways:

   - Use the Supabase SQL editor (recommended): open your project → SQL Editor → paste the SQL from `db/migrations/001_create_users_table.sql` → Run.

   - Or run it locally against your Postgres instance:

     ```powershell
     psql "postgres://<db_user>:<db_pass>@<db_host>:5432/<db_name>" -f db/migrations/001_create_users_table.sql
     ```

   - To apply the new canonicalization migration (recommended for staging/production), run:

     ```powershell
     # using a connection string env var PGCONN (postgres://user:pass@host:port/dbname)
     psql "$PGCONN" -f db/migrations/018_canonicalize_emails.sql
     ```

     Or use the included convenience npm script (ensure $PGCONN is set):

     ```bash
     npm run migrate:apply
     ```

   - If you use the Supabase CLI you can also apply SQL migrations with your workflow — consult the Supabase CLI docs for your setup.

3. In the Supabase dashboard Storage section, create a new bucket named `carsabeg-uploads`.

   - If you want uploaded photos to be publicly accessible via a URL, enable public access for the bucket.
   - If you prefer privacy, keep the bucket private and serve images using signed URLs (recommended for private user data).

# carsabeg

Next.js + Supabase sample app for listing and managing cars.

## Quick start

1. Install dependencies:

```bash
npm install
```

2. Create a `.env.local` at the project root with the Supabase keys:

```
NEXT_PUBLIC_SUPABASE_URL=<your-supabase-url>
SUPABASE_SERVICE_ROLE_KEY=<service-role-key>
SUPABASE_ANON_KEY=<anon-key>
```

3. Run the app (frontend + local API server):

```bash
npm run dev
```

The Next frontend will listen on http://localhost:3000 and the local API (if used) runs on port 4000 by the dev script.

## Scripts

- `npm run dev` — runs `next dev` and the local API server concurrently.
- `npm run dev:api` — runs only the local API server (`ts-node-dev`).
- `npm run dev:all` — runs both concurrently (alias for dev/configured flows).
- `npm run build` — builds the Next app.
- `npm run start` — starts the production server.
- `npm run lint` — runs `next lint`.
- `npm run test:e2e` — runs Playwright tests.

## Supabase / Database

- The repository includes `db/migrations/001_create_users_table.sql`.
- Create the `carsabeg-uploads` storage bucket in Supabase for user photos (public or private depending on your needs).

## Project tree (top-level excerpt)

```
carsabeg-restore-working-20251206
├─ db/migrations/001_create_users_table.sql
├─ public/data/cars.json
├─ package.json
├─ playwright.config.ts
├─ src/
│  ├─ app/ (Next pages & routes)
│  ├─ components/
│  ├─ lib/ (supabase helpers, utils)
│  └─ middleware.ts
├─ tests/admin-redirect.spec.ts
└─ README.md
```

For the full tree see `tree.txt` in the repo root.

## Next steps I can take

- Add a short `CONTRIBUTING.md` with local dev checks and branch rules.
- Add a small GitHub Action to run `npm run lint` and `npm run test:e2e` on PRs.
- Add a `scripts` entry for applying migrations via the Supabase CLI.

If you'd like, I can commit these README changes and add any of the next steps above. Reply with which you'd prefer.

```
carsabeg
├─ ADMIN_SETUP.md
├─ BROWSER_COMPATIBILITY.md
├─ capture-logs-output.txt
├─ capture-logs.mjs
├─ DATABASE_SCHEMA.md
├─ db
│  └─ migrations
│     ├─ 001_create_users_table.sql
│     └─ 002_create_admins_table.sql
├─ debug_19cdf6876_full.css
├─ debug_19cdf6876_head.txt
├─ debug_20ce847c_full.css
├─ debug_20ce847c_head.txt
├─ eslint.config.mjs
├─ homepage.html
├─ homepage_restored.html
├─ homepage_rollback.html
├─ homepage_rollback_confirm.html
├─ middleware.ts
├─ next.config.js
├─ OPTIMIZATION_CHECKLIST.md
├─ OPTIMIZATION_REPORT.md
├─ OPTIMIZATION_SUMMARY.md
├─ package-lock.json
├─ package.json
├─ page.html
├─ page_headers.txt
├─ page_head_headers.txt
├─ playwright.config.ts
├─ postcss.config.mjs
├─ public
│  ├─ 1logo.webp
│  ├─ cars-abeg-logo.png
│  ├─ CARSABEG-ICO.jpg
│  ├─ CARSABEG-ICON.jpg
│  ├─ CARSABEG-ICON_result.webp
│  ├─ CARSABEG-ICO_result.webp
│  ├─ carsabeg-log.png
│  ├─ carsabeg-logo.png
│  ├─ carsabeg-log_result.webp
│  ├─ carsabeg-loog.png
│  ├─ data
│  │  └─ cars.json
│  ├─ file.svg
│  ├─ globe.svg
│  ├─ logo-.png
│  ├─ logo.webp
│  ├─ logo2.webp
│  ├─ next.svg
│  ├─ vercel.svg
│  └─ window.svg
├─ QUICK_START.md
├─ README.md
├─ SELLER_FEATURES_GUIDE.md
├─ server-output.log
├─ SIGNUP_TROUBLESHOOTING.md
├─ src
│  ├─ app
│  │  ├─ (auth)
│  │  │  ├─ layout.tsx
│  │  │  └─ login
│  │  │     └─ page.tsx
│  │  ├─ admin
│  │  │  ├─ layout.tsx
│  │  │  ├─ login
│  │  │  │  └─ page.tsx
│  │  │  └─ page.tsx
│  │  ├─ api
│  │  │  ├─ auth
│  │  │  │  ├─ callback
│  │  │  │  │  └─ route.ts
│  │  │  │  ├─ check
│  │  │  │  │  └─ route.ts
│  │  │  │  ├─ logout
│  │  │  │  │  └─ route.ts
│  │  │  │  ├─ route.ts
│  │  │  │  ├─ set-session
│  │  │  │  │  └─ route.ts
│  │  │  │  ├─ signin
│  │  │  │  │  └─ route.ts.txt
│  │  │  │  └─ signup
│  │  │  │     └─ route.ts.txt
│  │  │  ├─ cars
│  │  │  │  ├─ feedback
│  │  │  │  │  └─ route.ts
│  │  │  │  ├─ mark-unavailable
│  │  │  │  │  └─ route.ts
│  │  │  │  └─ report-abuse
│  │  │  │     └─ route.ts
│  │  │  ├─ dashboard
│  │  │  │  └─ cars
│  │  │  │     └─ [id]
│  │  │  │        ├─ approve
│  │  │  │        │  └─ route.ts
│  │  │  │        ├─ delete
│  │  │  │        │  └─ route.ts
│  │  │  │        └─ feature
│  │  │  │           └─ route.ts
│  │  │  ├─ debug
│  │  │  │  ├─ storage-check
│  │  │  │  │  └─ route.ts
│  │  │  │  └─ table-check
│  │  │  │     └─ route.ts
│  │  │  ├─ makes
│  │  │  │  ├─ models
│  │  │  │  │  └─ route.ts
│  │  │  │  └─ route.ts
│  │  │  ├─ sell
│  │  │  │  ├─ draft
│  │  │  │  │  └─ route.ts
│  │  │  │  ├─ submit
│  │  │  │  │  └─ route.ts
│  │  │  │  └─ upload
│  │  │  │     └─ route.ts
│  │  │  ├─ users
│  │  │  │  ├─ profile
│  │  │  │  │  └─ route.ts
│  │  │  │  └─ upload-photo
│  │  │  │     └─ route.ts
│  │  │  └─ valuate
│  │  │     └─ route.ts
│  │  ├─ auth
│  │  │  ├─ signin
│  │  │  │  └─ page.tsx
│  │  │  └─ signup
│  │  │     └─ page.tsx
│  │  ├─ blog
│  │  │  ├─ page.tsx
│  │  │  └─ top-10-tokunbo-under-10m
│  │  │     └─ page.tsx
│  │  ├─ car
│  │  │  └─ [id]
│  │  │     └─ page.tsx
│  │  ├─ contact
│  │  │  └─ page.tsx
│  │  ├─ dashboard
│  │  │  ├─ inventory
│  │  │  │  ├─ InventoryClient.tsx
│  │  │  │  └─ page.tsx
│  │  │  ├─ layout.tsx
│  │  │  ├─ page.tsx
│  │  │  └─ profile
│  │  │     └─ page.tsx
│  │  ├─ debug-car
│  │  │  └─ page.tsx
│  │  ├─ favicon.ico
│  │  ├─ globals.css
│  │  ├─ how-it-works
│  │  │  └─ page.tsx
│  │  ├─ inventory
│  │  │  ├─ InventoryClient.tsx
│  │  │  └─ page.tsx
│  │  ├─ layout.tsx
│  │  ├─ not-found.tsx
│  │  ├─ page.tsx
│  │  ├─ place-ad
│  │  │  ├─ motors
│  │  │  │  └─ used-cars
│  │  │  │     └─ new
│  │  │  │        └─ page.tsx
│  │  │  ├─ pick-a-category
│  │  │  │  └─ page.tsx
│  │  │  ├─ pick-a-city
│  │  │  │  └─ page.tsx
│  │  │  └─ taxonomy
│  │  │     └─ motors
│  │  │        └─ page.tsx
│  │  ├─ sell
│  │  │  └─ page.tsx
│  │  ├─ test-car
│  │  │  └─ [id]
│  │  │     └─ page.tsx
│  │  └─ value-my-car
│  │     ├─ page.tsx
│  │     └─ page.txt
│  ├─ components
│  │  ├─ AdminClientPanel.tsx
│  │  ├─ AdminDashboard.txt
│  │  ├─ AdminPanel.tsx
│  │  ├─ Auth
│  │  │  ├─ AdminLoginForm.tsx
│  │  │  ├─ ClientRedirectIfAuthed.tsx
│  │  │  ├─ ProtectedRoute.tsx
│  │  │  ├─ SigninForm.tsx
│  │  │  └─ SignupForm.tsx
│  │  ├─ CarCard.tsx
│  │  ├─ CarCarousel.tsx
│  │  ├─ CarDetailActions.tsx
│  │  ├─ CarGallery.tsx
│  │  ├─ CarGrid.tsx
│  │  ├─ ClientCars.tsx
│  │  ├─ ClientHome.tsx
│  │  ├─ ClientInit.tsx
│  │  ├─ ContactForm.tsx
│  │  ├─ DesktopNav.tsx
│  │  ├─ FeaturedSection.tsx
│  │  ├─ Footer.tsx
│  │  ├─ HeaderClean.tsx
│  │  ├─ InquiryForm.tsx
│  │  ├─ InventoryFilters.tsx
│  │  ├─ Logo.tsx
│  │  ├─ MakeSelect.tsx
│  │  ├─ MobileNav.tsx
│  │  ├─ ModelSelect.tsx
│  │  ├─ ProfileForm.tsx
│  │  ├─ SellStepper.tsx
│  │  ├─ SimilarCars.tsx
│  │  ├─ StickyContactBar.tsx
│  │  ├─ ui
│  │  │  ├─ Button.tsx
│  │  │  └─ FloatingInput.tsx
│  │  ├─ UserNav.tsx
│  │  └─ WhatsAppButton.tsx
│  ├─ hooks
│  │  └─ useCar.ts
│  ├─ lib
│  │  ├─ admin.ts
│  │  ├─ auth.ts
│  │  ├─ authCookies.ts
│  │  ├─ cars.ts
│  │  ├─ supabaseAdmin.ts
│  │  ├─ supabaseClient.ts
│  │  ├─ supabaseServer.ts
│  │  └─ utils.ts
│  ├─ middleware.ts
│  ├─ pages
│  │  ├─ 404.tsx
│  │  └─ _document.tsx
│  └─ types
│     ├─ index.ts
│     ├─ supabase.ts
│     └─ uuid.d.ts
├─ tailwind.config.js
├─ tests
│  └─ admin-redirect.spec.ts
├─ tmp_19cdf6876c2cbba5.css
├─ tmp_20ce847c27a10d7c.css
├─ tree.txt
├─ tsconfig.json
└─ vercel.json

```

Recommendations to Fully Model Dubizzle Motors (and Beat Nigerian Competitors like Carsabeg, Carlots.ng, Autochek)
Dubizzle excels with clean, fast, location-first browsing, advanced filters, and trust features. Adapt these to Nigeria's market (high mobile traffic, WhatsApp inquiries, tokunbo focus, price negotiation).

For a focused plan and implementation notes, see the Dubizzle vertical design doc: `docs/DUBIZZLE_VERTICAL.md`.

1. Homepage (/app/page.tsx or ClientHome.tsx)

Make it location-first: Prompt/select state/city on load (like Dubizzle's emirate selector), then show localized featured/recent cars.
Sections: Hero with search bar, Featured cars grid, Popular makes (Toyota, Honda, Lexus—hardcode top Nigerian brands), Quick filters (price under ₦5m, ₦10m, etc.), "Sell Your Car" CTA.
Add: Recent/blog teasers (e.g., "Top 10 Tokunbo under 10m").

2. Listings Page (/inventory/page.tsx + InventoryClient.tsx)

Grid Layout: Use CarGrid + CarCard → show large primary image, price (bold), year/make/model, mileage, location, transmission/fuel badges.
Advanced Filters (expand InventoryFilters):
Make/Model (dynamic via /api/makes and /api/makes/models)
Price range slider
Year range
Mileage
Location (states/cities dropdown or chips)
Condition (Nigerian Used, Foreign Used/Tokunbo, Brand New)
Transmission, Fuel
Sort: Newest, Price low-high, Mileage, Featured

Pagination/infinite scroll.
Mobile: Collapsible sidebar filters.

3. Car Detail Page (/car/[id]/page.tsx)

Gallery: CarGallery + CarCarousel → thumbnail strip + main zoomable image.
Key Info: Title (e.g., "2020 Toyota Camry - Foreign Used"), Price big, Specs table (year, mileage, transmission, fuel, condition, location).
Description: Full text.
Contact: StickyContactBar + WhatsAppButton (pre-filled message), Call button, InquiryForm (if logged in).
Trust/Similar: Seller info (dealer_name/phone), "Report Abuse" button, SimilarCars section.
Add: Views counter, save/favorite button (if auth expanded).

4. Sell/Post Ad Flow (/place-ad/\*)

Refine stepper (SellStepper):
Category (Used/New) → City/State → Make/Model (use selects) → Details (year, price, mileage, etc.) → Images upload (multiple, via Supabase storage) → Description/Contact → Preview/Submit.

Require login for posting.
Auto-save draft (/api/sell/draft).

5. Database Enhancements (Supabase cars table)
   Your table is good—add these for better filtering/UX:
   SQLALTER TABLE public.cars
   ADD COLUMN IF NOT EXISTS body_type text, -- Sedan, SUV, Hatchback, etc.
   ADD COLUMN IF NOT EXISTS color text,
   ADD COLUMN IF NOT EXISTS vin text, -- For future history checks
   ADD COLUMN IF NOT EXISTS views integer DEFAULT 0,
   ADD COLUMN IF NOT EXISTS condition_type text -- 'nigerian_used', 'foreign_used', 'new'
   CHECK (condition_type IN ('nigerian_used', 'foreign_used', 'new'));

Index frequently filtered columns: CREATE INDEX ON cars(make, model, year, price, location, approved);

6. Other Dubizzle-Inspired Features for Nigeria

Search Bar Everywhere: Global header search (make/model/keyword + location).
Mobile Optimization: Already Tailwind—ensure sticky WhatsApp/float buttons.
Monetization: Paid featuring (extend current fields), premium dealer accounts.
Trust Builders: Manual approval flow (your admin panel), verified dealer badges, user ratings later.
SEO: Dynamic meta titles (e.g., "Toyota Camry for Sale in Lagos | CarsAbeg.ng"), sitemap.

Your structure is already 70-80% there—focus on polishing filters, location prominence, and image/contact UX to match Dubizzle's speed and conversion. Once advertised (SEO, social, Google Ads), it can compete strongly in the Nigerian tokunbo space.
