# Flutter App Prompt — GlowMatch Mobile

Use this prompt to brief a Flutter developer, an AI code generator, or to create a GitHub issue for building the GlowMatch mobile app.

---

Project summary
- Build a Flutter mobile app that mirrors the GlowMatch web experience: interactive skin quiz (one question per screen), autosave (local + server), referral sharing, image upload for analysis, and results/dashboard. Preserve the web app look-and-feel (colors, typography, radius, animations).

Target tech
- Flutter 3.7+ (stable) with Dart 3
- State: Riverpod or Provider (Riverpod recommended) for scalable state management
- Networking: Dio or http + Retrofit generator (optional) / or plain http
- Local storage: Hive or Sembast for structured storage; SharedPreferences/Flutter Secure Storage for tokens
- File uploads: use multipart via Dio or presigned URL flow
- Image picker: image_picker or file_picker
- CI: GitHub Actions for builds or Codemagic/Bitrise for mobile builds

Design tokens (exact colors)
- background: #FEFEFE
- foreground / text: #1A1A1A
- border / divider: #E5E7EB
- input background: #F8F9FA
- accent / primary action: #FF69B4
- secondary: #FFC0CB
- primary text (black): #000000
- destructive: #EF4444
- success: #10B981
- warning: #F59E0B
- muted text: #6B7280
- font: Inter (use Google Fonts `Inter` or system fallback)
- radius: 12px (default card radius)

Core screens & navigation
- Splash / session check (resolve token -> route to Auth or Home)
- Auth stack: Login, Signup
- Main: Bottom or Drawer optional, recommended Stack for flow
  - Home / Landing
  - Quiz flow (Stack): QuizIntro -> QuestionScreen (single question per screen) -> QuizComplete -> ImageUploadAnalysis
  - ResultsDashboard (list of attempts) -> AttemptDetails
  - Profile (referral link & share) / Notifications

Widget mapping (web -> Flutter)
- `Header` -> `AppBar` (custom with user avatar and back button)
- `QuestionCard` -> `Card` with content: question text, options list, image grid, or slider
- `ProgressIndicator` -> `LinearProgressIndicator` + step counter
- `Button` -> `ElevatedButton` / `OutlinedButton` with consistent theming
- `QuizIntro` & `QuizComplete` -> full-screen `Scaffold` with centered content

UX & behavior
- One question per screen with `PageRoute` transitions (custom fade-up). Use `PageRouteBuilder` with 300ms fade+translate transition.
- Save each answer to local store immediately. Autosave to server every 30s or when user navigates between questions or completes quiz.
- If offline, queue autosaves and sync when back online; show a small offline badge or toast.
- Use native share sheet for referral links (`share_plus`).
- Use Haptic feedback for answer selection and successful upload.

API contract (same as web backend)
- POST /api/auth/login { email, password } -> { data: { user, token } }
- POST /api/auth/signup { email, password, fullName, referralCode? }
- GET /api/auth/session (Bearer token) -> session data
- POST /api/quiz/start (Bearer token) -> start attempt
- POST /api/quiz/saveAttempt (Bearer token) { userId, quizData, results } -> { data: { id } }
- POST /api/quiz/autosave (Bearer token) and GET /api/quiz/autosave
- GET /api/referrals/me -> { data: { referral_code, link } }
- POST /api/referrals/create (Bearer token)
- POST /api/analysis (Bearer token) { quizData, images[], model } -> { data: { analysis } }
- Image upload: either direct multipart POST to backend or presigned URL flow (backend returns upload URL)

Acceptance criteria / QA checklist
- Auth: login/signup work; token stored securely and sent on requests.
- Quiz: answers save locally, autosave runs every 30s and on navigation; on complete, attempt saved server-side and attemptId returned.
- Retry & offline: answers queue when offline and sync on reconnection.
- Image uploads: camera/gallery selection, progress UI, successful analysis result retrieval.
- Referral: user can copy and share link; creating referral if missing.
- Accessibility: tap targets >= 44px, label text for screen readers.

Assets to provide
- App icon (svg + png variants), logo mark, color tokens JSON, sample images for image-selection questions (use provided URLs or optimized images), Inter font or fallback.

Deliverables
- Flutter project (Git repo) with working flows, README with run steps, Postman collection or example requests for API endpoints, test instructions, and build artifacts (APK/IPA or Expo build links).

Extras (optional)
- Deep linking for `/?ref=<code>` to prefill referral upon install/open.
- Push notifications for 'analysis ready'.
- Analytics integration: Firebase Analytics or Segment.

---

End of prompt.
