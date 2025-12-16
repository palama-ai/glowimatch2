# GlowMatch Deployment Checklist - Vercel

## Critical Issues & Solutions

### Issue 1: Database Not Initializing
**Error:** `DATABASE_URL environment variable not set`
**Cause:** Environment variables not set in Vercel dashboard
**Solution:**

1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Select your **backend project** (e.g., `backend-three-sigma-81`)
3. Click **Settings** → **Environment Variables**
4. Add the following variables:

| Variable | Value | Source |
|----------|-------|--------|
| `DATABASE_URL` | `postgresql://...` | From Neon dashboard |
| `GLOWMATCH_ADMIN_EMAIL` | `admin@glowmatch.com` | From `.env` |
| `GLOWMATCH_ADMIN_PASSWORD` | `Adm1n!Glow2025#` | From `.env` |
| `GLOWMATCH_ADMIN_FULLNAME` | `GlowMatch Admin` | From `.env` |
| `GLOWMATCH_JWT_SECRET` | Your JWT secret | From `.env` |
| `GLOWMATCH_ADMIN_RESET_SECRET` | `admin-reset-secret-12345` | From `.env` |

5. Click **Redeploy** to apply changes

### Issue 2: Admin Account "Invalid Credentials"
**Error:** Login fails with "Invalid credentials" even with correct password
**Cause:** Admin account doesn't exist in database yet
**Solution:** After setting `DATABASE_URL`:

```bash
# Option 1: Redeploy (triggers auto-creation)
vercel --prod

# Option 2: Manual admin creation via reset endpoint
curl -X POST https://your-backend.vercel.app/api/auth/reset-admin \
  -H "x-admin-reset: admin-reset-secret-12345" \
  -H "Content-Type: application/json" \
  -d '{}'
```

### Issue 3: Signup Returns 409 (Conflict)
**Error:** `POST /api/auth/signup` returns 409 "User already exists"
**Cause:** Admin account already created
**Solution:** Use different email or login as admin

### Issue 4: Subscription Returns 500
**Error:** `GET /api/subscription/[ID]` returns 500
**Cause:** Database initialization failed or credentials missing
**Solution:** 
1. Check Vercel logs: `vercel logs` 
2. Verify DATABASE_URL is set
3. Redeploy: `vercel --prod`

---

## Health Check Endpoints

### Check Backend Status
```bash
curl https://your-backend.vercel.app/api
```

**Response:**
```json
{
  "ok": true,
  "message": "GlowMatch API",
  "db_ready": true,
  "db_initializing": false,
  "database_url_present": true,
  "routes": "/__routes"
}
```

### List All Routes
```bash
curl https://your-backend.vercel.app/__routes
```

### Test Login
```bash
curl -X POST https://your-backend.vercel.app/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@glowmatch.com",
    "password": "Adm1n!Glow2025#"
  }'
```

---

## Environment Variables Reference

### Backend (Vercel Project Settings)
```
DATABASE_URL=postgresql://user:pass@host/db?sslmode=require
GLOWMATCH_JWT_SECRET=6b01c542-20b6-4bc0-a3fd-a37c61d2e0ae
GLOWMATCH_ADMIN_EMAIL=admin@glowmatch.com
GLOWMATCH_ADMIN_PASSWORD=Adm1n!Glow2025#
GLOWMATCH_ADMIN_FULLNAME=GlowMatch Admin
GLOWMATCH_ADMIN_RESET_SECRET=admin-reset-secret-12345
VITE_FRONTEND_URL=https://glowimatch.vercel.app
```

### Frontend (Vite)
```
VITE_BACKEND_URL=https://backend-three-sigma-81.vercel.app/api
```

---

## Debugging Commands

### View Vercel Logs
```bash
vercel logs --follow
```

### Redeploy Backend
```bash
git add .
git commit -m "Deploy update"
git push origin main
```

### Check if Environment Variables Loaded
Backend will log on startup:
```
[db] ✅ Neon PostgreSQL client initialized successfully
[db] Created/verified users table
[db] Created admin account: admin@glowmatch.com
```

---

## Common Error Messages & Solutions

| Error | Cause | Solution |
|-------|-------|----------|
| `DATABASE_URL not set` | Env var missing | Add to Vercel Settings |
| `Invalid credentials` | Admin not created | Run reset-admin endpoint |
| `User already exists` | Email taken | Use different email |
| `503 Service Unavailable` | DB initializing | Wait 30 seconds & retry |
| `401 Unauthorized` | Invalid token | Check JWT_SECRET matches |

---

## Deployment Steps (Full)

1. **Set Environment Variables** in Vercel
   ```
   DATABASE_URL, GLOWMATCH_ADMIN_EMAIL, GLOWMATCH_ADMIN_PASSWORD, GLOWMATCH_JWT_SECRET
   ```

2. **Redeploy Backend**
   ```bash
   vercel --prod
   ```

3. **Wait for Initialization** (30-60 seconds first time)

4. **Test Health Endpoint**
   ```bash
   curl https://your-backend.vercel.app/api
   ```

5. **Test Login**
   ```bash
   curl -X POST https://your-backend.vercel.app/api/auth/login \
     -H "Content-Type: application/json" \
     -d '{"email":"admin@glowmatch.com","password":"Adm1n!Glow2025#"}'
   ```

6. **Deploy Frontend** (if needed)
   ```bash
   npm run build && vercel --prod
   ```

7. **Test Full App** in browser

---

## Still Having Issues?

1. Check browser console for error details
2. Check Vercel logs: `vercel logs`
3. Verify DATABASE_URL is PostgreSQL URL (not SQLite)
4. Verify all required env vars are set
5. Wait 2-3 minutes after setting env vars before testing
6. Try hard refresh: `Ctrl+Shift+R` (Windows/Linux) or `Cmd+Shift+R` (Mac)

---

**Last Updated:** December 2, 2025
**Backend:** Vercel Serverless Functions
**Database:** Neon PostgreSQL
**Frontend:** React + Vite
