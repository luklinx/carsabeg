# Car Detail Page - Active Features Implementation Guide

## Overview

The car detail page (`/car/[id]`) now includes fully functional seller information, feedback system, and safety tools. All data is dynamically fetched from Supabase and connected to working API endpoints.

## Features Implemented

### 1. **About the Seller Section**

- **Seller Name**: Pulled from `car.dealer_name` in the database
- **Contact Phone**: Clickable `tel:` link from `car.dealer_phone`
- **Active Listings**: Dynamic count fetched by querying all approved cars by that dealer name
- **Seller Rating**: Displays average rating and total reviews if feedback exists

### 2. **Leave Feedback Modal**

- **Input Fields**:
  - Email address (required)
  - 5-star rating selector (interactive stars)
  - Optional comment textarea
- **API Endpoint**: `POST /api/cars/feedback`
- **Data Stored**: In `seller_feedback` table with:
  - `dealer_id`, `rating`, `comment`, `user_email`, `created_at`
- **Features**:
  - Real-time validation
  - Loading state while submitting
  - Success/error messages
  - Auto-closes after successful submission

### 3. **Mark as Unavailable**

- **Purpose**: Allows users to flag cars that are sold or no longer available
- **API Endpoint**: `POST /api/cars/mark-unavailable`
- **Data Stored**: In `car_reports` table with:
  - `car_id`, `report_type: "unavailable"`, `reason`, `created_at`
- **UI**: Confirmation modal before submission

### 4. **Report Abuse**

- **Input Fields**:
  - Reason dropdown (Fake Listing, Misleading Info, Scam, Harassment, Inappropriate, Other)
  - Details textarea (optional)
  - Email (optional)
- **API Endpoint**: `POST /api/cars/report-abuse`
- **Data Stored**: In `car_reports` table with:
  - `car_id`, `dealer_id`, `report_type: "abuse"`, `reason`, `details`, `user_email`, `created_at`
- **Features**:
  - Anonymous option (if no email provided)
  - Form validation
  - Loading states
  - Success confirmation

### 5. **Safety Tips Section**

- Static 4-card section with icons and guidance:
  - Meet in Safe Places
  - Verify Identity
  - Get Vehicle Inspection
  - Use Secure Payment
- Fully responsive on all devices

## Database Tables Required

To fully enable feedback and reporting features, create these tables in Supabase:

```sql
-- Seller Feedback Table
CREATE TABLE seller_feedback (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  dealer_id TEXT NOT NULL,
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  comment TEXT,
  user_email TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Car Reports Table (for unavailable & abuse)
CREATE TABLE car_reports (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  car_id TEXT NOT NULL,
  dealer_id TEXT,
  report_type TEXT NOT NULL, -- "unavailable" or "abuse"
  reason TEXT NOT NULL,
  details TEXT,
  user_email TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Add indexes for performance
CREATE INDEX idx_seller_feedback_dealer_id ON seller_feedback(dealer_id);
CREATE INDEX idx_car_reports_car_id ON car_reports(car_id);
CREATE INDEX idx_car_reports_type ON car_reports(report_type);
```

## Component Architecture

### Server Component: `car/[id]/page.tsx`

- Fetches car data from Supabase
- Queries dealer's active ad count
- Attempts to fetch dealer's feedback rating
- Passes data to `CarDetailActions` client component

### Client Component: `CarDetailActions.tsx`

- Manages all modal states and form logic
- Handles API calls to feedback/report endpoints
- Displays feedback, updates UI based on responses
- Fully responsive with Tailwind CSS

## How It Works End-to-End

### Leaving Feedback Flow:

1. User clicks "Leave Feedback About This Seller" button
2. Feedback modal opens (client-side state)
3. User enters email, selects rating, adds optional comment
4. Click "Submit Feedback" → sends POST to `/api/cars/feedback`
5. API validates and inserts into `seller_feedback` table
6. Success message displayed, modal closes after 1.5s
7. Dealer's rating updates automatically on next page visit

### Reporting Abuse Flow:

1. User clicks "Report Abuse" button
2. Abuse modal opens with reason dropdown and details field
3. User selects reason, adds details, optionally provides email
4. Click "Submit Report" → sends POST to `/api/cars/report-abuse`
5. API inserts into `car_reports` table with type "abuse"
6. Success confirmation message shown
7. Report logged for moderation team review

### Marking Unavailable Flow:

1. User clicks "Mark as Unavailable" button
2. Confirmation modal displayed
3. User confirms → sends POST to `/api/cars/mark-unavailable`
4. API inserts into `car_reports` table with type "unavailable"
5. Success message displayed
6. Cars team can view and act on these reports

## Customization

### Styling

All modals and sections use Tailwind CSS with responsive breakpoints:

- Mobile-first approach
- `sm:`, `md:`, `lg:` breakpoints
- Dark mode compatible

### API Responses

All endpoints return JSON with:

```json
{
  "success": boolean,
  "message": "Human-readable message",
  "error": "Error message if applicable",
  "data": {}
}
```

### Validation

- Email validation on feedback form
- Reason dropdown required for abuse reports
- All endpoints sanitize inputs

## Testing

1. **Development**: Start the dev server and navigate to any car detail page
2. **Test Feedback**: Submit a 5-star review with email
3. **Test Reports**: Try both "Mark Unavailable" and "Report Abuse"
4. **Database Check**: Verify entries in Supabase tables

## Future Enhancements

- Admin dashboard to view and manage reports
- Email notifications to sellers about feedback
- Moderation queue for abuse reports
- Seller response to feedback
- Review ratings displayed on seller profile
- Report status tracking (resolved, under review, dismissed)
