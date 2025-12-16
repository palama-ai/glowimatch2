# GlowMatch Mobile (Flutter) — Starter Notes

This folder contains specs to start a Flutter implementation of the GlowMatch mobile app.

Quick setup (for a Flutter dev)

1. Install Flutter SDK (stable) and confirm setup:

```powershell
flutter --version
flutter doctor
```

2. Create a new Flutter project (recommended structure):

```powershell
flutter create --org com.yourorg glowmatch_mobile
cd glowmatch_mobile
```

3. Recommended dependencies (examples in `pubspec.yaml`):

- flutter_riverpod (state mgmt)
- dio (network)
- flutter_secure_storage (secure token storage)
- shared_preferences or hive (local autosave)
- image_picker (camera/gallery)
- share_plus (share referral link)
- connectivity_plus (network status)

4. Theme & design
- Use `mobile/lib/theme.dart` (starter theme file included) to centralize the colors and text styles.

5. Run on device/emulator

```powershell
flutter run -d chrome   # for web quick preview
flutter run -d emulator-5554  # or device id
```

6. Build artifacts

```powershell
flutter build apk --release
flutter build ios --release   # on macOS with Xcode
```

Notes
- Follow the `mobile/FLUTTER_APP_PROMPT.md` for full spec, API contract, and QA checklist.
- Prioritize the quiz flow and autosave/restore; these are core to UX.
