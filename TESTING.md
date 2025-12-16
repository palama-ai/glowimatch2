# Testing Guide: PostgreSQL Migration Verification

Complete end-to-end testing checklist for the SQLite → PostgreSQL migration.

## Prerequisites

- Backend running locally: `npm run dev` in `backend/` directory
- Frontend running: `npm run dev` in `frontend/` directory
- API base URL: `http://localhost:3001/api` (adjust if different)
- Test user email: `testuser@glowmatch.com`
- Test admin email: From `GLOWMATCH_ADMIN_EMAIL` env var

## Testing Tools

Use any of these:
- **cURL** (command line)
- **Postman** (GUI, recommended)
- **VS Code REST Client** (extension)
- **Frontend UI** (interactive testing)

## 1. Authentication Tests

### 1.1 Admin Reset Endpoint

**Endpoint:** `POST /api/auth/reset-admin`

**Purpose:** Ensure admin account is created/updated

**Test:**
```bash
curl -X POST http://localhost:3001/api/auth/reset-admin \
  -H "Content-Type: application/json" \
  -d '{}'
```

**Expected Response:**
```json
{
  "status": "ok",
  "admin": {
    "id": "uuid",
    "email": "admin@glowmatch.com",
    "role": "admin",
    "full_name": "Glowmatch Admin"
  }
}
```

**Pass Criteria:**
- ✅ Returns admin user object
- ✅ Email matches env var `GLOWMATCH_ADMIN_EMAIL`
- ✅ Role is `admin`

### 1.2 User Signup

**Endpoint:** `POST /api/auth/signup`

**Purpose:** Create new user account with referral support

**Test:**
```bash
curl -X POST http://localhost:3001/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{
    "email": "testuser@glowmatch.com",
    "password": "TempPassword123!",
    "full_name": "Test User",
    "referrerCode": "ABCDE"
  }'
```

**Expected Response:**
```json
{
  "status": "ok",
  "user": {
    "id": "uuid",
    "email": "testuser@glowmatch.com",
    "full_name": "Test User",
    "role": "user"
  },
  "token": "eyJhbGciOiJIUzI1NiIs..."
}
```

**Pass Criteria:**
- ✅ User created in `users` table
- ✅ Password hashed in `password_hash` column
- ✅ Profile created in `user_profiles` table
- ✅ Subscription created in `user_subscriptions` table
- ✅ JWT token returned (valid for 30 days)
- ✅ Referral relationship created if `referrerCode` provided

### 1.3 User Login

**Endpoint:** `POST /api/auth/login`

**Purpose:** Authenticate existing user

**Test:**
```bash
curl -X POST http://localhost:3001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "testuser@glowmatch.com",
    "password": "TempPassword123!"
  }'
```

**Expected Response:**
```json
{
  "status": "ok",
  "user": {
    "id": "uuid",
    "email": "testuser@glowmatch.com",
    "full_name": "Test User"
  },
  "token": "eyJhbGciOiJIUzI1NiIs..."
}
```

**Pass Criteria:**
- ✅ Login succeeds with correct password
- ✅ JWT token returned
- ✅ Token is different each login (not cached)
- ❌ Login fails with wrong password
- ❌ Login fails for disabled users

### 1.4 Session Verification

**Endpoint:** `GET /api/auth/session`

**Purpose:** Validate JWT token and retrieve user

**Test:**
```bash
curl -X GET http://localhost:3001/api/auth/session \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIs..." \
  -H "Content-Type: application/json"
```

**Expected Response:**
```json
{
  "status": "ok",
  "user": {
    "id": "uuid",
    "email": "testuser@glowmatch.com",
    "full_name": "Test User",
    "role": "user"
  }
}
```

**Pass Criteria:**
- ✅ Session verified with valid token
- ❌ Session fails with invalid/expired token
- ✅ User data matches database record

## 2. Referral System Tests

### 2.1 Get User's Referral Code

**Endpoint:** `GET /api/referrals/me`

**Purpose:** Fetch user's unique referral code

**Test:**
```bash
curl -X GET http://localhost:3001/api/referrals/me \
  -H "Authorization: Bearer <TOKEN>"
```

**Expected Response:**
```json
{
  "status": "ok",
  "referral_code": "ABC12",
  "referral_link": "https://yourdomain.com?ref=ABC12"
}
```

**Pass Criteria:**
- ✅ Referral code generated (5 chars, alphanumeric)
- ✅ Code stored in `users.referral_code`
- ✅ Code is unique per user
- ✅ Same code returned on subsequent calls

### 2.2 Create/Generate Referral Code

**Endpoint:** `POST /api/referrals/create`

**Purpose:** Generate new referral code for user

**Test:**
```bash
curl -X POST http://localhost:3001/api/referrals/create \
  -H "Authorization: Bearer <TOKEN>" \
  -H "Content-Type: application/json" \
  -d '{}'
```

**Expected Response:**
```json
{
  "status": "ok",
  "referral_code": "XYZ99",
  "referral_link": "https://yourdomain.com?ref=XYZ99"
}
```

**Pass Criteria:**
- ✅ New code generated if none exists
- ✅ Code stored in `referral_codes` table
- ✅ `owner_id` references user
- ✅ Code is unique across all users

### 2.3 Validate Referral Code

**Endpoint:** `GET /api/referrals/validate/:code`

**Purpose:** Verify referral code and get referrer info

**Test:**
```bash
curl -X GET http://localhost:3001/api/referrals/validate/ABC12
```

**Expected Response:**
```json
{
  "status": "ok",
  "referrer": {
    "id": "uuid",
    "email": "testuser@glowmatch.com",
    "full_name": "Test User"
  },
  "usage_stats": {
    "total_uses": 5,
    "unique_referrals": 3
  }
}
```

**Pass Criteria:**
- ✅ Valid code returns referrer info
- ✅ Usage stats updated
- ✅ `last_used_at` timestamp updated
- ❌ Invalid code returns error

### 2.4 Referral Cap (15-day limit)

**Purpose:** Verify max 10 referrals per 15 days

**Test:**
- Create 10 referrals within 15 days
- Attempt 11th referral
- Wait 15+ days
- Attempt referral again

**Expected:**
- ✅ First 10 succeed
- ✅ 11th fails with "Referral limit reached"
- ✅ After 15 days, referrals work again

## 3. Quiz System Tests

### 3.1 Autosave Quiz Progress

**Endpoint:** `POST /api/quiz/autosave/:userId`

**Purpose:** Save quiz progress temporarily

**Test:**
```bash
curl -X POST http://localhost:3001/api/quiz/autosave/user-uuid \
  -H "Authorization: Bearer <TOKEN>" \
  -H "Content-Type: application/json" \
  -d '{
    "quiz_data": "{\"answers\": [1, 2, 3], \"progress\": 50}"
  }'
```

**Expected Response:**
```json
{
  "status": "ok",
  "message": "Quiz autosaved"
}
```

**Pass Criteria:**
- ✅ Data saved to `quiz_autosave` table
- ✅ `user_id` is primary key
- ✅ Data retrieved intact on next autosave call

### 3.2 Fetch Autosaved Quiz

**Endpoint:** `GET /api/quiz/autosave/:userId`

**Purpose:** Retrieve previously saved quiz progress

**Test:**
```bash
curl -X GET http://localhost:3001/api/quiz/autosave/user-uuid \
  -H "Authorization: Bearer <TOKEN>"
```

**Expected Response:**
```json
{
  "status": "ok",
  "quiz_data": "{\"answers\": [1, 2, 3], \"progress\": 50}"
}
```

**Pass Criteria:**
- ✅ Returns saved quiz data
- ✅ JSON parsed correctly
- ✅ Returns null if no autosave exists

### 3.3 Start Quiz Attempt

**Endpoint:** `POST /api/quiz/start/:userId`

**Purpose:** Begin quiz session and decrement attempt count

**Test:**
```bash
curl -X POST http://localhost:3001/api/quiz/start/user-uuid \
  -H "Authorization: Bearer <TOKEN>"
```

**Expected Response:**
```json
{
  "status": "ok",
  "message": "Quiz attempt started",
  "remaining_attempts": 4
}
```

**Pass Criteria:**
- ✅ `quiz_attempts_used` incremented
- ✅ Remaining attempts calculated correctly
- ✅ Returns error if 0 attempts remaining
- ✅ Subscription status verified (must be active)

### 3.4 Save Quiz Attempt (with results)

**Endpoint:** `POST /api/quiz/attempts/:userId`

**Purpose:** Submit completed quiz with answers and results

**Test:**
```bash
curl -X POST http://localhost:3001/api/quiz/attempts/user-uuid \
  -H "Authorization: Bearer <TOKEN>" \
  -H "Content-Type: application/json" \
  -d '{
    "quiz_data": "{\"answers\": [1, 2, 3]}",
    "results": "{\"score\": 85, \"recommendations\": [...]}"
  }'
```

**Expected Response:**
```json
{
  "status": "ok",
  "attempt": {
    "id": "attempt-uuid",
    "user_id": "user-uuid",
    "quiz_data": "{...}",
    "results": "{...}",
    "attempt_date": "2024-01-15T10:30:00Z"
  }
}
```

**Pass Criteria:**
- ✅ New record created in `quiz_attempts` table
- ✅ `attempt_date` set to NOW()
- ✅ Autosave cleared for user
- ✅ Results stored as JSON string
- ✅ `has_image_analysis` set correctly if images present

### 3.5 Fetch Quiz History

**Endpoint:** `GET /api/quiz/attempts/:userId`

**Purpose:** Retrieve all past quiz attempts

**Test:**
```bash
curl -X GET http://localhost:3001/api/quiz/attempts/user-uuid \
  -H "Authorization: Bearer <TOKEN>"
```

**Expected Response:**
```json
{
  "status": "ok",
  "attempts": [
    {
      "id": "attempt-uuid",
      "quiz_data": "{...}",
      "results": "{...}",
      "attempt_date": "2024-01-15T10:30:00Z",
      "analysis": null
    }
  ]
}
```

**Pass Criteria:**
- ✅ Returns all user's attempts
- ✅ Ordered by `attempt_date` DESC (newest first)
- ✅ Includes all columns: quiz_data, results, analysis
- ✅ JSON fields parsed correctly

## 4. Admin Analytics Tests

### 4.1 Admin Stats Endpoint

**Endpoint:** `GET /api/admin/stats`

**Purpose:** High-level user and subscription statistics

**Test:**
```bash
curl -X GET http://localhost:3001/api/admin/stats \
  -H "Authorization: Bearer <ADMIN_TOKEN>"
```

**Expected Response:**
```json
{
  "data": {
    "total": 150,
    "active": 140,
    "disabled": 10,
    "subscribed": 85,
    "planBreakdown": {
      "premium": 50,
      "basic": 35,
      "none": 65
    }
  }
}
```

**Pass Criteria:**
- ✅ Total count matches `COUNT(*) FROM users`
- ✅ Active = total - disabled
- ✅ Subscribed = distinct users with active subscription
- ✅ Plan breakdown sums to subscribed count
- ❌ Non-admin cannot access

### 4.2 Analytics with Date Range

**Endpoint:** `GET /api/admin/analytics?range=7`

**Purpose:** 7-day analytics: active users, conversions, new users, attempts

**Test:**
```bash
curl -X GET "http://localhost:3001/api/admin/analytics?range=7" \
  -H "Authorization: Bearer <ADMIN_TOKEN>"
```

**Expected Response:**
```json
{
  "data": {
    "labels": ["2024-01-09", "2024-01-10", ..., "2024-01-15"],
    "activeSeries": [5, 8, 3, ..., 12],
    "convSeries": [1, 2, 0, ..., 3],
    "newUsersSeries": [2, 1, 1, ..., 0],
    "attemptsSeries": [10, 15, 8, ..., 20],
    "sessionDurationSeries": [120, 140, ..., 110],
    "liveUsers": 5,
    "visitCounts": { "1": 45, "7": 280, "15": 600, "30": 1200, "90": 3500 },
    "totals": {
      "totalActive": 85,
      "totalConv": 15,
      "totalNewUsers": 8,
      "totalAttempts": 150
    },
    "previousTotals": {
      "prevActive": 78,
      "prevConv": 12,
      "prevNewUsers": 6,
      "prevAttempts": 130
    },
    "growth": {
      "activePct": 9,
      "attemptsPct": 15,
      "convPct": 25,
      "newUsersPct": 33
    }
  }
}
```

**Pass Criteria:**
- ✅ Labels array length = range days
- ✅ Each series has 7 values matching labels
- ✅ All values >= 0
- ✅ `liveUsers` = COUNT(DISTINCT session_id) with last_ping_at in last 60s
- ✅ `visitCounts` has data for each range
- ✅ Growth percentages calculated correctly
- ✅ Changes to 30-day analytics when range=30

### 4.3 Report Analytics Fields

**Purpose:** Verify quiz attempt analysis fields populated correctly

**Test:**
1. Submit quiz with image analysis
2. Check admin analytics
3. Verify `report_url`, `report_storage_path`, `analysis` columns

**Expected:**
- ✅ `report_url` populated (or null if using external storage)
- ✅ `report_storage_path` populated
- ✅ `analysis` JSON field contains parsed analysis

## 5. Notifications Tests

### 5.1 Admin Send Notification

**Endpoint:** `POST /api/notifications/admin`

**Purpose:** Admin broadcasts notification to users

**Test:**
```bash
curl -X POST http://localhost:3001/api/notifications/admin \
  -H "Authorization: Bearer <ADMIN_TOKEN>" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "New Feature Available",
    "body": "Check out our improved skin analysis!",
    "target_all": true
  }'
```

**Expected Response:**
```json
{
  "status": "ok",
  "notification": {
    "id": "notif-uuid",
    "title": "New Feature Available",
    "body": "Check out our improved skin analysis!",
    "created_at": "2024-01-15T10:30:00Z"
  }
}
```

**Pass Criteria:**
- ✅ Record created in `notifications` table
- ✅ Records created in `user_notifications` for all/specific users
- ✅ `read` flag defaults to 0
- ✅ Multiple records created when `target_all=true`

### 5.2 User Fetch Notifications

**Endpoint:** `GET /api/notifications/me`

**Purpose:** User retrieves their notifications

**Test:**
```bash
curl -X GET http://localhost:3001/api/notifications/me \
  -H "Authorization: Bearer <TOKEN>"
```

**Expected Response:**
```json
{
  "status": "ok",
  "notifications": [
    {
      "id": "notif-uuid",
      "user_notification_id": "user-notif-uuid",
      "title": "New Feature Available",
      "body": "Check out...",
      "read": 0,
      "created_at": "2024-01-15T10:30:00Z"
    }
  ],
  "unread_count": 3
}
```

**Pass Criteria:**
- ✅ Returns only user's notifications (via JOIN)
- ✅ Includes `user_notification_id` for marking read
- ✅ `unread_count` accurate
- ✅ Ordered by `created_at` DESC (newest first)

### 5.3 Mark Notification as Read

**Endpoint:** `POST /api/notifications/me/:linkId/read`

**Purpose:** Mark individual notification as read

**Test:**
```bash
curl -X POST http://localhost:3001/api/notifications/me/user-notif-uuid/read \
  -H "Authorization: Bearer <TOKEN>"
```

**Expected Response:**
```json
{
  "status": "ok",
  "message": "Notification marked as read"
}
```

**Pass Criteria:**
- ✅ `user_notifications.read` set to 1
- ✅ Only user's own notifications can be marked
- ✅ Subsequent fetch shows updated `unread_count`

## 6. Blogs CRUD Tests

### 6.1 Get Published Blogs (Public)

**Endpoint:** `GET /api/blogs`

**Purpose:** Public endpoint to fetch published blog articles

**Test:**
```bash
curl -X GET http://localhost:3001/api/blogs
```

**Expected Response:**
```json
{
  "status": "ok",
  "blogs": [
    {
      "id": "blog-uuid",
      "slug": "10-skincare-tips",
      "title": "10 Skincare Tips",
      "excerpt": "Top 10 tips...",
      "image_url": "https://...",
      "published": 1,
      "created_at": "2024-01-15T10:30:00Z"
    }
  ]
}
```

**Pass Criteria:**
- ✅ Only `published=1` blogs returned
- ✅ Ordered by `created_at` DESC
- ✅ No auth required (public endpoint)

### 6.2 Admin List All Blogs

**Endpoint:** `GET /api/admin/blogs`

**Purpose:** Admin views all blogs (published and draft)

**Test:**
```bash
curl -X GET http://localhost:3001/api/admin/blogs \
  -H "Authorization: Bearer <ADMIN_TOKEN>"
```

**Expected Response:**
```json
{
  "data": [
    {
      "id": "blog-uuid",
      "slug": "draft-article",
      "title": "Draft Article",
      "published": 0,
      "created_at": "2024-01-15T10:30:00Z"
    }
  ]
}
```

**Pass Criteria:**
- ✅ Includes draft (unpublished) blogs
- ✅ Admin-only endpoint
- ✅ Returns all columns

### 6.3 Admin Create Blog

**Endpoint:** `POST /api/admin/blogs`

**Purpose:** Admin creates new blog article

**Test:**
```bash
curl -X POST http://localhost:3001/api/admin/blogs \
  -H "Authorization: Bearer <ADMIN_TOKEN>" \
  -H "Content-Type: application/json" \
  -d '{
    "slug": "skincare-routine",
    "title": "Best Skincare Routine",
    "excerpt": "A complete guide...",
    "content": "Full article content...",
    "image_url": "https://...",
    "published": 0
  }'
```

**Expected Response:**
```json
{
  "data": {
    "id": "new-blog-uuid",
    "slug": "skincare-routine",
    "title": "Best Skincare Routine",
    "published": 0,
    "created_at": "2024-01-15T10:30:00Z"
  }
}
```

**Pass Criteria:**
- ✅ New record in `blogs` table
- ✅ UUID generated for `id`
- ✅ `slug` is unique
- ✅ `created_at` and `updated_at` set to NOW()
- ✅ `published` defaults correctly

### 6.4 Admin Update Blog

**Endpoint:** `PUT /api/admin/blogs/:id`

**Purpose:** Admin edits blog article

**Test:**
```bash
curl -X PUT http://localhost:3001/api/admin/blogs/blog-uuid \
  -H "Authorization: Bearer <ADMIN_TOKEN>" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Updated Title",
    "published": 1
  }'
```

**Expected Response:**
```json
{
  "data": {
    "id": "blog-uuid",
    "title": "Updated Title",
    "published": 1,
    "updated_at": "2024-01-15T11:00:00Z"
  }
}
```

**Pass Criteria:**
- ✅ `updated_at` timestamp changes
- ✅ Slug remains unique
- ✅ Previous content preserved if not updated

### 6.5 Admin Delete Blog

**Endpoint:** `DELETE /api/admin/blogs/:id`

**Purpose:** Admin removes blog article

**Test:**
```bash
curl -X DELETE http://localhost:3001/api/admin/blogs/blog-uuid \
  -H "Authorization: Bearer <ADMIN_TOKEN>"
```

**Expected Response:**
```json
{
  "data": { "id": "blog-uuid" }
}
```

**Pass Criteria:**
- ✅ Record deleted from `blogs` table
- ✅ Subsequent GET returns 404 or empty list

## 7. Contact Form Tests

### 7.1 Submit Contact Form

**Endpoint:** `POST /api/contact`

**Purpose:** Public contact form submission

**Test:**
```bash
curl -X POST http://localhost:3001/api/contact \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john@example.com",
    "message": "I have a question about..."
  }'
```

**Expected Response:**
```json
{
  "status": "ok",
  "message": "Message received"
}
```

**Pass Criteria:**
- ✅ No auth required (public)
- ✅ Record created in `contact_messages` table
- ✅ `read` defaults to 0
- ✅ `created_at` set to NOW()

## 8. Subscription Tests

### 8.1 Get User Subscription

**Endpoint:** `GET /api/subscription/:userId`

**Purpose:** Fetch user's active subscription

**Test:**
```bash
curl -X GET http://localhost:3001/api/subscription/user-uuid \
  -H "Authorization: Bearer <TOKEN>"
```

**Expected Response:**
```json
{
  "data": {
    "id": "sub-uuid",
    "user_id": "user-uuid",
    "status": "active",
    "plan_id": "premium",
    "quiz_attempts_limit": 10,
    "quiz_attempts_used": 3,
    "current_period_end": "2024-02-15T10:30:00Z"
  }
}
```

**Pass Criteria:**
- ✅ Returns active subscription only
- ✅ Shows remaining attempts: `limit - used`
- ✅ Returns null if no active subscription

### 8.2 Create Subscription

**Endpoint:** `POST /api/subscription/subscribe`

**Purpose:** Create new subscription for user

**Test:**
```bash
curl -X POST http://localhost:3001/api/subscription/subscribe \
  -H "Authorization: Bearer <TOKEN>" \
  -H "Content-Type: application/json" \
  -d '{
    "plan_id": "premium",
    "quiz_attempts_limit": 10
  }'
```

**Expected Response:**
```json
{
  "data": {
    "id": "new-sub-uuid",
    "status": "active",
    "plan_id": "premium",
    "quiz_attempts_limit": 10,
    "current_period_start": "2024-01-15T10:30:00Z",
    "current_period_end": "2024-02-15T10:30:00Z"
  }
}
```

**Pass Criteria:**
- ✅ New record in `user_subscriptions`
- ✅ Period calculated (start = NOW, end = NOW + 1 year)
- ✅ Status defaults to "active"
- ✅ `quiz_attempts_used` initialized to 0

## 9. Profile Tests

### 9.1 Get User Profile

**Endpoint:** `GET /api/profile/:userId`

**Purpose:** Fetch user profile info

**Test:**
```bash
curl -X GET http://localhost:3001/api/profile/user-uuid \
  -H "Authorization: Bearer <TOKEN>"
```

**Expected Response:**
```json
{
  "data": {
    "id": "user-uuid",
    "email": "testuser@glowmatch.com",
    "full_name": "Test User",
    "role": "user",
    "referral_code": "ABC12",
    "referrals_made": 3,
    "referrals_received": 1
  }
}
```

**Pass Criteria:**
- ✅ Profile data returned from `user_profiles` or `users`
- ✅ Referral counts accurate
- ✅ Creates profile if missing

### 9.2 Update User Profile

**Endpoint:** `PUT /api/profile/:userId`

**Purpose:** Update profile information

**Test:**
```bash
curl -X PUT http://localhost:3001/api/profile/user-uuid \
  -H "Authorization: Bearer <TOKEN>" \
  -H "Content-Type: application/json" \
  -d '{
    "full_name": "Test User Updated",
    "status_message": "Hello, I love skincare!"
  }'
```

**Expected Response:**
```json
{
  "data": {
    "id": "user-uuid",
    "full_name": "Test User Updated",
    "updated_at": "2024-01-15T11:30:00Z"
  }
}
```

**Pass Criteria:**
- ✅ `updated_at` timestamp changes
- ✅ `referral_code` preserved
- ✅ Email cannot be changed (immutable)

## 10. Event Tracking Tests

### 10.1 Start Session

**Endpoint:** `POST /api/events/start`

**Purpose:** Initialize user session tracking

**Test:**
```bash
curl -X POST http://localhost:3001/api/events/start \
  -H "Content-Type: application/json" \
  -d '{
    "sessionId": "session-abc123",
    "userId": "user-uuid",
    "path": "/"
  }'
```

**Expected Response:**
```json
{
  "data": { "sessionId": "session-abc123" }
}
```

**Pass Criteria:**
- ✅ Record created in `site_sessions`
- ✅ `session_id` is PRIMARY KEY
- ✅ `started_at` set to NOW()

### 10.2 Session Heartbeat (Ping)

**Endpoint:** `POST /api/events/ping`

**Purpose:** Keep session alive

**Test:**
```bash
curl -X POST http://localhost:3001/api/events/ping \
  -H "Content-Type: application/json" \
  -d '{
    "sessionId": "session-abc123",
    "path": "/quiz"
  }'
```

**Expected Response:**
```json
{
  "data": { "ok": true }
}
```

**Pass Criteria:**
- ✅ `last_ping_at` updated to NOW()
- ✅ Creates session if missing

### 10.3 End Session

**Endpoint:** `POST /api/events/end`

**Purpose:** Close session and record duration

**Test:**
```bash
curl -X POST http://localhost:3001/api/events/end \
  -H "Content-Type: application/json" \
  -d '{
    "sessionId": "session-abc123",
    "duration": 1800
  }'
```

**Expected Response:**
```json
{
  "data": { "ok": true }
}
```

**Pass Criteria:**
- ✅ `duration_seconds` set
- ✅ `last_ping_at` updated

### 10.4 Record Page View

**Endpoint:** `POST /api/events/view`

**Purpose:** Track individual page visits

**Test:**
```bash
curl -X POST http://localhost:3001/api/events/view \
  -H "Content-Type: application/json" \
  -d '{
    "sessionId": "session-abc123",
    "userId": "user-uuid",
    "path": "/quiz/results"
  }'
```

**Expected Response:**
```json
{
  "data": { "id": "view-uuid" }
}
```

**Pass Criteria:**
- ✅ Record created in `page_views`
- ✅ Foreign key to `site_sessions`
- ✅ `created_at` set automatically

## 11. Admin User Management Tests

### 11.1 Admin List Users

**Endpoint:** `GET /api/admin/users`

**Purpose:** Admin views all users with subscriptions

**Test:**
```bash
curl -X GET http://localhost:3001/api/admin/users \
  -H "Authorization: Bearer <ADMIN_TOKEN>"
```

**Expected Response:**
```json
{
  "data": [
    {
      "id": "user-uuid",
      "email": "testuser@glowmatch.com",
      "full_name": "Test User",
      "role": "user",
      "disabled": 0,
      "subscription": {
        "status": "active",
        "plan_id": "premium"
      }
    }
  ]
}
```

**Pass Criteria:**
- ✅ Returns all users
- ✅ Includes subscription info

### 11.2 Admin Disable User

**Endpoint:** `PATCH /api/admin/users/:id`

**Purpose:** Admin disables user account

**Test:**
```bash
curl -X PATCH http://localhost:3001/api/admin/users/user-uuid \
  -H "Authorization: Bearer <ADMIN_TOKEN>" \
  -H "Content-Type: application/json" \
  -d '{
    "disabled": 1
  }'
```

**Expected Response:**
```json
{
  "data": {
    "id": "user-uuid",
    "disabled": 1
  }
}
```

**Pass Criteria:**
- ✅ `disabled` flag set in users table
- ✅ Disabled user cannot login
- ✅ Subsequent login attempt fails

### 11.3 Admin Delete User (Soft Delete)

**Endpoint:** `DELETE /api/admin/users/:id`

**Purpose:** Admin soft-deletes user

**Test:**
```bash
curl -X DELETE http://localhost:3001/api/admin/users/user-uuid \
  -H "Authorization: Bearer <ADMIN_TOKEN>"
```

**Expected Response:**
```json
{
  "data": { "id": "user-uuid", "deleted": 1 }
}
```

**Pass Criteria:**
- ✅ `deleted` flag set to 1
- ✅ User data not removed from DB (soft delete)
- ✅ User cannot login after deletion

## Test Execution Checklist

### Phase 1: Core Functionality (Priority 1)
- [ ] Admin Reset
- [ ] User Signup
- [ ] User Login
- [ ] Session Verification
- [ ] Referral Code Generation
- [ ] Quiz Autosave
- [ ] Quiz Attempt Submit
- [ ] Subscription Create

### Phase 2: Analytics & Admin (Priority 1)
- [ ] Admin Stats
- [ ] Analytics Endpoint (7 days)
- [ ] Admin List Users
- [ ] Admin Create Blog
- [ ] Admin Send Notification

### Phase 3: Extended Features (Priority 2)
- [ ] Referral Validation
- [ ] Referral Cap (15-day limit)
- [ ] Quiz History
- [ ] Session Tracking
- [ ] Profile Updates
- [ ] Contact Form
- [ ] Blog CRUD

### Phase 4: Edge Cases (Priority 3)
- [ ] Disabled user login
- [ ] Soft-delete verification
- [ ] Expired token handling
- [ ] Invalid referral codes
- [ ] Zero attempts remaining
- [ ] Concurrent requests
- [ ] Very large analytics ranges (90 days)

## Performance Benchmarks

Expected response times:

| Endpoint | Target | Notes |
|----------|--------|-------|
| /auth/login | <200ms | Password verification included |
| /auth/session | <100ms | Token validation only |
| /quiz/autosave | <150ms | JSON parse/save |
| /admin/analytics?range=7 | <500ms | Aggregation query |
| /admin/analytics?range=90 | <2000ms | Large date range |
| /notifications/me | <200ms | JOIN query |
| /quiz/attempts | <300ms | Multiple rows fetch |

## Known Issues & Workarounds

### Issue: Empty analytics data
**Cause:** No quiz attempts in date range
**Workaround:** Create test attempt, then query

### Issue: Slow analytics queries on large datasets
**Cause:** Missing indexes or large tables
**Workaround:** Ensure indexes present, limit date range, consider caching

### Issue: Referral code generation timeout
**Cause:** Collision avoidance loop on near-full keyspace
**Workaround:** Use longer code length or implement fallback strategy

## Success Criteria

Migration is successful when:

- ✅ All 11 test phases pass
- ✅ No `db.prepare()` calls remain in codebase
- ✅ All queries use `await sql\`...\`` pattern
- ✅ No SQLite-specific syntax in production code
- ✅ Performance benchmarks met
- ✅ Admin analytics working correctly
- ✅ Referral system functioning
- ✅ User authentication verified
- ✅ Data integrity: No data loss during migration
- ✅ Database backups operational

## Final Notes

- Always test in staging environment first
- Keep database backups before deployment
- Monitor error logs during first 24 hours post-deployment
- Have rollback plan ready (though not recommended)
- Team should review test results before production push
