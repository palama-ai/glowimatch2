import 'package:flutter/material.dart';

class GlowMatchTheme {
  // Colors (from web tokens)
  static const Color background = Color(0xFFFEFEFE);
  static const Color foreground = Color(0xFF1A1A1A);
  static const Color border = Color(0xFFE5E7EB);
  static const Color inputBg = Color(0xFFF8F9FA);
  static const Color accent = Color(0xFFFF69B4);
  static const Color secondary = Color(0xFFFFC0CB);
  static const Color destructive = Color(0xFFEF4444);
  static const Color success = Color(0xFF10B981);
  static const Color warning = Color(0xFFF59E0B);
  static const Color muted = Color(0xFF6B7280);

  static ThemeData lightTheme() {
    return ThemeData(
      brightness: Brightness.light,
      scaffoldBackgroundColor: background,
      primaryColor: foreground,
      colorScheme: ColorScheme.fromSwatch().copyWith(
        primary: accent,
        secondary: secondary,
        background: background,
        error: destructive,
        onPrimary: Colors.white,
      ),
      appBarTheme: AppBarTheme(
        backgroundColor: background,
        elevation: 0,
        iconTheme: IconThemeData(color: foreground),
        titleTextStyle: TextStyle(color: foreground, fontSize: 18, fontWeight: FontWeight.w600),
      ),
      textTheme: TextTheme(
        bodyText1: TextStyle(color: foreground, fontSize: 16),
        bodyText2: TextStyle(color: muted, fontSize: 14),
        headline6: TextStyle(color: foreground, fontSize: 20, fontWeight: FontWeight.w600),
      ),
      cardTheme: CardTheme(
        color: Colors.white,
        elevation: 2,
        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
      ),
      elevatedButtonTheme: ElevatedButtonThemeData(
        style: ElevatedButton.styleFrom(
          backgroundColor: accent,
          foregroundColor: Colors.white,
          shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(10)),
        ),
      ),
      outlinedButtonTheme: OutlinedButtonThemeData(
        style: OutlinedButton.styleFrom(
          foregroundColor: foreground,
          side: BorderSide(color: border),
          shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(10)),
        ),
      ),
      inputDecorationTheme: InputDecorationTheme(
        filled: true,
        fillColor: inputBg,
        border: OutlineInputBorder(borderRadius: BorderRadius.circular(10), borderSide: BorderSide(color: border)),
      ),
    );
  }
}
