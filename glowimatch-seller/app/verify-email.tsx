import { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Mail, RefreshCw } from 'lucide-react-native';

import { useAuth } from '@/contexts/AuthContext';
import Colors from '@/constants/colors';

export default function VerifyEmailScreen() {
  const [code, setCode] = useState<string>('');
  const { verifyEmail, resendVerification, isVerifyLoading, isResendLoading, pendingEmail, logout } = useAuth();

  const handleVerify = () => {
    if (!code || code.length !== 6) {
      alert('Please enter the 6-digit verification code');
      return;
    }
    verifyEmail({ email: pendingEmail, code });
  };

  const handleResend = () => {
    if (pendingEmail) {
      resendVerification(pendingEmail);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <LinearGradient
        colors={[Colors.gradientStart, Colors.gradientEnd]}
        style={styles.gradient}
      >
        <ScrollView contentContainerStyle={styles.scrollContent}>
          <View style={styles.header}>
            <View style={styles.iconContainer}>
              <Mail color={Colors.textLight} size={48} />
            </View>
            <Text style={styles.title}>Verify Your Email</Text>
            <Text style={styles.subtitle}>
              We&apos;ve sent a verification code to
            </Text>
            <Text style={styles.email}>{pendingEmail || 'your email'}</Text>
          </View>

          <View style={styles.formContainer}>
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Verification Code</Text>
              <TextInput
                style={styles.input}
                placeholder="Enter 6-digit code"
                placeholderTextColor={Colors.textSecondary}
                value={code}
                onChangeText={setCode}
                keyboardType="number-pad"
                maxLength={6}
                autoComplete="one-time-code"
              />
            </View>

            <TouchableOpacity
              style={[styles.button, isVerifyLoading && styles.buttonDisabled]}
              onPress={handleVerify}
              disabled={isVerifyLoading}
            >
              {isVerifyLoading ? (
                <ActivityIndicator color={Colors.textLight} />
              ) : (
                <Text style={styles.buttonText}>Verify Email</Text>
              )}
            </TouchableOpacity>

            <View style={styles.resendContainer}>
              <Text style={styles.resendText}>Didn&apos;t receive the code?</Text>
              <TouchableOpacity
                style={styles.resendButton}
                onPress={handleResend}
                disabled={isResendLoading}
              >
                {isResendLoading ? (
                  <ActivityIndicator size="small" color={Colors.primary} />
                ) : (
                  <>
                    <RefreshCw color={Colors.primary} size={16} />
                    <Text style={styles.resendButtonText}>Resend Code</Text>
                  </>
                )}
              </TouchableOpacity>
            </View>

            <TouchableOpacity style={styles.logoutButton} onPress={logout}>
              <Text style={styles.logoutText}>Use a different email</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </LinearGradient>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  gradient: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: 24,
  },
  header: {
    alignItems: 'center',
    marginBottom: 48,
  },
  iconContainer: {
    width: 96,
    height: 96,
    borderRadius: 48,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold' as const,
    color: Colors.textLight,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: Colors.textLight,
    opacity: 0.9,
  },
  email: {
    fontSize: 16,
    fontWeight: '600' as const,
    color: Colors.textLight,
    marginTop: 4,
  },
  formContainer: {
    backgroundColor: Colors.background,
    borderRadius: 24,
    padding: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 5,
  },
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    fontWeight: '600' as const,
    color: Colors.text,
    marginBottom: 8,
  },
  input: {
    backgroundColor: Colors.surface,
    borderRadius: 12,
    padding: 16,
    fontSize: 24,
    color: Colors.text,
    borderWidth: 1,
    borderColor: Colors.border,
    textAlign: 'center',
    letterSpacing: 8,
  },
  button: {
    backgroundColor: Colors.primary,
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    marginTop: 8,
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: 'bold' as const,
    color: Colors.textLight,
  },
  resendContainer: {
    alignItems: 'center',
    marginTop: 24,
  },
  resendText: {
    fontSize: 14,
    color: Colors.textSecondary,
    marginBottom: 8,
  },
  resendButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  resendButtonText: {
    fontSize: 14,
    fontWeight: '600' as const,
    color: Colors.primary,
  },
  logoutButton: {
    alignItems: 'center',
    marginTop: 24,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
  },
  logoutText: {
    fontSize: 14,
    color: Colors.textSecondary,
  },
});
