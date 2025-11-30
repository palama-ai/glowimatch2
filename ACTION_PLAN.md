# Action Plan - Frontend and Backend Integration

## 🎯 Goal: Connect Frontend and Backend on Vercel

**Frontend URL**: https://glowmatch-ebon.vercel.app/
**Backend URL**: https://backend-three-sigma-81.vercel.app/api

---

## 🚨 Critical Issues Found

### Issue 1: Backend Environment Variables Missing ❌
**Severity**: CRITICAL - Backend won't start

**Current State**:
- `backend/vercel.json` references Secrets that don't exist
- Missing on Vercel:
  - `glowmatch_jwt_secret`
  - `glowmatch_admin_email`
  - `glowmatch_admin_password`

**Fix Required**: Create these 3 Secrets on Vercel Backend Project

---

### Issue 2: Frontend Backend URL Misconfigured ⚠️
**Severity**: HIGH - Frontend can't connect

**Current State**:
- `.env` has localhost: `VITE_BACKEND_URL=http://localhost:4000/api`
- `vercel.json` has production: `VITE_BACKEND_URL=https://backend-three-sigma-81.vercel.app/api`
- Conflict causes wrong URL to be used

**Fix Required**: Ensure Production URL is used in both places

---

## 📋 Action Steps (In Order)

### Step 1: Create Backend Secrets on Vercel ⏱️ 5 minutes

1. Open: https://vercel.com/dashboard
2. Select **Backend Project** (backend-three-sigma-81 or your backend project)
3. Click **Settings**
4. Click **Environment Variables**
5. Add these 3 secrets:

```
Name: glowmatch_jwt_secret
Value: 6b01c542-20b6-4bc0-a3fd-a37c61d2e0ae

Name: glowmatch_admin_email
Value: admin@glowmatch.com

Name: glowmatch_admin_password
Value: Adm1n!Glow2025#
```

6. Click **Save**
7. Wait for confirmation
8. Go back to Deployments
9. Click **Redeploy** (next to latest deployment)
10. Wait for "Verifying..." to complete

---

### Step 2: Verify Frontend Environment ⏱️ 2 minutes

1. Open: https://vercel.com/dashboard
2. Select **Frontend Project** (glowmatch-ebon or your frontend project)
3. Click **Settings**
4. Click **Environment Variables**
5. Verify `VITE_BACKEND_URL` is set to:
   ```
   https://backend-three-sigma-81.vercel.app/api
   ```
6. If missing or wrong, update it
7. Click **Redeploy**

---

### Step 3: Test Backend Health ⏱️ 2 minutes

1. Open new browser tab
2. Go to: https://backend-three-sigma-81.vercel.app/
3. Should see: `{ "ok": true, "msg": "GlowMatch backend running" }`
4. If you see error, check Vercel Backend logs

---

### Step 4: Test Frontend Loading ⏱️ 2 minutes

1. Open: https://glowmatch-ebon.vercel.app/
2. Should load without errors
3. Should see login page
4. Open DevTools (F12) → Console
5. Should NOT see errors

---

### Step 5: Test Login ⏱️ 5 minutes

1. Still on https://glowmatch-ebon.vercel.app/
2. Enter credentials:
   - Email: `admin@glowmatch.com`
   - Password: `Adm1n!Glow2025#`
3. Click Login
4. **IMPORTANT**: Open DevTools (F12) → Network tab BEFORE clicking
5. Look for network requests to backend-three-sigma-81.vercel.app
6. Check status codes:
   - ✅ 200 = Success
   - ❌ 401 = Wrong credentials
   - ❌ 404 = Backend URL wrong
   - ❌ 500 = Backend error

---

## 🔍 Verification Checklist

After each step, verify:

```
[ ] Step 1: Backend Secrets created and deployed
[ ] Step 2: Frontend Backend URL set correctly
[ ] Step 3: Backend responds at root endpoint
[ ] Step 4: Frontend loads without console errors
[ ] Step 5: Login request reaches backend successfully
[ ] Step 6: Login succeeds and redirects to dashboard
```

---

## 🆘 If Something Goes Wrong

### Backend won't start (Error 500)
1. Check Environment Variables are saved
2. Click Redeploy
3. Check Vercel Function logs

### Login shows "Network error"
1. Check backend URL in vercel.json
2. Backend project may not be deployed yet
3. Wait 2-3 minutes and try again

### Login shows "Login failed"
1. Double-check email/password (admin@glowmatch.com / Adm1n!Glow2025#)
2. Check Network tab for actual error
3. Verify JWT_SECRET is correct

### CORS Error in Console
1. Backend should have `app.use(cors())` enabled
2. Check backend/index.js has cors import and usage
3. Redeploy backend if changed

---

## 📞 How to Get Detailed Error Info

1. Open: https://glowmatch-ebon.vercel.app/
2. Press F12 (or Cmd+Opt+I on Mac)
3. Go to **Console** tab
4. Try login
5. Look for red error messages
6. Go to **Network** tab
7. Find the failed request (usually red)
8. Click on it
9. Click **Response** tab
10. Copy the error message

---

## ✅ Success Indicators

You know it's working when:

```
✅ Backend health check returns { ok: true, ... }
✅ Frontend loads without console errors
✅ Network request to auth/login completes
✅ Response status is 200 or 401 (not 5xx)
✅ Can log in and see dashboard
✅ Can navigate to profile page
✅ Can start a quiz
```

---

## 📝 Important Notes

1. **JWT Secret**: Must match exactly between backend/.env and Vercel Secrets
2. **Backend URL**: Must be exact URL with /api suffix in production
3. **Time**: Wait 1-2 minutes after Redeploy for changes to take effect
4. **Browser Cache**: Press Ctrl+Shift+R to hard refresh

---

**Last Updated**: 2025-11-27
**Priority**: 🔴 HIGH - Complete all steps now
