import { useQuery } from '@tanstack/react-query';
import React, { useState } from 'react';
import {
    Alert,
    FlatList,
    RefreshControl,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
    AlertTriangle,
    Ban,
    Database,
    Shield,
    ShieldAlert,
    Unlock,
} from 'lucide-react-native';

import Badge from '@/components/Badge';
import Card from '@/components/Card';
import ErrorView from '@/components/ErrorView';
import Loading from '@/components/Loading';
import Colors from '@/constants/colors';
import { api } from '@/services/api';
import { Appeal, BlacklistItem, ProblemSeller } from '@/types';

type SafetyTab = 'appeals' | 'problemSellers' | 'blacklist' | 'database';

export default function SafetyScreen() {
    const [activeTab, setActiveTab] = useState<SafetyTab>('appeals');

    const appealsQuery = useQuery<Appeal[]>({
        queryKey: ['admin', 'safety', 'appeals'],
        queryFn: async () => {
            const response = await api.get('/admin/safety/appeals');
            // Backend returns { data: appeals[] }
            return response.data.data || [];
        },
        enabled: activeTab === 'appeals',
    });

    const problemSellersQuery = useQuery<ProblemSeller[]>({
        queryKey: ['admin', 'safety', 'problem-sellers'],
        queryFn: async () => {
            const response = await api.get('/admin/safety/problem-sellers');
            // Backend returns { data: problemSellers[] }
            return response.data.data || [];
        },
        enabled: activeTab === 'problemSellers',
    });

    const blacklistQuery = useQuery<BlacklistItem[]>({
        queryKey: ['admin', 'safety', 'blacklist'],
        queryFn: async () => {
            const response = await api.get('/admin/safety/blacklist');
            // Backend returns { data: blacklist[] }
            return response.data.data || [];
        },
        enabled: activeTab === 'blacklist',
    });

    const handleRunSeed = () => {
        Alert.alert(
            'Run Database Seed',
            'This will populate the database with sample data. Continue?',
            [
                { text: 'Cancel', style: 'cancel' },
                {
                    text: 'Run Seed',
                    style: 'destructive',
                    onPress: async () => {
                        try {
                            await api.post('/admin/database/seed');
                            Alert.alert('Success', 'Database seeded successfully');
                        } catch (error: any) {
                            Alert.alert('Error', error.response?.data?.message || 'Failed to seed database');
                        }
                    },
                },
            ]
        );
    };

    const renderAppeal = ({ item }: { item: Appeal }) => (
        <Card style={styles.itemCard}>
            <View style={styles.itemHeader}>
                <Shield size={20} color={Colors.dark.warning} />
                <Text style={styles.itemName}>{item.userName}</Text>
                <Badge
                    label={item.status}
                    variant={
                        item.status === 'approved'
                            ? 'success'
                            : item.status === 'rejected'
                                ? 'error'
                                : 'warning'
                    }
                />
            </View>
            <Text style={styles.itemReason}>{item.reason}</Text>
            <Text style={styles.itemDate}>
                {new Date(item.createdAt).toLocaleDateString()}
            </Text>
        </Card>
    );

    const renderProblemSeller = ({ item }: { item: ProblemSeller }) => (
        <Card style={styles.itemCard}>
            <View style={styles.itemHeader}>
                <AlertTriangle size={20} color={Colors.dark.error} />
                <Text style={styles.itemName}>{item.sellerName}</Text>
                {item.locked && <Badge label="Locked" variant="error" />}
            </View>
            <Text style={styles.itemReason}>{item.reason}</Text>
            <Text style={styles.itemDate}>
                {new Date(item.createdAt).toLocaleDateString()}
            </Text>
            {item.locked && (
                <TouchableOpacity style={styles.unlockButton}>
                    <Unlock size={16} color={Colors.dark.text} />
                    <Text style={styles.unlockButtonText}>Unlock Seller</Text>
                </TouchableOpacity>
            )}
        </Card>
    );

    const renderBlacklistItem = ({ item }: { item: BlacklistItem }) => (
        <Card style={styles.itemCard}>
            <View style={styles.itemHeader}>
                <Ban size={20} color={Colors.dark.error} />
                <Badge label={item.type} variant="error" />
            </View>
            <Text style={styles.blacklistValue}>{item.value}</Text>
            <Text style={styles.itemReason}>{item.reason}</Text>
            <Text style={styles.itemDate}>
                {new Date(item.createdAt).toLocaleDateString()}
            </Text>
        </Card>
    );

    const renderContent = () => {
        if (activeTab === 'database') {
            return (
                <View style={styles.databaseTab}>
                    <Card style={styles.databaseCard}>
                        <Database size={48} color={Colors.dark.primary} />
                        <Text style={styles.databaseTitle}>Database Management</Text>
                        <Text style={styles.databaseText}>
                            View statistics and run database operations
                        </Text>

                        <View style={styles.statsContainer}>
                            <View style={styles.statItem}>
                                <Text style={styles.statValue}>--</Text>
                                <Text style={styles.statLabel}>Total Records</Text>
                            </View>
                            <View style={styles.statItem}>
                                <Text style={styles.statValue}>--</Text>
                                <Text style={styles.statLabel}>Tables</Text>
                            </View>
                        </View>

                        <TouchableOpacity style={styles.seedButton} onPress={handleRunSeed}>
                            <Text style={styles.seedButtonText}>Run Database Seed</Text>
                        </TouchableOpacity>
                    </Card>
                </View>
            );
        }

        if (activeTab === 'appeals') {
            if (appealsQuery.isLoading) {
                return <Loading text="Loading appeals..." />;
            }
            if (appealsQuery.error) {
                return (
                    <ErrorView
                        message="Failed to load appeals"
                        onRetry={() => appealsQuery.refetch()}
                    />
                );
            }
            const appeals = appealsQuery.data || [];
            return (
                <FlatList
                    data={appeals}
                    renderItem={renderAppeal}
                    keyExtractor={(item) => item.id}
                    contentContainerStyle={styles.list}
                    refreshControl={
                        <RefreshControl
                            refreshing={false}
                            onRefresh={() => appealsQuery.refetch()}
                            tintColor={Colors.dark.primary}
                        />
                    }
                    ListEmptyComponent={
                        <View style={styles.emptyContainer}>
                            <ShieldAlert size={48} color={Colors.dark.textMuted} />
                            <Text style={styles.emptyText}>No appeals found</Text>
                        </View>
                    }
                />
            );
        }

        if (activeTab === 'problemSellers') {
            if (problemSellersQuery.isLoading) {
                return <Loading text="Loading problem sellers..." />;
            }
            if (problemSellersQuery.error) {
                return (
                    <ErrorView
                        message="Failed to load problem sellers"
                        onRetry={() => problemSellersQuery.refetch()}
                    />
                );
            }
            const problemSellers = problemSellersQuery.data || [];
            return (
                <FlatList
                    data={problemSellers}
                    renderItem={renderProblemSeller}
                    keyExtractor={(item) => item.id}
                    contentContainerStyle={styles.list}
                    refreshControl={
                        <RefreshControl
                            refreshing={false}
                            onRefresh={() => problemSellersQuery.refetch()}
                            tintColor={Colors.dark.primary}
                        />
                    }
                    ListEmptyComponent={
                        <View style={styles.emptyContainer}>
                            <ShieldAlert size={48} color={Colors.dark.textMuted} />
                            <Text style={styles.emptyText}>No problem sellers found</Text>
                        </View>
                    }
                />
            );
        }

        if (blacklistQuery.isLoading) {
            return <Loading text="Loading blacklist..." />;
        }
        if (blacklistQuery.error) {
            return (
                <ErrorView
                    message="Failed to load blacklist"
                    onRetry={() => blacklistQuery.refetch()}
                />
            );
        }
        const blacklist = blacklistQuery.data || [];
        return (
            <FlatList
                data={blacklist}
                renderItem={renderBlacklistItem}
                keyExtractor={(item) => item.id}
                contentContainerStyle={styles.list}
                refreshControl={
                    <RefreshControl
                        refreshing={false}
                        onRefresh={() => blacklistQuery.refetch()}
                        tintColor={Colors.dark.primary}
                    />
                }
                ListEmptyComponent={
                    <View style={styles.emptyContainer}>
                        <ShieldAlert size={48} color={Colors.dark.textMuted} />
                        <Text style={styles.emptyText}>No blacklist items found</Text>
                    </View>
                }
            />
        );
    };

    return (
        <SafeAreaView style={styles.container} edges={['bottom']}>
            <View style={styles.header}>
                <View style={styles.tabsContainer}>
                    <TouchableOpacity
                        style={[styles.tab, activeTab === 'appeals' && styles.tabActive]}
                        onPress={() => setActiveTab('appeals')}
                    >
                        <Text style={[styles.tabText, activeTab === 'appeals' && styles.tabTextActive]}>
                            Appeals
                        </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={[styles.tab, activeTab === 'problemSellers' && styles.tabActive]}
                        onPress={() => setActiveTab('problemSellers')}
                    >
                        <Text
                            style={[styles.tabText, activeTab === 'problemSellers' && styles.tabTextActive]}
                        >
                            Sellers
                        </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={[styles.tab, activeTab === 'blacklist' && styles.tabActive]}
                        onPress={() => setActiveTab('blacklist')}
                    >
                        <Text style={[styles.tabText, activeTab === 'blacklist' && styles.tabTextActive]}>
                            Blacklist
                        </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={[styles.tab, activeTab === 'database' && styles.tabActive]}
                        onPress={() => setActiveTab('database')}
                    >
                        <Text style={[styles.tabText, activeTab === 'database' && styles.tabTextActive]}>
                            Database
                        </Text>
                    </TouchableOpacity>
                </View>
            </View>

            {renderContent()}
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.dark.background,
    },
    header: {
        padding: 16,
    },
    tabsContainer: {
        flexDirection: 'row',
        backgroundColor: Colors.dark.surface,
        borderRadius: 12,
        padding: 4,
    },
    tab: {
        flex: 1,
        paddingVertical: 10,
        alignItems: 'center',
        borderRadius: 8,
    },
    tabActive: {
        backgroundColor: Colors.dark.primary,
    },
    tabText: {
        fontSize: 13,
        fontWeight: '600' as const,
        color: Colors.dark.textSecondary,
    },
    tabTextActive: {
        color: Colors.dark.text,
    },
    list: {
        padding: 16,
        gap: 12,
    },
    itemCard: {
        gap: 8,
    },
    itemHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    itemName: {
        flex: 1,
        fontSize: 16,
        fontWeight: '600' as const,
        color: Colors.dark.text,
    },
    itemReason: {
        fontSize: 14,
        color: Colors.dark.textSecondary,
        lineHeight: 20,
    },
    itemDate: {
        fontSize: 12,
        color: Colors.dark.textMuted,
    },
    unlockButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
        backgroundColor: Colors.dark.success,
        borderRadius: 8,
        paddingVertical: 8,
        marginTop: 4,
    },
    unlockButtonText: {
        fontSize: 14,
        fontWeight: '600' as const,
        color: Colors.dark.text,
    },
    blacklistValue: {
        fontSize: 15,
        fontWeight: '600' as const,
        color: Colors.dark.text,
        fontFamily: 'monospace' as const,
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
    databaseTab: {
        flex: 1,
        padding: 16,
    },
    databaseCard: {
        alignItems: 'center',
        paddingVertical: 40,
        gap: 16,
    },
    databaseTitle: {
        fontSize: 20,
        fontWeight: '700' as const,
        color: Colors.dark.text,
    },
    databaseText: {
        fontSize: 14,
        color: Colors.dark.textSecondary,
        textAlign: 'center',
    },
    statsContainer: {
        flexDirection: 'row',
        gap: 24,
        marginTop: 8,
    },
    statItem: {
        alignItems: 'center',
    },
    statValue: {
        fontSize: 24,
        fontWeight: '700' as const,
        color: Colors.dark.primary,
    },
    statLabel: {
        fontSize: 12,
        color: Colors.dark.textSecondary,
        marginTop: 4,
    },
    seedButton: {
        backgroundColor: Colors.dark.warning,
        borderRadius: 8,
        paddingVertical: 12,
        paddingHorizontal: 24,
        marginTop: 16,
    },
    seedButtonText: {
        fontSize: 16,
        fontWeight: '600' as const,
        color: Colors.dark.text,
    },
});
