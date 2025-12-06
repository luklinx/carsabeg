# Signup Troubleshooting Guide

If you see "Failed to create account" error when trying to sign up, follow these steps:

## Step 1: Verify the `users` table exists

1. Go to your Supabase dashboard → SQL Editor
2. Run this query to check if the table exists:
   ```sql
   SELECT table_name FROM information_schema.tables
   WHERE table_schema='public' AND table_name='users';
   ```
3. If no results, the table doesn't exist yet.

## Step 2: Create the `users` table

If the table doesn't exist, run the migration SQL:

1. In Supabase SQL Editor, copy and paste the entire contents of:

   ```
   db/migrations/001_create_users_table.sql
   ```

2. Click "Run" to execute the migration

3. Verify the table was created by running:
   ```sql
   SELECT COUNT(*) FROM users;
   ```

## Step 3: Check the browser console for detailed error

1. Open your browser's Developer Tools (F12 or Cmd+Option+I)
2. Go to the **Console** tab
3. Try signing up again
4. Look for console logs that show the actual error message from the API
5. Share this error message if you need help

## Step 4: Check the deployment logs (if on Vercel)

If testing on Vercel:

1. Go to https://vercel.com → your project
2. Click "Deployments" → latest deployment
3. Click "Functions" tab
4. Look for logs from the `/api/auth/signup` endpoint
5. These logs will show the actual Supabase error

## Step 5: Test the table directly

Copy and paste this into your Supabase SQL Editor to insert a test user:

```sql
INSERT INTO users (full_name, email, phone, password_hash)
VALUES ('Test User', 'test@example.com', '+234901234567', 'test_hash_12345');
```

If this works, your table is fine. If it fails, there's a table schema issue.

## Common Issues

### "Email already registered"

- The email already exists in the database
- Try signing up with a different email

### "All fields are required"

- Check that all fields are filled before submitting
- Verify no field has extra whitespace that's being validated

### "Internal server error"

- Check Supabase logs (most likely the `users` table doesn't exist)
- Verify your `SUPABASE_SERVICE_ROLE_KEY` is correct in environment variables
- Check that the user has INSERT permission on the `users` table

---

**Quick diagnostic:** Visit `/api/debug/table-check` in your browser to see if the users table is accessible.
