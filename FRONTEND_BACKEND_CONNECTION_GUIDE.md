# دليل ربط Frontend و Backend على Vercel

## الحالة الحالية

**Backend URL**: https://backend-three-sigma-81.vercel.app/api
**Frontend URL**: https://glowmatch-ebon.vercel.app/

---

## المشاكل المكتشفة وحلولها

### 1. Backend - المتغيرات البيئية غير مكتملة ❌

**المشكلة**: `backend/vercel.json` يحتوي على:
```json
"env": {
  "GLOWMATCH_JWT_SECRET": "@glowmatch_jwt_secret",
  "GLOWMATCH_ADMIN_EMAIL": "@glowmatch_admin_email",
  "GLOWMATCH_ADMIN_PASSWORD": "@glowmatch_admin_password",
  "GLOWMATCH_DB_PATH": "/tmp/data.db",
  "NODE_ENV": "production"
}
```

لكن هذه الـ Secrets لم تُنشَأ على Vercel Dashboard.

**الحل**: على Vercel Backend Project، انقر:
1. **Settings** → **Environment Variables**
2. أضف الـ Secrets التالية:

| اسم Secret | القيمة |
|-----------|--------|
| `glowmatch_jwt_secret` | `6b01c542-20b6-4bc0-a3fd-a37c61d2e0ae` |
| `glowmatch_admin_email` | `admin@glowmatch.com` |
| `glowmatch_admin_password` | `Adm1n!Glow2025#` |

---

### 2. Frontend - URL المحلي بدل الإنتاجي ❌

**المشكلة**: ملف `.env` يحتوي على:
```
VITE_BACKEND_URL=http://localhost:4000/api
```

هذا يعمل محلياً فقط، لا يعمل في الإنتاج.

**الحل**: تم تحديث `vercel.json` ليحتوي على:
```json
"env": {
  "VITE_BACKEND_URL": "https://backend-three-sigma-81.vercel.app/api"
}
```

---

### 3. Frontend Build Output ✅

**الحالة**: تم التصحيح بنجاح
- `vite.config.mjs`: `outputDirectory: "build"` ✅
- `vercel.json`: `outputDirectory: "build"` ✅

---

### 4. CORS Configuration ✅

**الحالة**: تم التصحيح
- `backend/index.js` يستخدم `cors()` بدون تقييدات
- يقبل جميع الطلبات من جميع الـ Origins

---

## خطوات الإصلاح على Vercel

### خطوة 1: إنشاء Secrets على Backend Project

1. اذهب إلى: https://vercel.com/dashboard
2. اختر **Backend Project** (backend-three-sigma-81)
3. انقر **Settings**
4. اختر **Environment Variables**
5. أضف:
   - `glowmatch_jwt_secret` = `6b01c542-20b6-4bc0-a3fd-a37c61d2e0ae`
   - `glowmatch_admin_email` = `admin@glowmatch.com`
   - `glowmatch_admin_password` = `Adm1n!Glow2025#`
6. انقر **Save**
7. انقر **Redeploy** (أعلى الصفحة)

### خطوة 2: تأكد من Frontend Environment Variable

1. اذهب إلى **Frontend Project** (glowmatch-ebon)
2. انقر **Settings** → **Environment Variables**
3. تأكد من وجود:
   ```
   VITE_BACKEND_URL = https://backend-three-sigma-81.vercel.app/api
   ```
4. إذا لم توجد، أضفها
5. انقر **Redeploy**

### خطوة 3: اختبر الاتصال

1. افتح: https://glowmatch-ebon.vercel.app/
2. افتح DevTools (F12)
3. اذهب إلى **Network** tab
4. جرّب **Sign Up** أو **Login**
5. ابحث عن طلب `auth/login` أو `auth/signup`
6. تحقق من:
   - **Status**: يجب أن يكون `200` أو `401` (ليس `5xx`)
   - **Response**: يجب أن يكون JSON صحيح

---

## معلومات اعتبارات الاختبار

### حساب Admin للاختبار:
- **Email**: `admin@glowmatch.com`
- **Password**: `Adm1n!Glow2025#`

### API Endpoints الرئيسية:

| Method | Endpoint | الوصف |
|--------|----------|--------|
| POST | `/api/auth/signup` | إنشاء حساب جديد |
| POST | `/api/auth/login` | تسجيل الدخول |
| GET | `/api/auth/session` | التحقق من الجلسة الحالية |
| GET | `/api/profile/:userId` | الحصول على بيانات المستخدم |
| POST | `/api/quiz/attempts` | حفظ محاولة اختبار |
| POST | `/api/quiz/start` | بدء اختبار جديد |

---

## استكشاف الأخطاء

### خطأ: "Login failed"

**الأسباب المحتملة**:
1. Backend URL خاطئ
2. JWT_SECRET غير متطابقة
3. Database غير موجودة

**الحل**:
- افتح DevTools → Console
- ابحث عن أخطاء CORS أو Network
- تأكد من Secrets على Vercel

### خطأ: CORS Error

**الحل**:
- تم تصحيح `backend/index.js` ليستقبل جميع Origins
- إذا لم يعمل، تأكد من `app.use(cors())`

### Database Not Found

**السبب**: `/tmp/data.db` قد لا يكون يستمر بين النشرات

**الحل**:
- استخدم قاعدة بيانات خارجية (Supabase أو MongoDB)
- أو استخدم Vercel KV

---

## ملخص الملفات المحدثة

✅ `backend/package.json` - UUID إلى 9.0.0
✅ `backend/vercel.json` - بيئة صحيحة
✅ `vercel.json` (Frontend) - URL صحيح
✅ `.env` (Frontend) - محدث (localhost للتطوير)

---

## التالي

بعد إكمال الخطوات أعلاه:
1. اختبر تسجيل الدخول
2. اختبر إنشاء حساب
3. اختبر أخذ اختبار
4. اختبر الملف الشخصي

إذا حدثت أي مشاكل، شارك الخطأ من DevTools Console! 🔍
