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

   - If you use the Supabase CLI you can also apply SQL migrations with your workflow — consult the Supabase CLI docs for your setup.

3. In the Supabase dashboard Storage section, create a new bucket named `carsabeg-uploads`.

   - If you want uploaded photos to be publicly accessible via a URL, enable public access for the bucket.
   - If you prefer privacy, keep the bucket private and serve images using signed URLs (recommended for private user data).

4. Add the Supabase keys to your environment (create a `.env.local` file at the project root):

```
NEXT_PUBLIC_SUPABASE_URL=<your-supabase-url>
SUPABASE_SERVICE_ROLE_KEY=<service-role-key>
SUPABASE_ANON_KEY=<anon-key>
```

Place these in a `.env.local` file at the project root.

## Notes

- The migration file is located at `db/migrations/001_create_users_table.sql`.
- The app currently uses a simple cookie named `user_id` for session identification (HttpOnly, SameSite=lax, 30 days). For production usage, consider integrating Supabase Auth or a proper session system.
- Profile photos are uploaded to the `carsabeg-uploads` storage bucket and the public URL is stored in the `users.profile_photo_url` column.

## Features added by this branch

- Signup / Signin pages and API endpoints
- Profile page with photo upload and profile editing
- Middleware to protect `/dashboard/*` routes
- Feedback, report abuse and mark-unavailable endpoints for cars

## Running locally with migrations

The repo includes the SQL migration file. You can run it via the Supabase SQL editor or using your preferred migration tool connected to your Postgres instance.

## Troubleshooting

- If image upload fails, ensure the `carsabeg-uploads` bucket exists and your Supabase keys have Storage permissions.
- If cookies are not persisting in development, check `secure` cookie flag: it is only set in production (secure true when NODE_ENV=production).

### Example: create storage bucket using Supabase CLI

If you use the Supabase CLI you can create a bucket like this (install the CLI first):

```powershell
supabase login
supabase projects list
supabase storage create-bucket carsabeg-uploads --public
```

Replace `--public` with `--private` or omit if you want the bucket restricted.

### Verifying uploads

- Upload a small file from the browser using the profile page to confirm the `upload-photo` endpoint and storage permissions are correct.
- If you keep the bucket private, verify your code uses signed URLs or that the API returns accessible URLs for the client.

---

If you want, I can also add a small `scripts` section or GitHub Actions to run migrations automatically.
