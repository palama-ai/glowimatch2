import { useQuery } from '@tanstack/react-query';
import { Stack } from 'expo-router';
import { View, Text, StyleSheet, ScrollView, Dimensions, RefreshControl, ActivityIndicator } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { LineChart } from 'react-native-chart-kit';
import { TrendingUp, Package, Eye, CheckCircle, BarChart3 } from 'lucide-react-native';

import { api } from '@/lib/api';
import Colors from '@/constants/colors';
import { ApiResponse } from '@/types';

interface AnalyticsData {
  totalProducts: number;
  publishedProducts: number;
  totalViews: number;
  viewsByDay: Array<{ date: string; views: number }>;
  topProducts: Array<{ id: string; name: string; image_url?: string; view_count: number }>;
}

export default function DashboardScreen() {
  const analyticsQuery = useQuery<AnalyticsData>({
    queryKey: ['seller-analytics'],
    queryFn: async () => {
      const response = await api.get<ApiResponse<AnalyticsData>>('/seller/analytics');
      return response.data.data!;
    },
  });

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good Morning ☀️';
    if (hour < 18) return 'Good Afternoon 🌤️';
    return 'Good Evening 🌙';
  };

  const viewsData = analyticsQuery.data?.viewsByDay || [];
  const hasViewsData = viewsData.length > 0;

  const chartData = {
    labels: hasViewsData ? viewsData.map((d) => d.date?.slice(5) || '') : [''],
    datasets: [{ data: hasViewsData ? viewsData.map((d) => Number(d.views) || 0) : [0] }],
  };

  const stats = [
    { icon: Package, value: analyticsQuery.data?.totalProducts || 0, label: 'Products', color: Colors.primary },
    { icon: CheckCircle, value: analyticsQuery.data?.publishedProducts || 0, label: 'Published', color: Colors.success },
    { icon: Eye, value: analyticsQuery.data?.totalViews || 0, label: 'Views', color: Colors.secondary },
    { icon: TrendingUp, value: analyticsQuery.data?.viewsByDay?.reduce((s, d) => s + d.views, 0) || 0, label: 'This Week', color: Colors.warning },
  ];

  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <View style={styles.container}>
        <LinearGradient colors={[Colors.gradientStart, Colors.gradientEnd]} style={styles.header}>
          <Text style={styles.greeting}>{getGreeting()}</Text>
          <Text style={styles.title}>Dashboard</Text>
        </LinearGradient>

        <ScrollView
          style={styles.content}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={analyticsQuery.isRefetching}
              onRefresh={() => analyticsQuery.refetch()}
              tintColor={Colors.primary}
            />
          }
        >
          {analyticsQuery.isLoading ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color={Colors.primary} />
              <Text style={styles.loadingText}>Loading analytics...</Text>
            </View>
          ) : (
            <>
              <View style={styles.statsGrid}>
                {stats.map((stat, idx) => (
                  <View key={idx} style={styles.statCard}>
                    <View style={[styles.statIcon, { backgroundColor: stat.color }]}>
                      <stat.icon color={Colors.textLight} size={22} />
                    </View>
                    <Text style={styles.statValue}>{stat.value}</Text>
                    <Text style={styles.statLabel}>{stat.label}</Text>
                  </View>
                ))}
              </View>

              {hasViewsData && (
                <View style={styles.section}>
                  <Text style={styles.sectionTitle}>Weekly Views</Text>
                  <View style={styles.chartCard}>
                    <LineChart
                      data={chartData}
                      width={Dimensions.get('window').width - 64}
                      height={180}
                      chartConfig={{
                        backgroundColor: Colors.surface,
                        backgroundGradientFrom: Colors.surface,
                        backgroundGradientTo: Colors.surface,
                        decimalPlaces: 0,
                        color: (opacity = 1) => `rgba(233, 30, 99, ${opacity})`,
                        labelColor: () => Colors.textSecondary,
                        propsForDots: { r: '4', strokeWidth: '2', stroke: Colors.primary },
                      }}
                      bezier
                      style={styles.chart}
                    />
                  </View>
                </View>
              )}

              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Top Products</Text>
                {analyticsQuery.data?.topProducts?.length ? (
                  analyticsQuery.data.topProducts.slice(0, 5).map((product, idx) => (
                    <View key={product.id} style={styles.productCard}>
                      <View style={[styles.productRank, { backgroundColor: idx === 0 ? Colors.warning : Colors.primary }]}>
                        <Text style={styles.rankText}>{idx + 1}</Text>
                      </View>
                      <View style={styles.productInfo}>
                        <Text style={styles.productName} numberOfLines={1}>{product.name}</Text>
                        <Text style={styles.productViews}>{product.view_count} views</Text>
                      </View>
                    </View>
                  ))
                ) : (
                  <View style={styles.emptyState}>
                    <BarChart3 color={Colors.textMuted} size={40} />
                    <Text style={styles.emptyTitle}>No Products Yet</Text>
                    <Text style={styles.emptyText}>Add products to see analytics</Text>
                  </View>
                )}
              </View>
            </>
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
  greeting: {
    fontSize: 14,
    color: Colors.textLight,
    opacity: 0.9,
    marginBottom: 4,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold' as const,
    color: Colors.textLight,
  },
  content: {
    flex: 1,
    padding: 24,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginBottom: 32,
  },
  statCard: {
    flex: 1,
    minWidth: '47%',
    backgroundColor: Colors.cardBg,
    borderRadius: 16,
    padding: 16,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  statIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  statValue: {
    fontSize: 24,
    fontWeight: 'bold' as const,
    color: Colors.text,
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: Colors.textSecondary,
    textAlign: 'center',
  },
  section: {
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold' as const,
    color: Colors.text,
    marginBottom: 16,
  },
  chartCard: {
    backgroundColor: Colors.cardBg,
    borderRadius: 16,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  chart: {
    borderRadius: 16,
  },
  emptyChart: {
    backgroundColor: Colors.cardBg,
    borderRadius: 16,
    padding: 48,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyText: {
    fontSize: 14,
    color: Colors.textSecondary,
  },
  productCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.cardBg,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  productRank: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  rankText: {
    fontSize: 14,
    fontWeight: 'bold' as const,
    color: Colors.textLight,
  },
  productInfo: {
    flex: 1,
  },
  productName: {
    fontSize: 16,
    fontWeight: '600' as const,
    color: Colors.text,
    marginBottom: 4,
  },
  productViews: {
    fontSize: 13,
    color: Colors.textSecondary,
  },
  emptyState: {
    backgroundColor: Colors.cardBg,
    borderRadius: 16,
    padding: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '600' as const,
    color: Colors.text,
    marginTop: 16,
    marginBottom: 4,
  },
  emptyText: {
    fontSize: 14,
    color: Colors.textSecondary,
  },
  loadingContainer: {
    flex: 1,
    paddingVertical: 100,
    alignItems: 'center',
    justifyContent: 'center',
  },
  loadingText: {
    fontSize: 14,
    color: Colors.textSecondary,
    marginTop: 12,
  },
});
