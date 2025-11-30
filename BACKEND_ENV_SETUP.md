# 🔐 Backend Environment Setup

## ✅ ملفات الـ Environment

تم إنشاء ملفات الـ Environment التالية:

### 1️⃣ `backend/.env` (الملف الفعلي - محلي فقط)
- ✅ يحتوي على البيانات الفعلية
- ❌ **لا يُرفع على GitHub** (موجود في `.gitignore`)
- 🔒 آمن وخاص

### 2️⃣ `backend/.env.example` (قالب للمراجعة)
- ✅ يرفع على GitHub
- ✅ يُظهر الهيكل فقط
- ✅ بدون بيانات حساسة

---

## 🔑 البيانات المحفوظة

```env
GLOWMATCH_JWT_SECRET=6b01c542-20b6-4bc0-a3fd-a37c61d2e0ae
GLOWMATCH_ADMIN_EMAIL=admin@glowmatch.com
GLOWMATCH_ADMIN_PASSWORD=Adm1n!Glow2025#
GLOWMATCH_DB_PATH=./data.db
PORT=4000
```

---

## ✅ الخطوات التالية

### 1. اختبار محلياً:
```bash
cd backend
npm install
npm run dev
```

يجب أن ترى:
```
[backend] Server running on port 4000
[backend/db] Created admin account: admin@glowmatch.com
```

### 2. دفع إلى GitHub:
```bash
git add .env.example backend/vercel.json backend/.gitignore
git commit -m "Setup backend environment configuration"
git push origin main
```

### 3. في Vercel Dashboard:

أضف Environment Variables **الإنتاج**:

```
GLOWMATCH_JWT_SECRET = 6b01c542-20b6-4bc0-a3fd-a37c61d2e0ae
GLOWMATCH_ADMIN_EMAIL = admin@glowmatch.com
GLOWMATCH_ADMIN_PASSWORD = Adm1n!Glow2025#
GLOWMATCH_DB_PATH = /tmp/data.db
```

---

## 🔐 أمان البيانات

| المكان | الملف | الأمان | الاستخدام |
|-------|------|--------|----------|
| محلي | `.env` | ✅ آمن | التطوير |
| GitHub | `.env.example` | ✅ عام | المرجع |
| Vercel | Environment Vars | ✅ آمن جداً | الإنتاج |

---

## ⚠️ تحذير أمني

- ❌ **لا تضع** `.env` الفعلي على GitHub
- ✅ **ضع فقط** `.env.example`
- ✅ **استخدم** Vercel Environment Variables للإنتاج
- 🔒 **احفظ** البيانات السرية آمنة

---

## 📝 ملاحظات إضافية

### تغيير الـ JWT Secret مستقبلاً:
1. عدّل `backend/.env` محلياً
2. أضف في Vercel Environment Variables
3. اختبر وأعد النشر (Redeploy)

### استخدام متغيرات مختلفة للبيئات:
```env
# للتطوير
NODE_ENV=development
PORT=4000

# للإنتاج (في Vercel)
NODE_ENV=production
PORT=auto
```

---

**تم إعداد الـ Environment بنجاح!** ✨

للخطوة التالية: اختبر Backend محلياً ثم رفعه على Vercel
