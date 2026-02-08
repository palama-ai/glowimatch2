import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Stack } from 'expo-router';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  RefreshControl,
  Alert,
  Platform,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { AlertTriangle, ShieldAlert, MessageSquare } from 'lucide-react-native';

import { api, handleApiError } from '@/lib/api';
import Colors from '@/constants/colors';
import { Violation, ApiResponse } from '@/types';
import { useAuth } from '@/contexts/AuthContext';

export default function ViolationsScreen() {
  const { user } = useAuth();
  const [appealViolationId, setAppealViolationId] = useState<string>('');
  const [appealReason, setAppealReason] = useState<string>('');
  const [submittedAppeals, setSubmittedAppeals] = useState<string[]>([]); // Track submitted appeals locally
  const queryClient = useQueryClient();

  const violationsQuery = useQuery<Violation[]>({
    queryKey: ['violations'],
    queryFn: async () => {
      const response = await api.get<ApiResponse<Violation[]>>('/seller/violations');
      return response.data.data || [];
    },
  });

  const submitAppealMutation = useMutation({
    mutationFn: async (data: { violationId: string; reason: string }) => {
      const response = await api.post<ApiResponse<{ success: boolean }>>('/seller/appeals', data);
      return response.data.data!;
    },
    onSuccess: (_data, variables) => {
      // Track this appeal as submitted locally
      setSubmittedAppeals(prev => [...prev, variables.violationId]);
      setAppealViolationId('');
      setAppealReason('');
      if (Platform.OS === 'web') {
        alert('Appeal submitted successfully');
      } else {
        Alert.alert('Success', 'Appeal submitted successfully');
      }
    },
    onError: (error: unknown) => {
      const message = handleApiError(error);
      if (Platform.OS === 'web') {
        alert(message);
      } else {
        Alert.alert('Error', message);
      }
    },
  });

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'LOW':
        return '#4CAF50';
      case 'MEDIUM':
        return '#FF9800';
      case 'HIGH':
        return '#FF5722';
      case 'CRITICAL':
        return '#F44336';
      default:
        return Colors.textSecondary;
    }
  };

  const handleSubmitAppeal = () => {
    if (!appealReason.trim()) {
      alert('Please provide a reason for your appeal');
      return;
    }
    submitAppealMutation.mutate({
      violationId: appealViolationId,
      reason: appealReason.trim(),
    });
  };

  const isAccountLocked = user?.accountStatus === 'LOCKED';
  const isAccountBanned = user?.accountStatus === 'BANNED';

  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <View style={styles.container}>
        <LinearGradient
          colors={[Colors.gradientStart, Colors.gradientEnd]}
          style={styles.header}
        >
          <Text style={styles.title}>Violations & Appeals</Text>
          <Text style={styles.subtitle}>
            Account Status: {user?.accountStatus}
          </Text>
        </LinearGradient>

        <ScrollView
          style={styles.content}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={violationsQuery.isRefetching}
              onRefresh={() => {
                violationsQuery.refetch();
              }}
              tintColor={Colors.primary}
            />
          }
        >
          {isAccountBanned && (
            <View style={styles.alertCard}>
              <ShieldAlert color={Colors.error} size={24} />
              <View style={styles.alertContent}>
                <Text style={styles.alertTitle}>Account Banned</Text>
                <Text style={styles.alertText}>
                  Your account has been permanently banned due to severe violations.
                  Contact support for more information.
                </Text>
              </View>
            </View>
          )}

          {isAccountLocked && (
            <View style={styles.alertCard}>
              <AlertTriangle color={Colors.warning} size={24} />
              <View style={styles.alertContent}>
                <Text style={styles.alertTitle}>Account Locked</Text>
                <Text style={styles.alertText}>
                  Your account is temporarily locked. You can submit appeals for your
                  violations.
                </Text>
              </View>
            </View>
          )}

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Violation History</Text>
            {violationsQuery.isLoading ? (
              <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color={Colors.primary} />
              </View>
            ) : violationsQuery.data && violationsQuery.data.length > 0 ? (
              violationsQuery.data.map((violation) => {
                const hasAppeal = submittedAppeals.includes(violation.id);
                return (
                  <View key={violation.id} style={styles.violationCard}>
                    <View style={styles.violationHeader}>
                      <View
                        style={[
                          styles.severityBadge,
                          { backgroundColor: getSeverityColor(violation.severity) },
                        ]}
                      >
                        <Text style={styles.severityText}>{violation.severity}</Text>
                      </View>
                      <Text style={styles.violationDate}>
                        {new Date(violation.createdAt).toLocaleDateString()}
                      </Text>
                    </View>
                    <Text style={styles.violationReason}>{violation.reason}</Text>
                    <Text style={styles.violationPenalty}>
                      Penalty: {violation.penaltyApplied}
                    </Text>

                    {hasAppeal ? (
                      <View style={styles.appealStatus}>
                        <MessageSquare color={Colors.textSecondary} size={16} />
                        <Text style={styles.appealStatusText}>
                          Appeal Submitted - Under Review
                        </Text>
                      </View>
                    ) : (
                      <TouchableOpacity
                        style={styles.appealButton}
                        onPress={() => setAppealViolationId(violation.id)}
                      >
                        <Text style={styles.appealButtonText}>Submit Appeal</Text>
                      </TouchableOpacity>
                    )}
                  </View>
                );
              })
            ) : (
              <View style={styles.emptyState}>
                <AlertTriangle color={Colors.textSecondary} size={48} />
                <Text style={styles.emptyTitle}>No Violations</Text>
                <Text style={styles.emptyText}>
                  Your account has no violations. Keep it up!
                </Text>
              </View>
            )}
          </View>

          {appealViolationId && (
            <View style={styles.appealForm}>
              <Text style={styles.appealFormTitle}>Submit Appeal</Text>
              <TextInput
                style={styles.appealInput}
                placeholder="Explain why you believe this violation is incorrect..."
                placeholderTextColor={Colors.textSecondary}
                value={appealReason}
                onChangeText={setAppealReason}
                multiline
                numberOfLines={4}
              />
              <View style={styles.appealActions}>
                <TouchableOpacity
                  style={styles.cancelButton}
                  onPress={() => {
                    setAppealViolationId('');
                    setAppealReason('');
                  }}
                >
                  <Text style={styles.cancelButtonText}>Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[
                    styles.submitAppealButton,
                    submitAppealMutation.isPending && styles.buttonDisabled,
                  ]}
                  onPress={handleSubmitAppeal}
                  disabled={submitAppealMutation.isPending}
                >
                  {submitAppealMutation.isPending ? (
                    <ActivityIndicator color={Colors.textLight} size="small" />
                  ) : (
                    <Text style={styles.submitAppealButtonText}>Submit</Text>
                  )}
                </TouchableOpacity>
              </View>
            </View>
          )}
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
    paddingBottom: 24,
    paddingHorizontal: 24,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold' as const,
    color: Colors.textLight,
  },
  subtitle: {
    fontSize: 14,
    color: Colors.textLight,
    opacity: 0.9,
    marginTop: 4,
  },
  content: {
    flex: 1,
    padding: 24,
  },
  alertCard: {
    flexDirection: 'row',
    backgroundColor: Colors.cardBg,
    borderRadius: 16,
    padding: 16,
    marginBottom: 24,
    borderLeftWidth: 4,
    borderLeftColor: Colors.error,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  alertContent: {
    flex: 1,
    marginLeft: 12,
  },
  alertTitle: {
    fontSize: 16,
    fontWeight: 'bold' as const,
    color: Colors.text,
    marginBottom: 4,
  },
  alertText: {
    fontSize: 14,
    color: Colors.textSecondary,
    lineHeight: 20,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold' as const,
    color: Colors.text,
    marginBottom: 16,
  },
  loadingContainer: {
    paddingVertical: 48,
    alignItems: 'center',
  },
  violationCard: {
    backgroundColor: Colors.cardBg,
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  violationHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  severityBadge: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  severityText: {
    fontSize: 12,
    fontWeight: '600' as const,
    color: Colors.textLight,
  },
  violationDate: {
    fontSize: 12,
    color: Colors.textSecondary,
  },
  violationReason: {
    fontSize: 16,
    color: Colors.text,
    marginBottom: 8,
    lineHeight: 22,
  },
  violationPenalty: {
    fontSize: 14,
    color: Colors.textSecondary,
    marginBottom: 12,
  },
  appealStatus: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
  },
  appealStatusText: {
    fontSize: 14,
    color: Colors.textSecondary,
  },
  appealButton: {
    backgroundColor: Colors.primary,
    borderRadius: 8,
    padding: 12,
    alignItems: 'center',
    marginTop: 8,
  },
  appealButtonText: {
    fontSize: 14,
    fontWeight: '600' as const,
    color: Colors.textLight,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 64,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: 'bold' as const,
    color: Colors.text,
    marginTop: 16,
    marginBottom: 8,
  },
  emptyText: {
    fontSize: 14,
    color: Colors.textSecondary,
    textAlign: 'center',
  },
  appealForm: {
    backgroundColor: Colors.cardBg,
    borderRadius: 16,
    padding: 16,
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  appealFormTitle: {
    fontSize: 18,
    fontWeight: 'bold' as const,
    color: Colors.text,
    marginBottom: 12,
  },
  appealInput: {
    backgroundColor: Colors.surface,
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    color: Colors.text,
    borderWidth: 1,
    borderColor: Colors.border,
    height: 100,
    textAlignVertical: 'top',
    marginBottom: 16,
  },
  appealActions: {
    flexDirection: 'row',
    gap: 12,
  },
  cancelButton: {
    flex: 1,
    backgroundColor: Colors.surface,
    borderRadius: 12,
    padding: 12,
    alignItems: 'center',
  },
  cancelButtonText: {
    fontSize: 14,
    fontWeight: '600' as const,
    color: Colors.textSecondary,
  },
  submitAppealButton: {
    flex: 1,
    backgroundColor: Colors.primary,
    borderRadius: 12,
    padding: 12,
    alignItems: 'center',
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  submitAppealButtonText: {
    fontSize: 14,
    fontWeight: '600' as const,
    color: Colors.textLight,
  },
});
