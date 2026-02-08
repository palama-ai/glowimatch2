import { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  TextInput,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { FileCheck, Check, LogOut } from 'lucide-react-native';

import { useAuth } from '@/contexts/AuthContext';
import Colors from '@/constants/colors';

export default function AcceptTermsScreen() {
  const [accepted, setAccepted] = useState<boolean>(false);
  const [fullName, setFullName] = useState<string>('');
  const { acceptTerms, isAcceptTermsLoading, logout } = useAuth();

  const handleAccept = () => {
    if (!accepted) {
      alert('Please accept the terms to continue');
      return;
    }
    if (!fullName.trim()) {
      alert('Please enter your full name as signature');
      return;
    }
    acceptTerms({ signatureData: `Accepted by: ${fullName} on ${new Date().toISOString()}` });
  };

  return (
    <LinearGradient
      colors={[Colors.gradientStart, Colors.gradientEnd]}
      style={styles.container}
    >
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <View style={styles.iconContainer}>
            <FileCheck color={Colors.textLight} size={48} />
          </View>
          <Text style={styles.title}>Terms of Service</Text>
          <Text style={styles.subtitle}>Review and accept to continue</Text>
        </View>

        <View style={styles.contentContainer}>
          <View style={styles.termsSection}>
            <Text style={styles.sectionTitle}>Seller Terms & Conditions</Text>
            <Text style={styles.termsText}>
              As a Glowimatch seller, you agree to:{'\n\n'}
              • Provide accurate product information{'\n'}
              • Maintain product safety standards{'\n'}
              • Comply with ingredient disclosure requirements{'\n'}
              • Accept responsibility for listed products{'\n'}
              • Follow platform guidelines and policies{'\n\n'}
              Violations may result in warnings, account suspension, or permanent ban.
            </Text>
          </View>

          <View style={styles.signatureSection}>
            <Text style={styles.signatureLabel}>Your Full Name (as signature)</Text>
            <TextInput
              style={styles.nameInput}
              placeholder="Enter your full name"
              placeholderTextColor={Colors.textSecondary}
              value={fullName}
              onChangeText={setFullName}
              autoCapitalize="words"
            />
          </View>

          <TouchableOpacity
            style={styles.checkboxRow}
            onPress={() => setAccepted(!accepted)}
          >
            <View style={[styles.checkbox, accepted && styles.checkboxChecked]}>
              {accepted ? (
                <Check color={Colors.textLight} size={16} />
              ) : null}
            </View>
            <Text style={styles.checkboxLabel}>
              I have read and agree to the Terms of Service
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.button, (!accepted || !fullName.trim() || isAcceptTermsLoading) && styles.buttonDisabled]}
            onPress={handleAccept}
            disabled={!accepted || !fullName.trim() || isAcceptTermsLoading}
          >
            {isAcceptTermsLoading ? (
              <ActivityIndicator color={Colors.textLight} />
            ) : (
              <Text style={styles.buttonText}>Accept & Continue</Text>
            )}
          </TouchableOpacity>

          <TouchableOpacity style={styles.logoutButton} onPress={logout}>
            <LogOut color={Colors.textSecondary} size={16} />
            <Text style={styles.logoutText}>Use a different account</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    padding: 24,
    paddingTop: 60,
  },
  header: {
    alignItems: 'center',
    marginBottom: 32,
  },
  iconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold' as const,
    color: Colors.textLight,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    color: Colors.textLight,
    opacity: 0.9,
  },
  contentContainer: {
    backgroundColor: Colors.background,
    borderRadius: 24,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 5,
  },
  termsSection: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold' as const,
    color: Colors.text,
    marginBottom: 12,
  },
  termsText: {
    fontSize: 14,
    color: Colors.textSecondary,
    lineHeight: 22,
  },
  signatureSection: {
    marginBottom: 20,
  },
  signatureLabel: {
    fontSize: 14,
    fontWeight: '600' as const,
    color: Colors.text,
    marginBottom: 12,
  },
  nameInput: {
    backgroundColor: Colors.surface,
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    color: Colors.text,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  checkboxRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: Colors.border,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  checkboxChecked: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  checkboxLabel: {
    fontSize: 14,
    color: Colors.text,
    flex: 1,
  },
  button: {
    backgroundColor: Colors.primary,
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: 'bold' as const,
    color: Colors.textLight,
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    marginTop: 20,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
  },
  logoutText: {
    fontSize: 14,
    color: Colors.textSecondary,
  },
});
