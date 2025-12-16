# Deployment Guide: SQLite → PostgreSQL (Neon) Migration

This guide covers deploying the Express.js backend with Neon PostgreSQL to Vercel.

## Prerequisites

- Neon PostgreSQL account (https://neon.tech)
- Vercel account (https://vercel.com)
- Node.js 18+ installed locally
- Environment variables ready (see below)

## Step 1: Set Up Neon PostgreSQL Database

1. **Create a Neon project:**
   - Go to https://console.neon.tech
   - Click "New Project"
   - Name it (e.g., "glowmatch-prod")
   - Save the connection string with the format:
     ```
     postgresql://[user]:[password]@[host]/[database]?sslmode=require&channel_binding=require
     ```

2. **Test the connection locally:**
   - Install PostgreSQL client tools (psql) if needed
   - Test: `psql "your-connection-string"`

3. **Initialize the schema:**
   - Run the migration script:
     ```bash
     psql "your-connection-string" < backend/schema.sql
     ```
   - Or execute the SQL commands from `backend/schema.sql` in the Neon console

## Step 2: Prepare Environment Variables

Create a `.env.local` file in the `backend/` directory with:

```env
# PostgreSQL Connection (Required)
DATABASE_URL=postgresql://[user]:[password]@[host]/[database]?sslmode=require&channel_binding=require

# Authentication (Required)
GLOWMATCH_JWT_SECRET=your-strong-jwt-secret-change-this

# Admin Account (Required)
GLOWMATCH_ADMIN_EMAIL=admin@glowmatch.com
GLOWMATCH_ADMIN_PASSWORD=strong-admin-password-change-this
GLOWMATCH_ADMIN_FULLNAME=Glowmatch Admin

# AI Providers (Required for analysis features)
OPENAI_API_KEY=sk-...
GEMINI_API_KEY=...
GOOGLE_VISION_API_KEY=...

# Frontend URL
VITE_FRONTEND_URL=https://yourdomain.com
FRONTEND_URL=https://yourdomain.com

# Optional: External Storage (for quiz reports and images)
# For serverless deployment, recommend Cloudinary or AWS S3
CLOUDINARY_CLOUD_NAME=...
CLOUDINARY_API_KEY=...
CLOUDINARY_API_SECRET=...
# OR
AWS_ACCESS_KEY_ID=...
AWS_SECRET_ACCESS_KEY=...
S3_BUCKET_NAME=...
```

## Step 3: Configure package.json for Deployment

The `backend/package.json` has been updated with:
- ✅ Removed: `better-sqlite3` (SQLite)
- ✅ Added: `@neondatabase/serverless` (PostgreSQL)

No additional changes needed. Install dependencies:

```bash
cd backend
npm install
```

## Step 4: Deploy to Vercel

### Option A: Via Vercel CLI

```bash
# Install Vercel CLI
npm i -g vercel

# Login to Vercel
vercel login

# Deploy backend as serverless function
cd backend
vercel
```

### Option B: Via GitHub Integration

1. Push code to GitHub (recommended for production)
2. Connect GitHub repo to Vercel dashboard
3. Add environment variables in Vercel Project Settings
4. Enable automatic deployments on push

### Step 5: Set Environment Variables in Vercel

In the Vercel dashboard:

1. Go to Project Settings → Environment Variables
2. Add each variable from your `.env.local`:
   - `DATABASE_URL` (production)
   - `GLOWMATCH_JWT_SECRET`
   - `GLOWMATCH_ADMIN_EMAIL`
   - `GLOWMATCH_ADMIN_PASSWORD`
   - `GLOWMATCH_ADMIN_FULLNAME`
   - `OPENAI_API_KEY`
   - `GEMINI_API_KEY`
   - `GOOGLE_VISION_API_KEY`
   - `VITE_FRONTEND_URL`
   - Others as needed

3. Select "Environments": Production, Preview, Development
4. Redeploy to apply changes

## Step 6: Deploy Frontend

```bash
cd frontend
npm install
npm run build
vercel --prod
```

Set frontend environment variables similarly in Vercel dashboard.

## Step 7: Initialize Admin Account

The admin account is automatically seeded on first deployment via `db.js` init():

- **Email**: From `GLOWMATCH_ADMIN_EMAIL` env var
- **Password**: From `GLOWMATCH_ADMIN_PASSWORD` env var
- **Role**: `admin`

**First-time login:**
1. Go to your app's login page
2. Use the admin email and password from env vars
3. JWT token will be created with 30-day expiry

## Step 8: Test Deployment

### Health Check
```bash
curl https://your-vercel-app.vercel.app/api
```

Expected response:
```json
{
  "status": "ok",
  "version": "1.0.0",
  "db_ready": true
}
```

### Test Admin Analytics Endpoint
```bash
# Get JWT token first (login endpoint)
# Then:
curl -H "Authorization: Bearer <JWT_TOKEN>" \
  https://your-vercel-app.vercel.app/api/admin/analytics?range=7
```

## Serverless Constraints & Recommendations

### ⚠️ File Upload Limitations

Vercel has **read-only filesystem** at `/tmp` (max 512MB). For file uploads:

- ✅ **Do NOT** write files to local filesystem
- ✅ **Use** external storage services:
  - **Cloudinary** (recommended for images): https://cloudinary.com
  - **AWS S3** (for all files)
  - **Firebase Storage**

**Implementation:** Update `routes/report.js` to use Cloudinary SDK or AWS SDK instead of local storage.

### Connection Pooling

Neon PostgreSQL connections are managed automatically. No additional configuration needed.

### Cold Starts

- First request after deployment takes ~2 seconds (database init)
- Subsequent requests are fast (~100-200ms)
- Consider keeping app warm: Monitor dashboard or use ping service

## Troubleshooting

### Connection Error: "FATAL: server does not support channel binding"

**Solution:** Ensure DATABASE_URL includes `?channel_binding=require` parameter.

### "Error: Cannot find module '@neondatabase/serverless'"

**Solution:** Run `npm install` in backend directory:
```bash
npm install @neondatabase/serverless
```

### Admin Account Not Created

**Solution:** Check Vercel function logs:
```bash
vercel logs --follow
```

Ensure env vars are set before deployment.

### Quiz Attempts Not Saving

**Solution:** Verify:
1. `user_subscriptions` table has records
2. Subscription has active status
3. Database connection is working (`/api` health check)

### Analytics Endpoint Returns Empty Data

**Solution:** 
1. Ensure quiz attempts exist in database
2. Check `attempt_date` is populated correctly
3. Verify date range in query (`/admin/analytics?range=7`)

## Performance Optimization

### Database Indexes

All tables include indexes on frequently queried columns:
- User email, referral_code
- User ID foreign keys
- Timestamps (created_at, attempt_date, last_ping_at)
- Status columns

### Query Optimization Tips

- Use array result pattern: `await sql\`...\`` returns arrays
- Access single rows: `result[0]`
- Pagination: Use `LIMIT` and `OFFSET`
- Aggregations: Use PostgreSQL `COUNT()`, `SUM()`, `AVG()`

## Rolling Back to SQLite (Not Recommended)

If you need to revert:

1. Restore backup of `package.json` (with better-sqlite3)
2. Restore backup of `db.js` (SQLite version)
3. Restore backup of all route files
4. Reinstall dependencies: `npm install`

**Note:** This is not recommended in production. Use database backups for data recovery.

## Security Checklist

- ✅ Change all default passwords
- ✅ Use strong JWT_SECRET (32+ random characters)
- ✅ Enable HTTPS in frontend (Vercel default)
- ✅ Set `sslmode=require` in DATABASE_URL
- ✅ Use environment variables (never hardcode secrets)
- ✅ Implement rate limiting (optional, add middleware)
- ✅ Validate all user inputs
- ✅ Test CORS headers if frontend is separate domain

## Database Backups

Neon provides automated backups. Access via:
- Neon Console: https://console.neon.tech
- Snapshots tab in your project
- Restore to new branch if needed

For production, also consider:
- Manual exports: `pg_dump` to SQL file
- Weekly snapshots
- Cross-region backup service (AWS, Azure, etc.)

## Monitoring

### Enable Vercel Analytics
1. Vercel Dashboard → Project Settings → Analytics
2. Install `@vercel/analytics` in frontend
3. Monitor performance metrics

### Database Performance
- Monitor Neon dashboard for connection count
- Watch query performance metrics
- Set alerts for high CPU/memory usage

### Error Tracking
- Integrate Sentry.io for error monitoring
- Check Vercel function logs regularly
- Monitor email for auth failures

## Next Steps

1. ✅ Deploy backend to Vercel
2. ✅ Deploy frontend to Vercel (or your domain)
3. ✅ Test all endpoints
4. ✅ Set up monitoring and alerts
5. ✅ Configure backups
6. ✅ Document API for team

## Support & Resources

- **Neon Docs:** https://neon.tech/docs
- **Vercel Docs:** https://vercel.com/docs
- **PostgreSQL Docs:** https://www.postgresql.org/docs/
- **Express.js:** https://expressjs.com/
