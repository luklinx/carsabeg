# Database Schema - Users Table

## Overview

The `users` table stores user account information for the CarsAbeg platform. This table is created through Supabase's SQL editor.

## Table Schema

```sql
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(255) UNIQUE NOT NULL,
  full_name VARCHAR(255) NOT NULL,
  phone VARCHAR(20) NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  profile_photo_url TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create index on email for faster lookups
CREATE INDEX idx_users_email ON users(email);

-- Create index on created_at for sorting
CREATE INDEX idx_users_created_at ON users(created_at);
```

## Column Descriptions

| Column              | Type         | Constraints                            | Description                                              |
| ------------------- | ------------ | -------------------------------------- | -------------------------------------------------------- |
| `id`                | UUID         | PRIMARY KEY, DEFAULT gen_random_uuid() | Unique identifier for each user                          |
| `email`             | VARCHAR(255) | UNIQUE, NOT NULL                       | User's email address (used for login)                    |
| `full_name`         | VARCHAR(255) | NOT NULL                               | User's full name                                         |
| `phone`             | VARCHAR(20)  | NOT NULL                               | User's phone number                                      |
| `password_hash`     | VARCHAR(255) | NOT NULL                               | Bcryptjs hashed password (never store plain text)        |
| `profile_photo_url` | TEXT         | NULLABLE                               | URL to user's profile photo (stored in Supabase Storage) |
| `created_at`        | TIMESTAMP    | DEFAULT CURRENT_TIMESTAMP              | Account creation timestamp                               |
| `updated_at`        | TIMESTAMP    | DEFAULT CURRENT_TIMESTAMP              | Last profile update timestamp                            |

## Setup Instructions

1. **Go to Supabase Dashboard**

   - Navigate to your project in [supabase.com](https://supabase.com)
   - Click on "SQL Editor" in the left sidebar

2. **Run the SQL Query**

   - Copy the SQL schema above
   - Paste it into the SQL editor
   - Click "Run" to create the table and indexes

3. **Verify Creation**
   - Go to "Table Editor" in Supabase
   - You should see the new `users` table with all columns

## Security Notes

- **Passwords**: Always hashed with bcryptjs (minimum 8 rounds recommended)
- **Email Uniqueness**: Enforced at database level to prevent duplicate accounts
- **Photo Storage**: URLs point to Supabase Storage, not stored as files in the database
- **PII Protection**: Consider enabling Row Level Security (RLS) for user data

## Related Tables

- **seller_feedback**: References dealer information from cars table
- **car_reports**: Tracks reported issues with listings
- **cars**: Main car inventory table

## API Endpoints Using This Table

| Endpoint                  | Method | Purpose                                  |
| ------------------------- | ------ | ---------------------------------------- |
| `/api/auth/signup`        | POST   | Create new user account                  |
| `/api/auth/signin`        | POST   | Authenticate user and create session     |
| `/api/users/profile`      | PUT    | Update user profile information          |
| `/api/users/upload-photo` | POST   | Upload profile photo to Supabase Storage |
| `/api/auth/logout`        | POST   | Clear user session                       |

## Session Management

Sessions are stored in HTTP-only cookies with:

- **Cookie Name**: `user_id`
- **Max Age**: 30 days
- **Secure**: true (in production)
- **HttpOnly**: true (prevents JavaScript access)
- **SameSite**: Default (implicit)

## Future Enhancements

1. **Email Verification**: Add `email_verified` boolean and verification tokens
2. **Password Recovery**: Add `reset_token` and `reset_token_expires` columns
3. **2FA**: Add support for two-factor authentication
4. **Social Auth**: Support OAuth with Google, Facebook, etc.
5. **User Roles**: Add `role` column (buyer, seller, admin) for different permissions
