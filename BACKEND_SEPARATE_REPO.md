# 🚀 نقل Backend إلى Repository منفصل على GitHub

## الخطوات:

### 1️⃣ أنشئ Repository جديد على GitHub

1. اذهب إلى: https://github.com/new
2. **Repository name**: `glowmatch-backend`
3. **Description**: `GlowMatch Backend API - Express.js + SQLite`
4. اختر **Public**
5. ❌ **لا تحدد** "Initialize this repository"
6. اضغط **Create repository**

### 2️⃣ انسخ مجلد Backend كمجلد منفصل (اختياري)

```powershell
# انسخ مجلد backend إلى مكان منفصل
Copy-Item -Recurse "d:\disk part 1\aicha projects\MVP\skin care V2 beta\backend" "d:\backend-glowmatch"
```

### 3️⃣ هيئ Git في Backend

**الطريقة A:** من داخل المشروع الحالي

```powershell
cd "d:\disk part 1\aicha projects\MVP\skin care V2 beta\backend"

# تهيئة git جديد
& "C:\Program Files\Git\bin\git.exe" init

# إضافة جميع الملفات
& "C:\Program Files\Git\bin\git.exe" add .

# أول commit
& "C:\Program Files\Git\bin\git.exe" commit -m "Initial commit: GlowMatch Backend API"

# إضافة remote
& "C:\Program Files\Git\bin\git.exe" remote add origin https://github.com/YOUR_USERNAME/glowmatch-backend.git

# إعادة تسمية branch
& "C:\Program Files\Git\bin\git.exe" branch -M main

# دفع إلى GitHub
& "C:\Program Files\Git\bin\git.exe" push -u origin main
```

**الطريقة B:** من مجلد منفصل

```powershell
cd "d:\backend-glowmatch"

# نفس الخطوات أعلاه
& "C:\Program Files\Git\bin\git.exe" init
& "C:\Program Files\Git\bin\git.exe" add .
& "C:\Program Files\Git\bin\git.exe" commit -m "Initial commit: GlowMatch Backend API"
& "C:\Program Files\Git\bin\git.exe" remote add origin https://github.com/YOUR_USERNAME/glowmatch-backend.git
& "C:\Program Files\Git\bin\git.exe" branch -M main
& "C:\Program Files\Git\bin\git.exe" push -u origin main
```

---

## ⚠️ ملاحظة مهمة:

استبدل `YOUR_USERNAME` باسم المستخدم الفعلي على GitHub!

**مثال:**
```powershell
& "C:\Program Files\Git\bin\git.exe" remote add origin https://github.com/palama-ai/glowmatch-backend.git
```

---

## ✅ النتيجة:

بعد الانتهاء ستملك:

| Repository | المحتوى |
|-----------|---------|
| `glowmatch-skincare` | Frontend + صور + توثيق |
| `glowmatch-backend` | API + Backend كامل |

---

## 📝 تحديث Frontend للـ API الجديد

في `.env`:
```env
VITE_BACKEND_URL=https://glowmatch-backend.vercel.app/api
```

ثم دفع:
```powershell
cd "d:\disk part 1\aicha projects\MVP\skin care V2 beta"
& "C:\Program Files\Git\bin\git.exe" add .env
& "C:\Program Files\Git\bin\git.exe" commit -m "Update Backend API URL"
& "C:\Program Files\Git\bin\git.exe" push origin main
```

---

**جرّب وأخبرني إذا نجحت الخطوات!** 🎯
