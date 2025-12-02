# Vercel Deployment Setup Guide

## Critical: Environment Variables Configuration

Your backend deployment requires several environment variables to be set in **Vercel Project Settings**, not in the code.

### Step 1: Go to Vercel Dashboard

1. Navigate to [vercel.com/dashboard](https://vercel.com/dashboard)
2. Select your backend project (e.g., `backend-three-sigma-81`)
3. Click **Settings** in the top menu

### Step 2: Add Environment Variables

Click **Environment Variables** and add the following:

#### Required Variables (CRITICAL)

| Variable Name | Value | Source |
|---------------|-------|--------|
| `DATABASE_URL` | Your Neon PostgreSQL connection string | From error logs or Neon dashboard |
| `GLOWMATCH_JWT_SECRET` | Your JWT secret key | Generate a random string or save from notes |
| `GLOWMATCH_ADMIN_EMAIL` | Admin account email | e.g., `admin@glowmatch.com` |
| `GLOWMATCH_ADMIN_PASSWORD` | Admin account password | Strong password, min 8 chars |
| `GLOWMATCH_ADMIN_FULLNAME` | Admin full name | e.g., `GlowMatch Admin` |

#### Optional API Keys (for full functionality)

| Variable Name | Value | Usage |
|---------------|-------|-------|
| `OPENAI_API_KEY` | From OpenAI dashboard | Quiz analysis with GPT |
| `GEMINI_API_KEY` | From Google Cloud | Alternative analysis provider |
| `GOOGLE_VISION_API_KEY` | From Google Cloud | Image analysis |

### Step 3: Find Your DATABASE_URL

Your DATABASE_URL should look like:
```
postgresql://neondb_owner:npg_XXXXX@ep-XXXXX-pooler.us-east-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require
```

**To find it:**
1. Log in to [Neon.tech](https://neon.tech)
2. Go to your project
3. Click **Connection String**
4. Copy the full string starting with `postgresql://`

### Step 4: Redeploy

After setting environment variables:

```powershell
# Option 1: Redeploy via git push (if GitHub integration enabled)
git add .
git commit -m "Setup: Configure Vercel environment variables"
git push

# Option 2: Redeploy from Vercel dashboard
# Click the "Redeploy" button on your latest deployment
```

### Step 5: Verify Deployment

Once redeployed, check the logs:

```powershell
# Watch the deployment logs in Vercel dashboard
# Look for: "[db] ✅ Neon PostgreSQL client initialized successfully"

# Or test the health endpoint
curl https://your-backend.vercel.app/api
# Expected response: { "ok": true, "message": "GlowMatch API", "db_ready": true }
```

## Troubleshooting

### Issue: "DATABASE_URL environment variable not set"

**Cause:** Variable not added to Vercel project settings

**Fix:**
1. Double-check the variable name is exactly `DATABASE_URL` (case-sensitive)
2. Ensure value starts with `postgresql://`
3. Redeploy after adding
4. Check deployment logs to confirm variable is loaded

### Issue: "DATABASE_URL not found in environment"

**Cause:** Variable set but not deployed yet

**Fix:**
1. Wait for deployment to complete
2. Check that you're viewing logs for the latest deployment
3. Check "Redeploy" in Vercel dashboard to force new deployment

### Issue: "Error during init()"

**Cause:** Admin account creation failed or schema error

**Fix:**
1. Check that `GLOWMATCH_ADMIN_EMAIL`, `GLOWMATCH_ADMIN_PASSWORD` are set
2. Verify DATABASE_URL is correct
3. Check Vercel logs for detailed error message
4. May need to reset database or check schema migrations

## Environment Variables by Environment

### Development (Local)
Create `.env` file in project root:
```env
DATABASE_URL=postgresql://...
GLOWMATCH_JWT_SECRET=dev_secret
GLOWMATCH_ADMIN_EMAIL=admin@test.com
GLOWMATCH_ADMIN_PASSWORD=TestPassword123!
GLOWMATCH_ADMIN_FULLNAME=Test Admin
```

### Production (Vercel)
Set all variables in **Vercel Settings > Environment Variables** as described above.

## Testing After Deployment

### 1. Health Check
```bash
curl https://your-backend.vercel.app/api
```

### 2. Test Admin Login
```bash
curl -X POST https://your-backend.vercel.app/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@glowmatch.com",
    "password": "Adm1n!Glow2025#"
  }'
```

### 3. Test Sign Up
```bash
curl -X POST https://your-backend.vercel.app/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@test.com",
    "password": "TestPassword123!",
    "fullName": "Test User"
  }'
```

## File Changes Made

- `backend/vercel.json` - Simplified to reference Vercel dashboard for secrets
- `backend/index.js` - Changed to defer database initialization until first request (serverless compatibility)
- `backend/db.js` - Added better error messages and Vercel debugging info

## Next Steps

1. ✅ Add all required environment variables to Vercel dashboard
2. ✅ Redeploy the backend
3. ✅ Test health endpoint
4. ✅ Test login/signup
5. ✅ Deploy frontend
6. ✅ Test full application flow

For questions, check Vercel logs in the dashboard or re-read the error messages - they now include helpful debugging info!
