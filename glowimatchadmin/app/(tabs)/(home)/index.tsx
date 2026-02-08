import { useQuery } from '@tanstack/react-query';
import React, { useState } from 'react';
import {
    Animated,
    Dimensions,
    RefreshControl,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LineChart } from 'react-native-chart-kit';
import { Activity, BarChart3, ShieldCheck, Users } from 'lucide-react-native';

import Card from '@/components/Card';
import ErrorView from '@/components/ErrorView';
import Loading from '@/components/Loading';
import Colors from '@/constants/colors';
import { api } from '@/services/api';
import { SignupBlockSettings, Stats } from '@/types';

const { width } = Dimensions.get('window');

// Backend analytics response format
interface AnalyticsResponse {
    labels: string[];
    newUsersSeries: number[];
    activeSeries: number[];
    convSeries: number[];
    attemptsSeries: number[];
    liveUsers: number;
    totals: {
        totalActive: number;
        totalConv: number;
        totalNewUsers: number;
        totalAttempts: number;
    };
}

// Backend stats response format
interface StatsResponse {
    total: number;
    active: number;
    disabled: number;
    subscribed: number;
}

export default function DashboardScreen() {
    const [refreshing, setRefreshing] = useState(false);
    const pulseAnim = React.useRef(new Animated.Value(1)).current;

    const statsQuery = useQuery<Stats>({
        queryKey: ['admin', 'stats'],
        queryFn: async () => {
            const response = await api.get('/admin/stats');
            // Backend returns { data: { total, active, disabled, subscribed } }
            const data: StatsResponse = response.data.data;
            return {
                totalUsers: data.total,
                activeUsers: data.active,
                disabledUsers: data.disabled,
                subscribedUsers: data.subscribed,
                liveUsers: 0, // Will be updated from analytics
            };
        },
    });

    const analyticsQuery = useQuery<AnalyticsResponse>({
        queryKey: ['admin', 'analytics'],
        queryFn: async () => {
            const response = await api.get('/admin/analytics?range=7');
            // Backend returns { data: { labels, newUsersSeries, liveUsers, ... } }
            return response.data.data;
        },
    });

    const settingsQuery = useQuery<SignupBlockSettings>({
        queryKey: ['admin', 'settings', 'signup-block'],
        queryFn: async () => {
            const response = await api.get('/admin/settings/signup-block');
            // Backend returns { data: { blockUserSignup, blockSellerSignup } }
            return response.data.data;
        },
    });

    React.useEffect(() => {
        Animated.loop(
            Animated.sequence([
                Animated.timing(pulseAnim, {
                    toValue: 1.2,
                    duration: 1000,
                    useNativeDriver: true,
                }),
                Animated.timing(pulseAnim, {
                    toValue: 1,
                    duration: 1000,
                    useNativeDriver: true,
                }),
            ])
        ).start();
    }, [pulseAnim]);

    const onRefresh = async () => {
        setRefreshing(true);
        await Promise.all([
            statsQuery.refetch(),
            analyticsQuery.refetch(),
            settingsQuery.refetch(),
        ]);
        setRefreshing(false);
    };

    const toggleSignupBlock = async (type: 'user' | 'seller') => {
        try {
            const newValue = type === 'user'
                ? !settingsQuery.data?.blockUserSignup
                : !settingsQuery.data?.blockSellerSignup;

            await api.post('/admin/settings/signup-block', {
                [type === 'user' ? 'blockUserSignup' : 'blockSellerSignup']: newValue,
            });

            settingsQuery.refetch();
        } catch (error) {
            console.error('Failed to toggle signup block:', error);
        }
    };

    if (statsQuery.isLoading || analyticsQuery.isLoading) {
        return <Loading text="Loading dashboard..." />;
    }

    if (statsQuery.error || analyticsQuery.error) {
        return (
            <ErrorView
                message="Failed to load dashboard"
                onRetry={() => {
                    statsQuery.refetch();
                    analyticsQuery.refetch();
                }}
            />
        );
    }

    const stats = statsQuery.data!;
    const analyticsData = analyticsQuery.data;
    const liveUsers = analyticsData?.liveUsers ?? 0;

    // Prepare chart data from backend response
    const hasChartData = analyticsData?.labels && analyticsData.labels.length > 0;
    const chartData = hasChartData ? {
        labels: analyticsData.labels.map((label: string) => {
            // Labels are already in YYYY-MM-DD format
            const parts = label.split('-');
            return `${parts[1]}/${parts[2]}`;
        }),
        datasets: [
            {
                data: analyticsData.newUsersSeries.length > 0
                    ? analyticsData.newUsersSeries
                    : [0],
                color: (opacity = 1) => `rgba(59, 130, 246, ${opacity})`,
                strokeWidth: 2,
            },
        ],
    } : null;

    return (
        <SafeAreaView style={styles.container} edges={['bottom']}>
            <ScrollView
                style={styles.scrollView}
                contentContainerStyle={styles.scrollContent}
                refreshControl={
                    <RefreshControl
                        refreshing={refreshing}
                        onRefresh={onRefresh}
                        tintColor={Colors.dark.primary}
                    />
                }
            >
                <View style={styles.header}>
                    <Text style={styles.title}>Dashboard</Text>
                    <View style={styles.liveContainer}>
                        <Animated.View style={[styles.liveDot, { transform: [{ scale: pulseAnim }] }]} />
                        <Text style={styles.liveText}>{liveUsers} live</Text>
                    </View>
                </View>

                <View style={styles.statsGrid}>
                    <Card style={styles.statCard}>
                        <Users size={24} color={Colors.dark.primary} />
                        <Text style={styles.statValue}>{stats.totalUsers}</Text>
                        <Text style={styles.statLabel}>Total Users</Text>
                    </Card>

                    <Card style={styles.statCard}>
                        <Activity size={24} color={Colors.dark.success} />
                        <Text style={styles.statValue}>{stats.activeUsers}</Text>
                        <Text style={styles.statLabel}>Active</Text>
                    </Card>

                    <Card style={styles.statCard}>
                        <ShieldCheck size={24} color={Colors.dark.warning} />
                        <Text style={styles.statValue}>{stats.disabledUsers}</Text>
                        <Text style={styles.statLabel}>Disabled</Text>
                    </Card>

                    <Card style={styles.statCard}>
                        <BarChart3 size={24} color={Colors.dark.info} />
                        <Text style={styles.statValue}>{stats.subscribedUsers}</Text>
                        <Text style={styles.statLabel}>Subscribed</Text>
                    </Card>
                </View>

                <Card style={styles.chartCard}>
                    <Text style={styles.chartTitle}>7-Day Signups</Text>
                    {hasChartData && chartData ? (
                        <LineChart
                            data={chartData}
                            width={width - 64}
                            height={200}
                            chartConfig={{
                                backgroundColor: Colors.dark.surface,
                                backgroundGradientFrom: Colors.dark.surface,
                                backgroundGradientTo: Colors.dark.surface,
                                decimalPlaces: 0,
                                color: (opacity = 1) => `rgba(59, 130, 246, ${opacity})`,
                                labelColor: (opacity = 1) => `rgba(148, 163, 184, ${opacity})`,
                                style: {
                                    borderRadius: 12,
                                },
                                propsForDots: {
                                    r: '4',
                                    strokeWidth: '2',
                                    stroke: Colors.dark.primary,
                                },
                            }}
                            bezier
                            style={styles.chart}
                        />
                    ) : (
                        <Text style={styles.noDataText}>No analytics data available</Text>
                    )}
                </Card>

                <Card style={styles.controlCard}>
                    <Text style={styles.controlTitle}>Signup Controls</Text>

                    <View style={styles.controlRow}>
                        <Text style={styles.controlLabel}>Block User Signups</Text>
                        <TouchableOpacity
                            style={[
                                styles.controlButton,
                                settingsQuery.data?.blockUserSignup && styles.controlButtonActive,
                            ]}
                            onPress={() => toggleSignupBlock('user')}
                        >
                            <Text style={styles.controlButtonText}>
                                {settingsQuery.data?.blockUserSignup ? 'Blocked' : 'Allowed'}
                            </Text>
                        </TouchableOpacity>
                    </View>

                    <View style={styles.controlRow}>
                        <Text style={styles.controlLabel}>Block Seller Signups</Text>
                        <TouchableOpacity
                            style={[
                                styles.controlButton,
                                settingsQuery.data?.blockSellerSignup && styles.controlButtonActive,
                            ]}
                            onPress={() => toggleSignupBlock('seller')}
                        >
                            <Text style={styles.controlButtonText}>
                                {settingsQuery.data?.blockSellerSignup ? 'Blocked' : 'Allowed'}
                            </Text>
                        </TouchableOpacity>
                    </View>
                </Card>
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
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 8,
    },
    title: {
        fontSize: 28,
        fontWeight: '700' as const,
        color: Colors.dark.text,
    },
    liveContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
    },
    liveDot: {
        width: 8,
        height: 8,
        borderRadius: 4,
        backgroundColor: Colors.dark.success,
    },
    liveText: {
        fontSize: 14,
        fontWeight: '600' as const,
        color: Colors.dark.success,
    },
    statsGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 12,
    },
    statCard: {
        width: (width - 48) / 2,
        gap: 8,
    },
    statValue: {
        fontSize: 32,
        fontWeight: '700' as const,
        color: Colors.dark.text,
    },
    statLabel: {
        fontSize: 14,
        color: Colors.dark.textSecondary,
    },
    chartCard: {
        padding: 16,
    },
    chartTitle: {
        fontSize: 18,
        fontWeight: '600' as const,
        color: Colors.dark.text,
        marginBottom: 16,
    },
    chart: {
        marginVertical: 8,
        borderRadius: 12,
    },
    noDataText: {
        fontSize: 14,
        color: Colors.dark.textMuted,
        textAlign: 'center',
        paddingVertical: 40,
    },
    controlCard: {
        gap: 16,
    },
    controlTitle: {
        fontSize: 18,
        fontWeight: '600' as const,
        color: Colors.dark.text,
    },
    controlRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    controlLabel: {
        fontSize: 16,
        color: Colors.dark.textSecondary,
    },
    controlButton: {
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 8,
        backgroundColor: Colors.dark.surfaceLight,
    },
    controlButtonActive: {
        backgroundColor: Colors.dark.error,
    },
    controlButtonText: {
        fontSize: 14,
        fontWeight: '600' as const,
        color: Colors.dark.text,
    },
});
