# حل سريع: مشكلة "Invalid Credentials" على Vercel

## المشكلة 🔴
```
POST https://backend-three-sigma-81.vercel.app/api/auth/login
401 Unauthorized - Invalid credentials
```

## السبب
حساب الـ admin لم يتم إنشاؤه في قاعدة البيانات على Vercel لأن `DATABASE_URL` لم يُعرّف بعد.

## الحل ✅

### الخطوة 1: إضافة متغيرات البيئة

1. اذهب إلى [Vercel Dashboard](https://vercel.com/dashboard)
2. اختر backend project: **backend-three-sigma-81**
3. اضغط **Settings** من الأعلى
4. اختر **Environment Variables** من اليسار
5. أضف المتغيرات التالية:

```
DATABASE_URL = postgresql://neondb_owner:npg_6CclbwkqnhA8@ep-wandering-credit-agkmzgtv-pooler.c-2.eu-central-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require

GLOWMATCH_JWT_SECRET = 6b01c542-20b6-4bc0-a3fd-a37c61d2e0ae

GLOWMATCH_ADMIN_EMAIL = admin@glowmatch.com

GLOWMATCH_ADMIN_PASSWORD = Adm1n!Glow2025#

GLOWMATCH_ADMIN_FULLNAME = GlowMatch Admin

GLOWMATCH_ADMIN_RESET_SECRET = admin-reset-secret-12345
```

### الخطوة 2: إعادة النشر

في صفحة التوزيع، اضغط **Redeploy** أو استخدم:

```bash
git push
```

### الخطوة 3: الانتظار والتحقق

1. انتظر 1-2 دقيقة حتى ينتهي التوزيع
2. اختبر الـ API:

```bash
# تحقق من حالة السيرفر
curl https://backend-three-sigma-81.vercel.app/api

# حاول تسجيل الدخول
curl -X POST https://backend-three-sigma-81.vercel.app/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@glowmatch.com",
    "password": "Adm1n!Glow2025#"
  }'
```

---

## اختبارات سريعة

### هل DATABASE_URL موجود؟
```bash
curl https://backend-three-sigma-81.vercel.app/api | jq .database_url_present
```

يجب أن يرجع: `true`

### هل البيانات جاهزة؟
```bash
curl https://backend-three-sigma-81.vercel.app/api | jq .db_ready
```

يجب أن يرجع: `true`

---

## المشاكل المحتملة الأخرى

### 409 Conflict على Signup
الحساب موجود بالفعل → استخدم email مختلف أو سجل دخول كـ admin

### 500 على endpoints أخرى
المشكلة في DB initialization → تحقق من logs:
```bash
vercel logs --follow
```

---

## المجلد الذي يجب مراجعته

- `VERCEL_SETUP.md` - إرشادات مفصلة
- `DEPLOYMENT_CHECKLIST.md` - قائمة تحقق كاملة
- `backend/.env` - متغيرات المطور المحلي

---

**تم التحديث:** 2 ديسمبر 2025
