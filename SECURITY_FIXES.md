# 🔐 ملف الإصلاحات الأمنية - Security Fixes Implementation Guide

## سريع جداً - 5 دقائق للإصلاح الفوري

### 1️⃣ إزالة كلمات المرور الافتراضية (من auth.js)

**قبل:**
```javascript
const adminPassword = process.env.GLOWMATCH_ADMIN_PASSWORD || 'Adm1n!Glow2025#';
```

**بعد:**
```javascript
const adminPassword = process.env.GLOWMATCH_ADMIN_PASSWORD;
if (!adminPassword) {
  throw new Error('[auth] CRITICAL: GLOWMATCH_ADMIN_PASSWORD environment variable is required for reset-admin endpoint');
}
```

---

### 2️⃣ حماية Debug Endpoints (من admin.js)

**قبل:**
```javascript
// Unprotected debug endpoints (dev only)
router.get('/debug/users', async (req, res) => {
```

**بعد:**
```javascript
// Debug endpoints - protected with requireAdmin
router.get('/debug/users', requireAdmin, async (req, res) => {
```

**نفس الشيء ل `/debug/stats`:**
```javascript
router.get('/debug/stats', requireAdmin, async (req, res) => {
```

---

### 3️⃣ تأمين reset-admin endpoint (من auth.js)

**أضف في نهاية auth.js:**
```javascript
// SECURITY: Remove or protect reset-admin in production
if (process.env.NODE_ENV === 'production' || !process.env.GLOWMATCH_ADMIN_RESET_SECRET) {
  // Override endpoint to 404 in production
  router.post('/reset-admin', (req, res) => {
    res.status(404).json({ error: 'Not found' });
  });
  console.warn('[auth] reset-admin endpoint is DISABLED in this environment');
}
```

---

### 4️⃣ إصلاح رسائل الخطأ (من auth.js)

البحث عن جميع:
```javascript
catch (err) {
  console.error(err);
  res.status(500).json({ error: 'Failed to...', details: err.message }); // ❌ خطر
}
```

استبدل بـ:
```javascript
catch (err) {
  console.error('[auth]', err.stack); // السجل فقط للـ admin
  res.status(500).json({ error: 'An error occurred. Please try again later.' }); // ✅ آمن
}
```

---

### 5️⃣ تقليل حد JSON Body Size (من index.js)

**قبل:**
```javascript
app.use(bodyParser({ limit: '12mb' })); // كبير جداً
```

**بعد:**
```javascript
app.use(bodyParser({ limit: '1mb' })); // آمن
```

---

## 20 دقيقة - إضافة Rate Limiting

### الخطوة 1: التثبيت
```bash
cd backend
npm install express-rate-limit
npm install helmet
```

### الخطوة 2: في index.js - أضف في الأعلى

```javascript
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
```

### الخطوة 3: أضف بعد CORS middleware مباشرة

```javascript
// Security: Rate limiting
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 دقيقة
  max: 5, // 5 محاولات فقط
  message: 'Too many login attempts. Please try again in 15 minutes.',
  standardHeaders: true,
  legacyHeaders: false,
});

const signupLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // ساعة واحدة
  max: 3, // 3 محاولات فقط
  message: 'Too many signup attempts. Please try again later.',
});

const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 دقيقة
  max: 100, // 100 request
  message: 'Too many requests from this IP. Please try again later.',
});

// Apply limiters
app.use('/api/', apiLimiter); // لجميع API requests
app.use('/api/auth/login', loginLimiter);
app.use('/api/auth/signup', signupLimiter);
```

### الخطوة 4: أضف Security Headers

```javascript
// Security: Helmet.js for security headers
app.use(helmet());

// Additional security configurations
app.use(helmet.contentSecurityPolicy({
  directives: {
    defaultSrc: ["'self'"],
    scriptSrc: ["'self'"],
    styleSrc: ["'self'", "'unsafe-inline'"],
    imgSrc: ["'self'", 'data:', 'https:'],
    connectSrc: ["'self'"],
  }
}));

app.use(helmet.nosniff());
app.use(helmet.xssFilter());
app.use(helmet.referrerPolicy({ policy: 'strict-origin-when-cross-origin' }));
```

---

## تحديث JWT Secret (15 دقيقة)

### في auth.js - استبدل السطر 8-9:

**قبل:**
```javascript
const JWT_SECRET = process.env.GLOWMATCH_JWT_SECRET || 'dev_secret_change_me';
const TOKEN_EXPIRY = '30d';
```

**بعد:**
```javascript
const JWT_SECRET = process.env.GLOWMATCH_JWT_SECRET;
if (!JWT_SECRET) {
  throw new Error('[auth] CRITICAL: GLOWMATCH_JWT_SECRET environment variable is required');
}

// Shorter expiry in production
const TOKEN_EXPIRY = process.env.NODE_ENV === 'production' ? '1h' : '7d';
```

---

## تحسين CORS (10 دقائق)

### في index.js - استبدل CORS config:

**قبل:**
```javascript
app.use(cors({
  origin: function (origin, callback) {
    if (!origin) return callback(null, true); // ❌ خطر
    
    if (allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('CORS not allowed'));
    }
  },
  credentials: true
}));
```

**بعد:**
```javascript
app.use(cors({
  origin: function (origin, callback) {
    // في الإنتاج: رفض requests بدون origin
    if (!origin) {
      if (process.env.NODE_ENV === 'production') {
        return callback(new Error('Origin is required'));
      }
      // في development: اسمح بـ local requests
      return callback(null, true);
    }
    
    if (allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('CORS not allowed'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  maxAge: 3600
}));
```

---

## إضافة Logging آمن (10 دقائق)

### أضف في index.js بعد middleware الـ request logger:

```javascript
// Security: Remove sensitive env vars logging
// BEFORE: console.log('[backend] OPENAI_API_KEY present:', !!process.env.OPENAI_API_KEY);
// AFTER: (فقط في development)

if (process.env.NODE_ENV === 'development') {
  console.log('[backend] API Keys status:');
  console.log('  - OPENAI_API_KEY:', !!process.env.OPENAI_API_KEY);
  console.log('  - GEMINI_API_KEY:', !!process.env.GEMINI_API_KEY);
  console.log('  - GOOGLE_VISION_API_KEY:', !!process.env.GOOGLE_VISION_API_KEY);
} else {
  console.log('[backend] Production mode - API keys configured');
}
```

---

## الخطوات التنفيذية الكاملة

### Phase 1: الإصلاحات الحرجة (5 دقائق) ✅ MUST DO
```bash
# 1. افتح backend/routes/auth.js
#    - السطر 228: أزل القيمة الافتراضية للـ password
#    - أضف check أن المتغير موجود

# 2. افتح backend/routes/admin.js
#    - السطر 9: أضف requireAdmin لـ /debug/users
#    - السطر 24: أضف requireAdmin لـ /debug/stats

# 3. افتح backend/index.js
#    - السطر 70: غيّر من '12mb' إلى '1mb'
#    - نهاية auth.js: أضف protection لـ reset-admin
```

### Phase 2: إضافة Rate Limiting و Security Headers (20 دقيقة)
```bash
npm install express-rate-limit helmet

# عدّل backend/index.js:
# - أضف require للـ libraries
# - أضف rate limiters
# - أضف helmet middleware
```

### Phase 3: تحسينات إضافية (15 دقيقة)
```bash
# عدّل backend/routes/auth.js:
# - تحديث JWT_SECRET handling
# - تحسين TOKEN_EXPIRY

# عدّل backend/index.js:
# - تحسين CORS
# - آمن logging
```

### Phase 4: الاختبار والنشر (10 دقائق)
```bash
# اختبر محلياً:
npm install
npm run dev

# تحقق من:
# - جميع endpoints تعمل
# - Rate limiting يعمل
# - Security headers موجودة

# ادفع للـ GitHub:
git add -A
git commit -m "security: Critical security fixes - remove hardcoded passwords, protect endpoints, add rate limiting"
git push origin main
```

---

## قائمة التحقق الأمنية قبل الإطلاق

- [ ] تم حذف كلمات المرور الافتراضية
- [ ] تم حماية Debug endpoints بـ requireAdmin
- [ ] تم تأمين reset-admin endpoint
- [ ] تم تثبيت Rate Limiting
- [ ] تم تثبيت Helmet.js
- [ ] تم تقليل حد JSON إلى 1MB
- [ ] تم تحسين رسائل الخطأ (لا تسرب معلومات)
- [ ] تم تحديث JWT secret handling
- [ ] تم تحسين CORS configuration
- [ ] تم إضافة Security headers
- [ ] تم اختبار جميع endpoints
- [ ] تم التحقق من logs (لا توجد معلومات حساسة)
- [ ] تم دفع التغييرات إلى GitHub
- [ ] تم التحقق من Vercel deployment

---

## توثيق environment variables المطلوبة

### في `.env` أو Vercel Settings:

```
# Database
DATABASE_URL=postgresql://user:password@db.host/dbname

# Authentication
GLOWMATCH_JWT_SECRET=your-super-secret-key-min-32-characters-long

# Admin Account (FOR SETUP ONLY - تذكر حذف بعد الاستخدام)
GLOWMATCH_ADMIN_EMAIL=admin@glowmatch.com
GLOWMATCH_ADMIN_PASSWORD=your-super-strong-password-here
GLOWMATCH_ADMIN_FULLNAME=GlowMatch Admin
GLOWMATCH_ADMIN_RESET_SECRET=your-admin-reset-secret-key

# Frontend
FRONTEND_URL=https://glowimatch.vercel.app

# AI Services
OPENAI_API_KEY=sk-...
GEMINI_API_KEY=...
GOOGLE_VISION_API_KEY=...

# Environment
NODE_ENV=production
PORT=3000
```

---

**الوقت المجموع للإصلاح:** 60 دقيقة  
**الأولوية:** 🔴 حرجة - لا تطلق بدونها

---

آخر تحديث: 5 ديسمبر 2025
