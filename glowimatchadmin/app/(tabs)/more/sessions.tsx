import { useQuery } from '@tanstack/react-query';
import React from 'react';
import {
    FlatList,
    RefreshControl,
    StyleSheet,
    Text,
    View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Monitor, User } from 'lucide-react-native';

import Card from '@/components/Card';
import ErrorView from '@/components/ErrorView';
import Loading from '@/components/Loading';
import Colors from '@/constants/colors';
import { SESSION_REFRESH_INTERVAL } from '@/constants/config';
import { api } from '@/services/api';
import { Session } from '@/types';

export default function SessionsScreen() {
    const sessionsQuery = useQuery<Session[]>({
        queryKey: ['admin', 'sessions'],
        queryFn: async () => {
            const response = await api.get('/admin/debug/sessions');
            // Backend returns { data: sessions[] }
            return response.data.data || [];
        },
        refetchInterval: SESSION_REFRESH_INTERVAL,
    });

    const renderSession = ({ item }: { item: Session }) => (
        <Card style={styles.sessionCard}>
            <View style={styles.sessionHeader}>
                <User size={20} color={Colors.dark.primary} />
                <View style={styles.sessionInfo}>
                    <Text style={styles.sessionName}>{item.userName}</Text>
                    <Text style={styles.sessionEmail}>{item.userEmail}</Text>
                </View>
                <View style={styles.liveBadge}>
                    <View style={styles.liveDot} />
                    <Text style={styles.liveText}>Live</Text>
                </View>
            </View>

            <View style={styles.sessionDetails}>
                <View style={styles.sessionRow}>
                    <Monitor size={16} color={Colors.dark.textSecondary} />
                    <Text style={styles.sessionDevice}>{item.device}</Text>
                </View>
                <Text style={styles.sessionPage}>{item.currentPage}</Text>
                <Text style={styles.sessionTime}>
                    Last activity: {new Date(item.lastActivity).toLocaleString()}
                </Text>
            </View>
        </Card>
    );

    if (sessionsQuery.isLoading) {
        return <Loading text="Loading sessions..." />;
    }

    if (sessionsQuery.error) {
        return (
            <ErrorView
                message="Failed to load sessions"
                onRetry={() => sessionsQuery.refetch()}
            />
        );
    }

    const sessions = sessionsQuery.data || [];

    return (
        <SafeAreaView style={styles.container} edges={['bottom']}>
            <View style={styles.header}>
                <Text style={styles.title}>Live Sessions</Text>
                <View style={styles.countBadge}>
                    <Text style={styles.countText}>{sessions.length} active</Text>
                </View>
            </View>

            <FlatList
                data={sessions}
                renderItem={renderSession}
                keyExtractor={(item) => item.id}
                contentContainerStyle={styles.list}
                refreshControl={
                    <RefreshControl
                        refreshing={false}
                        onRefresh={() => sessionsQuery.refetch()}
                        tintColor={Colors.dark.primary}
                    />
                }
                ListEmptyComponent={
                    <View style={styles.emptyContainer}>
                        <Monitor size={48} color={Colors.dark.textMuted} />
                        <Text style={styles.emptyText}>No active sessions</Text>
                    </View>
                }
            />

            <View style={styles.footer}>
                <Text style={styles.footerText}>
                    Auto-refreshing every {SESSION_REFRESH_INTERVAL / 1000}s
                </Text>
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.dark.background,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: 16,
        paddingBottom: 8,
    },
    title: {
        fontSize: 24,
        fontWeight: '700' as const,
        color: Colors.dark.text,
    },
    countBadge: {
        backgroundColor: Colors.dark.success,
        borderRadius: 12,
        paddingHorizontal: 12,
        paddingVertical: 6,
    },
    countText: {
        fontSize: 12,
        fontWeight: '600' as const,
        color: Colors.dark.text,
    },
    list: {
        padding: 16,
        gap: 12,
    },
    sessionCard: {
        gap: 12,
    },
    sessionHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
    },
    sessionInfo: {
        flex: 1,
    },
    sessionName: {
        fontSize: 16,
        fontWeight: '600' as const,
        color: Colors.dark.text,
    },
    sessionEmail: {
        fontSize: 14,
        color: Colors.dark.textSecondary,
    },
    liveBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
        backgroundColor: Colors.dark.success + '20',
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 6,
    },
    liveDot: {
        width: 6,
        height: 6,
        borderRadius: 3,
        backgroundColor: Colors.dark.success,
    },
    liveText: {
        fontSize: 12,
        fontWeight: '600' as const,
        color: Colors.dark.success,
    },
    sessionDetails: {
        gap: 6,
        paddingLeft: 32,
    },
    sessionRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    sessionDevice: {
        fontSize: 14,
        color: Colors.dark.textSecondary,
    },
    sessionPage: {
        fontSize: 14,
        fontWeight: '500' as const,
        color: Colors.dark.text,
    },
    sessionTime: {
        fontSize: 12,
        color: Colors.dark.textMuted,
    },
    emptyContainer: {
        padding: 60,
        alignItems: 'center',
        gap: 16,
    },
    emptyText: {
        fontSize: 16,
        color: Colors.dark.textMuted,
    },
    footer: {
        padding: 16,
        alignItems: 'center',
    },
    footerText: {
        fontSize: 12,
        color: Colors.dark.textMuted,
        fontStyle: 'italic' as const,
    },
});
