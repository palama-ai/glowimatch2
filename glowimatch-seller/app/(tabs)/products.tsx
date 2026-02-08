import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Stack, router } from 'expo-router';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  RefreshControl,
  Alert,
  Platform,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Plus, Package, Eye, Edit2, Trash2 } from 'lucide-react-native';
import { Image } from 'expo-image';

import { api, handleApiError } from '@/lib/api';
import Colors from '@/constants/colors';
import { Product, ApiResponse } from '@/types';

export default function ProductsScreen() {
  const queryClient = useQueryClient();

  const productsQuery = useQuery<Product[]>({
    queryKey: ['seller-products'],
    queryFn: async () => {
      const response = await api.get<ApiResponse<Product[]>>('/seller/products');
      return response.data.data || [];
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (productId: string) => {
      await api.delete(`/seller/products/${productId}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['seller-products'] });
      queryClient.invalidateQueries({ queryKey: ['seller-analytics'] });
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

  const handleDelete = (productId: string, productName: string) => {
    if (Platform.OS === 'web') {
      if (confirm(`Delete "${productName}"? This action cannot be undone.`)) {
        deleteMutation.mutate(productId);
      }
    } else {
      Alert.alert(
        'Delete Product',
        `Delete "${productName}"? This action cannot be undone.`,
        [
          { text: 'Cancel', style: 'cancel' },
          { text: 'Delete', style: 'destructive', onPress: () => deleteMutation.mutate(productId) },
        ]
      );
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
          <View style={styles.headerContent}>
            <View>
              <Text style={styles.title}>Products</Text>
              <Text style={styles.subtitle}>
                {productsQuery.data?.length || 0} total products
              </Text>
            </View>
            <TouchableOpacity
              style={styles.addButton}
              onPress={() => router.push('/add-product')}
            >
              <Plus color={Colors.primary} size={24} />
            </TouchableOpacity>
          </View>
        </LinearGradient>

        <ScrollView
          style={styles.content}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={productsQuery.isRefetching}
              onRefresh={() => productsQuery.refetch()}
              tintColor={Colors.primary}
            />
          }
        >
          {productsQuery.isLoading ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color={Colors.primary} />
            </View>
          ) : productsQuery.data && productsQuery.data.length > 0 ? (
            productsQuery.data.map((product) => (
              <View key={product.id} style={styles.productCard}>
                {product.imageUrl ? (
                  <Image source={{ uri: product.imageUrl }} style={styles.productImage} />
                ) : (
                  <View style={styles.productImagePlaceholder}>
                    <Package color={Colors.textSecondary} size={32} />
                  </View>
                )}
                <View style={styles.productContent}>
                  <Text style={styles.productName} numberOfLines={2}>
                    {product.name}
                  </Text>
                  {product.brand ? (
                    <Text style={styles.productBrand} numberOfLines={1}>
                      {product.brand}
                    </Text>
                  ) : null}
                  <View style={styles.productMeta}>
                    <View style={styles.metaItem}>
                      <Eye color={Colors.textSecondary} size={14} />
                      <Text style={styles.metaText}>{product.views}</Text>
                    </View>
                    <View
                      style={[
                        styles.statusBadge,
                        {
                          backgroundColor: product.published
                            ? Colors.success
                            : Colors.textSecondary,
                        },
                      ]}
                    >
                      <Text style={styles.statusText}>
                        {product.published ? 'Published' : 'Draft'}
                      </Text>
                    </View>
                  </View>
                  {product.price ? (
                    <Text style={styles.productPrice}>
                      ${Number(product.price).toFixed(2)}
                      {product.originalPrice ? (
                        <Text style={styles.originalPrice}>
                          {' '}
                          ${Number(product.originalPrice).toFixed(2)}
                        </Text>
                      ) : null}
                    </Text>
                  ) : null}
                </View>
                <View style={styles.productActions}>
                  <TouchableOpacity
                    style={styles.actionButton}
                    onPress={() => router.push(`/edit-product?id=${product.id}`)}
                  >
                    <Edit2 color={Colors.primary} size={20} />
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[styles.actionButton, styles.deleteButton]}
                    onPress={() => handleDelete(product.id, product.name)}
                  >
                    <Trash2 color={Colors.error} size={20} />
                  </TouchableOpacity>
                </View>
              </View>
            ))
          ) : (
            <View style={styles.emptyState}>
              <Package color={Colors.textSecondary} size={64} />
              <Text style={styles.emptyTitle}>No Products Yet</Text>
              <Text style={styles.emptyText}>
                Start by adding your first product
              </Text>
              <TouchableOpacity
                style={styles.emptyButton}
                onPress={() => router.push('/add-product')}
              >
                <Plus color={Colors.textLight} size={20} />
                <Text style={styles.emptyButtonText}>Add Product</Text>
              </TouchableOpacity>
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
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
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
  addButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: Colors.textLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: {
    flex: 1,
    padding: 24,
  },
  loadingContainer: {
    paddingVertical: 48,
    alignItems: 'center',
  },
  productCard: {
    flexDirection: 'row',
    backgroundColor: Colors.cardBg,
    borderRadius: 16,
    padding: 12,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  productImage: {
    width: 80,
    height: 80,
    borderRadius: 12,
  },
  productImagePlaceholder: {
    width: 80,
    height: 80,
    borderRadius: 12,
    backgroundColor: Colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
  },
  productContent: {
    flex: 1,
    marginLeft: 12,
    justifyContent: 'space-between',
  },
  productName: {
    fontSize: 16,
    fontWeight: '600' as const,
    color: Colors.text,
    marginBottom: 4,
  },
  productBrand: {
    fontSize: 12,
    color: Colors.textSecondary,
    marginBottom: 8,
  },
  productMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 8,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  metaText: {
    fontSize: 12,
    color: Colors.textSecondary,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 8,
  },
  statusText: {
    fontSize: 10,
    fontWeight: '600' as const,
    color: Colors.textLight,
  },
  productPrice: {
    fontSize: 16,
    fontWeight: 'bold' as const,
    color: Colors.primary,
  },
  originalPrice: {
    fontSize: 14,
    fontWeight: 'normal' as const,
    color: Colors.textSecondary,
    textDecorationLine: 'line-through' as const,
  },
  productActions: {
    justifyContent: 'center',
    gap: 8,
    marginLeft: 8,
  },
  actionButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
  },
  deleteButton: {
    backgroundColor: 'rgba(244, 67, 54, 0.1)',
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
    marginTop: 24,
    marginBottom: 8,
  },
  emptyText: {
    fontSize: 14,
    color: Colors.textSecondary,
    marginBottom: 24,
  },
  emptyButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: Colors.primary,
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 12,
  },
  emptyButtonText: {
    fontSize: 16,
    fontWeight: '600' as const,
    color: Colors.textLight,
  },
});
