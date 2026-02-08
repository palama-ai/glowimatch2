import { useRouter } from 'expo-router';
import React from 'react';
import {
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  Bell,
  ChevronRight,
  LogOut,
  Mail,
  Monitor,
  ShieldAlert,
} from 'lucide-react-native';

import Card from '@/components/Card';
import { useAuth } from '@/contexts/AuthContext';
import Colors from '@/constants/colors';

interface MenuItemProps {
  icon: React.ReactNode;
  label: string;
  onPress: () => void;
  badge?: number;
}

function MenuItem({ icon, label, onPress, badge }: MenuItemProps) {
  return (
    <TouchableOpacity style={styles.menuItem} onPress={onPress}>
      <View style={styles.menuItemLeft}>
        {icon}
        <Text style={styles.menuItemLabel}>{label}</Text>
      </View>
      <View style={styles.menuItemRight}>
        {badge !== undefined && badge > 0 && (
          <View style={styles.badge}>
            <Text style={styles.badgeText}>{badge}</Text>
          </View>
        )}
        <ChevronRight size={20} color={Colors.dark.textMuted} />
      </View>
    </TouchableOpacity>
  );
}

export default function MoreScreen() {
  const router = useRouter();
  const { logout, user } = useAuth();

  const handleLogout = () => {
    Alert.alert('Logout', 'Are you sure you want to logout?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Logout',
        style: 'destructive',
        onPress: () => logout(),
      },
    ]);
  };

  return (
    <SafeAreaView style={styles.container} edges={['bottom']}>
      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <Text style={styles.title}>More</Text>
          <Text style={styles.subtitle}>
            Signed in as {user?.email || 'Admin'}
          </Text>
        </View>

        <Card style={styles.section}>
          <Text style={styles.sectionTitle}>Management</Text>
          <MenuItem
            icon={<Mail size={24} color={Colors.dark.primary} />}
            label="Messages"
            onPress={() => router.push('/more/messages' as any)}
          />
          <View style={styles.divider} />
          <MenuItem
            icon={<Bell size={24} color={Colors.dark.info} />}
            label="Notifications"
            onPress={() => router.push('/more/notifications' as any)}
          />
          <View style={styles.divider} />
          <MenuItem
            icon={<Monitor size={24} color={Colors.dark.success} />}
            label="Sessions"
            onPress={() => router.push('/more/sessions' as any)}
          />
          <View style={styles.divider} />
          <MenuItem
            icon={<ShieldAlert size={24} color={Colors.dark.warning} />}
            label="Safety"
            onPress={() => router.push('/more/safety' as any)}
          />
        </Card>

        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <LogOut size={20} color={Colors.dark.error} />
          <Text style={styles.logoutText}>Logout</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.dark.background,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
    gap: 16,
  },
  header: {
    marginBottom: 8,
  },
  title: {
    fontSize: 28,
    fontWeight: '700' as const,
    color: Colors.dark.text,
  },
  subtitle: {
    fontSize: 14,
    color: Colors.dark.textSecondary,
    marginTop: 4,
  },
  section: {
    padding: 0,
    overflow: 'hidden',
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '600' as const,
    color: Colors.dark.textMuted,
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 12,
    textTransform: 'uppercase',
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  menuItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  menuItemLabel: {
    fontSize: 16,
    color: Colors.dark.text,
  },
  menuItemRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  badge: {
    backgroundColor: Colors.dark.error,
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 6,
  },
  badgeText: {
    fontSize: 12,
    fontWeight: '700' as const,
    color: Colors.dark.text,
  },
  divider: {
    height: 1,
    backgroundColor: Colors.dark.border,
    marginHorizontal: 16,
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: Colors.dark.surface,
    borderRadius: 12,
    paddingVertical: 16,
    borderWidth: 1,
    borderColor: Colors.dark.error,
  },
  logoutText: {
    fontSize: 16,
    fontWeight: '600' as const,
    color: Colors.dark.error,
  },
});
