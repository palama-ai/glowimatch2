import { useQuery } from '@tanstack/react-query';
import { useRouter } from 'expo-router';
import React, { useState, useMemo } from 'react';
import {
    FlatList,
    RefreshControl,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
    Image,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Search, UserX } from 'lucide-react-native';

import Badge from '@/components/Badge';
import Card from '@/components/Card';
import ErrorView from '@/components/ErrorView';
import Loading from '@/components/Loading';
import Colors from '@/constants/colors';
import { api } from '@/services/api';
import { User } from '@/types';

export default function UsersScreen() {
    const [search, setSearch] = useState('');
    const [filter, setFilter] = useState<'all' | 'active' | 'disabled'>('all');
    const router = useRouter();

    const usersQuery = useQuery<User[]>({
        queryKey: ['admin', 'users'],
        queryFn: async () => {
            const response = await api.get('/admin/users');
            // Backend returns { data: users[] }
            return response.data.data || [];
        },
    });

    const filteredUsers = useMemo(() => {
        let users = usersQuery.data || [];

        if (search) {
            users = users.filter((user) => {
                const userName = user.full_name || user.name || user.email;
                return userName.toLowerCase().includes(search.toLowerCase()) ||
                    user.email.toLowerCase().includes(search.toLowerCase());
            });
        }

        if (filter === 'active') {
            users = users.filter((user) => !user.disabled);
        } else if (filter === 'disabled') {
            users = users.filter((user) => user.disabled);
        }

        return users;
    }, [usersQuery.data, search, filter]);

    const getRoleBadgeVariant = (role: string) => {
        switch (role) {
            case 'admin':
                return 'error' as const;
            case 'seller':
                return 'info' as const;
            default:
                return 'default' as const;
        }
    };

    const getUserDisplayName = (user: User) => {
        return user.full_name || user.name || user.email;
    };

    const renderUser = ({ item }: { item: User }) => {
        const displayName = getUserDisplayName(item) || 'Unknown User';
        return (
            <TouchableOpacity
                onPress={() => router.push(`/user-detail?id=${item.id}` as any)}
                style={styles.userItem}
            >
                <Card style={styles.userCard}>
                    <View style={styles.userHeader}>
                        <Image
                            source={{ uri: item.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(displayName)}&background=3b82f6&color=fff` }}
                            style={styles.avatar}
                        />
                        <View style={styles.userInfo}>
                            <View style={styles.userNameRow}>
                                <Text style={styles.userName}>{displayName}</Text>
                                {item.disabled === true ? <UserX size={16} color={Colors.dark.error} /> : null}
                            </View>
                            <Text style={styles.userEmail}>{item.email || 'No email'}</Text>
                        </View>
                    </View>

                    <View style={styles.userFooter}>
                        <Badge label={item.role || 'user'} variant={getRoleBadgeVariant(item.role || 'user')} />
                        {item.subscriptionPlan && item.subscriptionPlan !== 'free' ? (
                            <Badge label={item.subscriptionPlan} variant="success" />
                        ) : null}
                    </View>
                </Card>
            </TouchableOpacity>
        );
    };

    if (usersQuery.isLoading) {
        return <Loading text="Loading users..." />;
    }

    if (usersQuery.error) {
        return <ErrorView message="Failed to load users" onRetry={() => usersQuery.refetch()} />;
    }

    return (
        <SafeAreaView style={styles.container} edges={['bottom']}>
            <View style={styles.header}>
                <View style={styles.searchContainer}>
                    <Search size={20} color={Colors.dark.textSecondary} style={styles.searchIcon} />
                    <TextInput
                        style={styles.searchInput}
                        placeholder="Search users..."
                        placeholderTextColor={Colors.dark.textMuted}
                        value={search}
                        onChangeText={setSearch}
                    />
                </View>

                <View style={styles.filterContainer}>
                    <TouchableOpacity
                        style={[styles.filterButton, filter === 'all' && styles.filterButtonActive]}
                        onPress={() => setFilter('all')}
                    >
                        <Text style={[styles.filterText, filter === 'all' && styles.filterTextActive]}>
                            All
                        </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={[styles.filterButton, filter === 'active' && styles.filterButtonActive]}
                        onPress={() => setFilter('active')}
                    >
                        <Text style={[styles.filterText, filter === 'active' && styles.filterTextActive]}>
                            Active
                        </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={[styles.filterButton, filter === 'disabled' && styles.filterButtonActive]}
                        onPress={() => setFilter('disabled')}
                    >
                        <Text style={[styles.filterText, filter === 'disabled' && styles.filterTextActive]}>
                            Disabled
                        </Text>
                    </TouchableOpacity>
                </View>
            </View>

            <FlatList
                data={filteredUsers}
                renderItem={renderUser}
                keyExtractor={(item) => item.id}
                contentContainerStyle={styles.list}
                refreshControl={
                    <RefreshControl
                        refreshing={false}
                        onRefresh={() => usersQuery.refetch()}
                        tintColor={Colors.dark.primary}
                    />
                }
                ListEmptyComponent={
                    <View style={styles.emptyContainer}>
                        <Text style={styles.emptyText}>No users found</Text>
                    </View>
                }
            />
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
    filterContainer: {
        flexDirection: 'row',
        gap: 8,
    },
    filterButton: {
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 8,
        backgroundColor: Colors.dark.surface,
        borderWidth: 1,
        borderColor: Colors.dark.border,
    },
    filterButtonActive: {
        backgroundColor: Colors.dark.primary,
        borderColor: Colors.dark.primary,
    },
    filterText: {
        fontSize: 14,
        fontWeight: '600' as const,
        color: Colors.dark.textSecondary,
    },
    filterTextActive: {
        color: Colors.dark.text,
    },
    list: {
        padding: 16,
        gap: 12,
    },
    userItem: {
        marginBottom: 0,
    },
    userCard: {
        gap: 12,
    },
    userHeader: {
        flexDirection: 'row',
        gap: 12,
    },
    avatar: {
        width: 48,
        height: 48,
        borderRadius: 24,
        backgroundColor: Colors.dark.surfaceLight,
    },
    userInfo: {
        flex: 1,
        justifyContent: 'center',
    },
    userNameRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    userName: {
        fontSize: 16,
        fontWeight: '600' as const,
        color: Colors.dark.text,
    },
    userEmail: {
        fontSize: 14,
        color: Colors.dark.textSecondary,
        marginTop: 2,
    },
    userFooter: {
        flexDirection: 'row',
        gap: 8,
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
