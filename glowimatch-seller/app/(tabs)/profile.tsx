import { Stack } from 'expo-router';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
  Platform,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { User, Mail, LogOut } from 'lucide-react-native';

import { useAuth } from '@/contexts/AuthContext';
import Colors from '@/constants/colors';

export default function ProfileScreen() {
  const { user, logout } = useAuth();

  const handleLogout = () => {
    if (Platform.OS === 'web') {
      if (confirm('Are you sure you want to logout?')) {
        logout();
      }
    } else {
      Alert.alert('Logout', 'Are you sure you want to logout?', [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Logout', style: 'destructive', onPress: logout },
      ]);
    }
  };

  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <View style={styles.container}>
        <LinearGradient
          colors={[Colors.gradientStart, Colors.gradientEnd]}
          style={styles.header}
        >
          <View style={styles.avatarContainer}>
            <View style={styles.avatar}>
              <User color={Colors.textLight} size={48} />
            </View>
          </View>
          <Text style={styles.title}>{user?.fullName}</Text>
          <Text style={styles.subtitle}>{user?.email}</Text>
        </LinearGradient>

        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Account Information</Text>

            <View style={styles.infoCard}>
              <View style={styles.infoRow}>
                <View style={styles.infoIcon}>
                  <Mail color={Colors.primary} size={20} />
                </View>
                <View style={styles.infoContent}>
                  <Text style={styles.infoLabel}>Email</Text>
                  <Text style={styles.infoValue}>{user?.email}</Text>
                </View>
              </View>

              <View style={styles.divider} />

              <View style={styles.infoRow}>
                <View style={styles.infoIcon}>
                  <User color={Colors.primary} size={20} />
                </View>
                <View style={styles.infoContent}>
                  <Text style={styles.infoLabel}>Full Name</Text>
                  <Text style={styles.infoValue}>{user?.fullName}</Text>
                </View>
              </View>
            </View>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Account Status</Text>
            <View style={styles.statusCard}>
              <View style={styles.statusRow}>
                <Text style={styles.statusLabel}>Account Status</Text>
                <View
                  style={[
                    styles.statusBadge,
                    {
                      backgroundColor:
                        user?.accountStatus === 'ACTIVE'
                          ? Colors.success
                          : user?.accountStatus === 'LOCKED'
                            ? Colors.warning
                            : Colors.error,
                    },
                  ]}
                >
                  <Text style={styles.statusBadgeText}>{user?.accountStatus}</Text>
                </View>
              </View>
              <View style={styles.statusRow}>
                <Text style={styles.statusLabel}>Email Verified</Text>
                <Text style={styles.statusValue}>
                  {user?.emailVerified ? 'Yes' : 'No'}
                </Text>
              </View>
              <View style={styles.statusRow}>
                <Text style={styles.statusLabel}>Terms Accepted</Text>
                <Text style={styles.statusValue}>
                  {user?.termsAccepted ? 'Yes' : 'No'}
                </Text>
              </View>
            </View>
          </View>

          <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
            <LogOut color={Colors.error} size={20} />
            <Text style={styles.logoutButtonText}>Logout</Text>
          </TouchableOpacity>
        </ScrollView>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  header: {
    paddingTop: 60,
    paddingBottom: 32,
    paddingHorizontal: 24,
    alignItems: 'center',
  },
  avatarContainer: {
    marginBottom: 16,
  },
  avatar: {
    width: 96,
    height: 96,
    borderRadius: 48,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 3,
    borderColor: Colors.textLight,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold' as const,
    color: Colors.textLight,
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    color: Colors.textLight,
    opacity: 0.9,
  },
  content: {
    flex: 1,
    padding: 24,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold' as const,
    color: Colors.text,
    marginBottom: 12,
  },
  infoCard: {
    backgroundColor: Colors.cardBg,
    borderRadius: 16,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
  },
  infoIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  infoContent: {
    flex: 1,
  },
  infoLabel: {
    fontSize: 12,
    color: Colors.textSecondary,
    marginBottom: 4,
  },
  infoValue: {
    fontSize: 16,
    color: Colors.text,
    fontWeight: '500' as const,
  },
  input: {
    fontSize: 16,
    color: Colors.text,
    fontWeight: '500' as const,
    padding: 0,
  },
  editButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
  },
  divider: {
    height: 1,
    backgroundColor: Colors.border,
    marginVertical: 8,
  },
  statusCard: {
    backgroundColor: Colors.cardBg,
    borderRadius: 16,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  statusRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
  },
  statusLabel: {
    fontSize: 14,
    color: Colors.text,
    fontWeight: '500' as const,
  },
  statusValue: {
    fontSize: 14,
    color: Colors.textSecondary,
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusBadgeText: {
    fontSize: 12,
    fontWeight: '600' as const,
    color: Colors.textLight,
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: 'rgba(244, 67, 54, 0.1)',
    borderRadius: 12,
    padding: 16,
    marginTop: 16,
    marginBottom: 32,
  },
  logoutButtonText: {
    fontSize: 16,
    fontWeight: '600' as const,
    color: Colors.error,
  },
});
