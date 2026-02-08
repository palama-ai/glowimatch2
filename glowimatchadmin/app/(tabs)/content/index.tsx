import { useQuery } from '@tanstack/react-query';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
    FlatList,
    Image,
    RefreshControl,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
    useWindowDimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { FileText, Package, Plus, Search } from 'lucide-react-native';

import Badge from '@/components/Badge';
import Card from '@/components/Card';
import ErrorView from '@/components/ErrorView';
import Loading from '@/components/Loading';
import Colors from '@/constants/colors';
import { api } from '@/services/api';
import { Blog, Product } from '@/types';

type Tab = 'blogs' | 'products';

export default function ContentScreen() {
    const [activeTab, setActiveTab] = useState<Tab>('blogs');
    const [search, setSearch] = useState('');
    const router = useRouter();
    const { width } = useWindowDimensions();

    const blogsQuery = useQuery<Blog[]>({
        queryKey: ['admin', 'blogs'],
        queryFn: async () => {
            const response = await api.get('/admin/blogs');
            // Backend returns { data: blogs[] }
            return response.data.data || [];
        },
        enabled: activeTab === 'blogs',
    });

    const productsQuery = useQuery<Product[]>({
        queryKey: ['admin', 'products'],
        queryFn: async () => {
            const response = await api.get('/admin/products');
            // Backend returns { data: products[] }
            return response.data.data || [];
        },
        enabled: activeTab === 'products',
    });

    const filteredBlogs = React.useMemo(() => {
        if (!blogsQuery.data) return [];
        return blogsQuery.data.filter((blog) =>
            blog.title.toLowerCase().includes(search.toLowerCase())
        );
    }, [blogsQuery.data, search]);

    const filteredProducts = React.useMemo(() => {
        if (!productsQuery.data) return [];
        return productsQuery.data.filter((product) =>
            product.name.toLowerCase().includes(search.toLowerCase())
        );
    }, [productsQuery.data, search]);

    const renderBlog = ({ item }: { item: Blog }) => (
        <TouchableOpacity
            onPress={() => router.push(`/blog-editor?id=${item.id}` as any)}
            style={styles.item}
        >
            <Card style={styles.card}>
                {item.coverImage && (
                    <Image source={{ uri: item.coverImage }} style={styles.coverImage} />
                )}
                <View style={styles.cardContent}>
                    <Text style={styles.itemTitle} numberOfLines={2}>
                        {item.title}
                    </Text>
                    <Text style={styles.itemExcerpt} numberOfLines={2}>
                        {item.excerpt}
                    </Text>
                    <View style={styles.cardFooter}>
                        <Badge
                            label={item.published ? 'Published' : 'Draft'}
                            variant={item.published ? 'success' : 'default'}
                        />
                        <Text style={styles.dateText}>
                            {new Date(item.createdAt).toLocaleDateString()}
                        </Text>
                    </View>
                </View>
            </Card>
        </TouchableOpacity>
    );

    const renderProduct = ({ item }: { item: Product }) => (
        <View style={styles.item}>
            <Card style={styles.card}>
                {item.image && (
                    <Image source={{ uri: item.image }} style={styles.productImage} />
                )}
                <View style={styles.cardContent}>
                    <Text style={styles.itemTitle} numberOfLines={2}>
                        {item.name}
                    </Text>
                    <Text style={styles.itemDescription} numberOfLines={2}>
                        {item.description}
                    </Text>
                    <View style={styles.cardFooter}>
                        <Text style={styles.priceText}>${item.price}</Text>
                        <Badge
                            label={item.published ? 'Published' : 'Unpublished'}
                            variant={item.published ? 'success' : 'default'}
                        />
                    </View>
                    <Text style={styles.sellerText}>By: {item.sellerName}</Text>
                </View>
            </Card>
        </View>
    );

    const isLoading = activeTab === 'blogs' ? blogsQuery.isLoading : productsQuery.isLoading;
    const error = activeTab === 'blogs' ? blogsQuery.error : productsQuery.error;

    if (isLoading) {
        return <Loading text={`Loading ${activeTab}...`} />;
    }

    if (error) {
        return (
            <ErrorView
                message={`Failed to load ${activeTab}`}
                onRetry={() => {
                    if (activeTab === 'blogs') {
                        blogsQuery.refetch();
                    } else {
                        productsQuery.refetch();
                    }
                }}
            />
        );
    }

    return (
        <SafeAreaView style={styles.container} edges={['bottom']}>
            <View style={styles.header}>
                <View style={styles.tabContainer}>
                    <TouchableOpacity
                        style={[styles.tab, activeTab === 'blogs' && styles.tabActive]}
                        onPress={() => setActiveTab('blogs')}
                    >
                        <FileText
                            size={20}
                            color={activeTab === 'blogs' ? Colors.dark.text : Colors.dark.textSecondary}
                        />
                        <Text
                            style={[styles.tabText, activeTab === 'blogs' && styles.tabTextActive]}
                        >
                            Blogs
                        </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={[styles.tab, activeTab === 'products' && styles.tabActive]}
                        onPress={() => setActiveTab('products')}
                    >
                        <Package
                            size={20}
                            color={activeTab === 'products' ? Colors.dark.text : Colors.dark.textSecondary}
                        />
                        <Text
                            style={[styles.tabText, activeTab === 'products' && styles.tabTextActive]}
                        >
                            Products
                        </Text>
                    </TouchableOpacity>
                </View>

                <View style={styles.searchContainer}>
                    <Search size={20} color={Colors.dark.textSecondary} style={styles.searchIcon} />
                    <TextInput
                        style={styles.searchInput}
                        placeholder={`Search ${activeTab}...`}
                        placeholderTextColor={Colors.dark.textMuted}
                        value={search}
                        onChangeText={setSearch}
                    />
                </View>

                {activeTab === 'blogs' && (
                    <TouchableOpacity
                        style={styles.createButton}
                        onPress={() => router.push('/blog-editor' as any)}
                    >
                        <Plus size={20} color={Colors.dark.text} />
                        <Text style={styles.createButtonText}>Create Blog</Text>
                    </TouchableOpacity>
                )}
            </View>

            {activeTab === 'blogs' ? (
                <FlatList
                    data={filteredBlogs}
                    renderItem={renderBlog}
                    keyExtractor={(item) => item.id}
                    contentContainerStyle={styles.list}
                    numColumns={width > 600 ? 2 : 1}
                    key={width > 600 ? 'two-columns-blogs' : 'one-column-blogs'}
                    refreshControl={
                        <RefreshControl
                            refreshing={false}
                            onRefresh={() => blogsQuery.refetch()}
                            tintColor={Colors.dark.primary}
                        />
                    }
                    ListEmptyComponent={
                        <View style={styles.emptyContainer}>
                            <Text style={styles.emptyText}>No blogs found</Text>
                        </View>
                    }
                />
            ) : (
                <FlatList
                    data={filteredProducts}
                    renderItem={renderProduct}
                    keyExtractor={(item) => item.id}
                    contentContainerStyle={styles.list}
                    numColumns={width > 600 ? 2 : 1}
                    key={width > 600 ? 'two-columns-products' : 'one-column-products'}
                    refreshControl={
                        <RefreshControl
                            refreshing={false}
                            onRefresh={() => productsQuery.refetch()}
                            tintColor={Colors.dark.primary}
                        />
                    }
                    ListEmptyComponent={
                        <View style={styles.emptyContainer}>
                            <Text style={styles.emptyText}>No products found</Text>
                        </View>
                    }
                />
            )}
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
        gap: 12,
    },
    tabContainer: {
        flexDirection: 'row',
        backgroundColor: Colors.dark.surface,
        borderRadius: 12,
        padding: 4,
    },
    tab: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
        paddingVertical: 12,
        borderRadius: 8,
    },
    tabActive: {
        backgroundColor: Colors.dark.primary,
    },
    tabText: {
        fontSize: 14,
        fontWeight: '600' as const,
        color: Colors.dark.textSecondary,
    },
    tabTextActive: {
        color: Colors.dark.text,
    },
    searchContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: Colors.dark.surface,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: Colors.dark.border,
        paddingHorizontal: 16,
        height: 48,
    },
    searchIcon: {
        marginRight: 8,
    },
    searchInput: {
        flex: 1,
        fontSize: 16,
        color: Colors.dark.text,
    },
    createButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
        backgroundColor: Colors.dark.primary,
        borderRadius: 12,
        paddingVertical: 12,
    },
    createButtonText: {
        fontSize: 16,
        fontWeight: '600' as const,
        color: Colors.dark.text,
    },
    list: {
        padding: 16,
        gap: 12,
    },
    item: {
        flex: 1,
        marginBottom: 0,
    },
    card: {
        gap: 0,
        padding: 0,
        overflow: 'hidden',
    },
    coverImage: {
        width: '100%',
        height: 150,
        backgroundColor: Colors.dark.surfaceLight,
    },
    productImage: {
        width: '100%',
        height: 150,
        backgroundColor: Colors.dark.surfaceLight,
    },
    cardContent: {
        padding: 16,
        gap: 8,
    },
    itemTitle: {
        fontSize: 16,
        fontWeight: '600' as const,
        color: Colors.dark.text,
    },
    itemExcerpt: {
        fontSize: 14,
        color: Colors.dark.textSecondary,
        lineHeight: 20,
    },
    itemDescription: {
        fontSize: 14,
        color: Colors.dark.textSecondary,
        lineHeight: 20,
    },
    cardFooter: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: 4,
    },
    dateText: {
        fontSize: 12,
        color: Colors.dark.textMuted,
    },
    priceText: {
        fontSize: 18,
        fontWeight: '700' as const,
        color: Colors.dark.primary,
    },
    sellerText: {
        fontSize: 12,
        color: Colors.dark.textMuted,
    },
    emptyContainer: {
        padding: 40,
        alignItems: 'center',
    },
    emptyText: {
        fontSize: 16,
        color: Colors.dark.textMuted,
    },
});
