# 🔐 Environment Secrets Documentation

## GitHub Secrets (للـ CI/CD)

أضف هذه الـ Secrets في GitHub Repository Settings → Secrets and Variables → Actions:

### Backend
| Secret Name | Description | Example |
|-------------|-------------|---------|
| `GLOWMATCH_JWT_SECRET` | مفتاح JWT السري | `your-super-secret-key-min-32-chars` |
| `DATABASE_URL` | رابط قاعدة بيانات PostgreSQL | `postgresql://user:pass@host:5432/db` |
| `OPENAI_API_KEY` | مفتاح OpenAI API | `sk-...` |
| `GEMINI_API_KEY` | مفتاح Google Gemini | `AIza...` |
| `GOOGLE_VISION_API_KEY` | مفتاح Google Vision | `AIza...` |
| `GLOWMATCH_ADMIN_EMAIL` | إيميل الأدمن | `admin@example.com` |
| `GLOWMATCH_ADMIN_PASSWORD` | كلمة مرور الأدمن | `SecurePassword123!` |

### Frontend  
| Secret Name | Description | Example |
|-------------|-------------|---------|
| `VITE_BACKEND_URL` | رابط الـ Backend API | `https://backend-three-sigma-81.vercel.app/api` |

---

## Vercel Environment Variables

في Vercel Dashboard → Project Settings → Environment Variables:

1. انسخ كل الـ Secrets أعلاه
2. اختر Environment: `Production`

---

## ملف .env المحلي

```env
# Backend (.env in backend folder)
GLOWMATCH_JWT_SECRET=your-secret-key-here
DATABASE_URL=postgresql://...
OPENAI_API_KEY=sk-...
GEMINI_API_KEY=AIza...
NODE_ENV=development

# Frontend (.env in frontend folder)
VITE_BACKEND_URL=http://localhost:4000/api
```

> ⚠️ **تحذير**: لا تضف ملف `.env` إلى Git! تأكد أنه مضاف في `.gitignore`
