import { useMutation, useQuery } from '@tanstack/react-query';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
    Alert,
    Image,
    ScrollView,
    StyleSheet,
    Switch,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { UserX, Mail, Crown, ShieldAlert, X } from 'lucide-react-native';

import Badge from '@/components/Badge';
import Button from '@/components/Button';
import Card from '@/components/Card';
import Loading from '@/components/Loading';
import Colors from '@/constants/colors';
import { api } from '@/services/api';
import { User } from '@/types';

export default function UserDetailScreen() {
    const { id } = useLocalSearchParams<{ id: string }>();
    const router = useRouter();
    const [statusMessage, setStatusMessage] = useState('');
    const [subscriptionPlan, setSubscriptionPlan] = useState<'free' | 'basic' | 'premium'>('free');
    const [disabled, setDisabled] = useState(false);

    const userQuery = useQuery<User>({
        queryKey: ['admin', 'users', id],
        queryFn: async () => {
            const response = await api.get(`/admin/users/${id}`);
            // Backend returns { data: user }
            return response.data.data;
        },
        enabled: !!id,
    });

    React.useEffect(() => {
        if (userQuery.data) {
            setStatusMessage(userQuery.data.statusMessage || '');
            setSubscriptionPlan(userQuery.data.subscriptionPlan || 'free');
            setDisabled(userQuery.data.disabled);
        }
    }, [userQuery.data]);

    const updateMutation = useMutation({
        mutationFn: async (data: Partial<User>) => {
            const response = await api.patch(`/admin/users/${id}`, data);
            return response.data;
        },
        onSuccess: () => {
            Alert.alert('Success', 'User updated successfully');
            userQuery.refetch();
        },
        onError: (error: any) => {
            Alert.alert('Error', error.response?.data?.message || 'Failed to update user');
        },
    });

    const deleteMutation = useMutation({
        mutationFn: async () => {
            const response = await api.delete(`/admin/users/${id}`);
            return response.data;
        },
        onSuccess: () => {
            Alert.alert('Success', 'User deleted successfully');
            router.back();
        },
        onError: (error: any) => {
            Alert.alert('Error', error.response?.data?.message || 'Failed to delete user');
        },
    });

    const handleSave = () => {
        updateMutation.mutate({
            statusMessage,
            subscriptionPlan,
            disabled,
        });
    };

    const handleDelete = () => {
        Alert.alert(
            'Delete User',
            'Are you sure you want to delete this user? This action cannot be undone.',
            [
                { text: 'Cancel', style: 'cancel' },
                {
                    text: 'Delete',
                    style: 'destructive',
                    onPress: () => deleteMutation.mutate(),
                },
            ]
        );
    };

    if (userQuery.isLoading) {
        return <Loading text="Loading user..." />;
    }

    if (!userQuery.data) {
        return (
            <View style={styles.errorContainer}>
                <Text style={styles.errorText}>User not found</Text>
            </View>
        );
    }

    const user = userQuery.data;

    return (
        <SafeAreaView style={styles.container} edges={['bottom']}>
            <View style={styles.header}>
                <Text style={styles.title}>User Details</Text>
                <TouchableOpacity onPress={() => router.back()} style={styles.closeButton}>
                    <X size={24} color={Colors.dark.text} />
                </TouchableOpacity>
            </View>

            <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
                <Card style={styles.profileCard}>
                    <Image
                        source={{
                            uri:
                                user.avatar ||
                                `https://ui-avatars.com/api/?name=${encodeURIComponent(user.full_name || user.name || user.email || 'User')}&background=3b82f6&color=fff`,
                        }}
                        style={styles.avatar}
                    />
                    <Text style={styles.userName}>{user.full_name || user.name || user.email || 'Unknown User'}</Text>
                    <Text style={styles.userEmail}>{user.email || 'No email'}</Text>
                    <View style={styles.badgesRow}>
                        <Badge
                            label={user.role || 'user'}
                            variant={user.role === 'admin' ? 'error' : user.role === 'seller' ? 'info' : 'default'}
                        />
                        {user.disabled === true ? <Badge label="Disabled" variant="error" /> : null}
                    </View>
                </Card>

                <Card style={styles.formCard}>
                    <Text style={styles.sectionTitle}>Status Message</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="Set a status message for this user"
                        placeholderTextColor={Colors.dark.textMuted}
                        value={statusMessage}
                        onChangeText={setStatusMessage}
                        multiline
                        numberOfLines={3}
                    />
                </Card>

                <Card style={styles.formCard}>
                    <Text style={styles.sectionTitle}>Subscription Plan</Text>
                    <View style={styles.radioGroup}>
                        <TouchableOpacity
                            style={styles.radioOption}
                            onPress={() => setSubscriptionPlan('free')}
                        >
                            <View
                                style={[
                                    styles.radio,
                                    subscriptionPlan === 'free' && styles.radioSelected,
                                ]}
                            />
                            <Text style={styles.radioLabel}>Free</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={styles.radioOption}
                            onPress={() => setSubscriptionPlan('basic')}
                        >
                            <View
                                style={[
                                    styles.radio,
                                    subscriptionPlan === 'basic' && styles.radioSelected,
                                ]}
                            />
                            <Text style={styles.radioLabel}>Basic</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={styles.radioOption}
                            onPress={() => setSubscriptionPlan('premium')}
                        >
                            <View
                                style={[
                                    styles.radio,
                                    subscriptionPlan === 'premium' && styles.radioSelected,
                                ]}
                            >
                                {subscriptionPlan === 'premium' && (
                                    <Crown size={12} color={Colors.dark.text} />
                                )}
                            </View>
                            <Text style={styles.radioLabel}>Premium</Text>
                        </TouchableOpacity>
                    </View>
                </Card>

                <Card style={styles.formCard}>
                    <View style={styles.switchRow}>
                        <View style={styles.switchLabel}>
                            <UserX size={20} color={Colors.dark.error} />
                            <Text style={styles.switchText}>Disable User</Text>
                        </View>
                        <Switch
                            value={disabled}
                            onValueChange={setDisabled}
                            trackColor={{ false: Colors.dark.border, true: Colors.dark.error }}
                            thumbColor={Colors.dark.text}
                        />
                    </View>
                </Card>

                <View style={styles.actionsContainer}>
                    <Button
                        title="Save Changes"
                        onPress={handleSave}
                        loading={updateMutation.isPending}
                    />
                    <Button
                        title="Delete User"
                        onPress={handleDelete}
                        variant="danger"
                        loading={deleteMutation.isPending}
                        icon={<ShieldAlert size={20} color={Colors.dark.text} />}
                    />
                </View>

                <Card style={styles.infoCard}>
                    <View style={styles.infoRow}>
                        <Mail size={16} color={Colors.dark.textSecondary} />
                        <Text style={styles.infoLabel}>Joined:</Text>
                        <Text style={styles.infoValue}>
                            {user.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'N/A'}
                        </Text>
                    </View>
                    {user.lastActive && (
                        <View style={styles.infoRow}>
                            <Mail size={16} color={Colors.dark.textSecondary} />
                            <Text style={styles.infoLabel}>Last Active:</Text>
                            <Text style={styles.infoValue}>
                                {new Date(user.lastActive).toLocaleString()}
                            </Text>
                        </View>
                    )}
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
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 16,
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderBottomColor: Colors.dark.border,
    },
    title: {
        fontSize: 20,
        fontWeight: '700' as const,
        color: Colors.dark.text,
    },
    closeButton: {
        padding: 4,
    },
    scrollView: {
        flex: 1,
    },
    scrollContent: {
        padding: 16,
        gap: 16,
    },
    profileCard: {
        alignItems: 'center',
        paddingVertical: 24,
        gap: 12,
    },
    avatar: {
        width: 80,
        height: 80,
        borderRadius: 40,
        backgroundColor: Colors.dark.surfaceLight,
    },
    userName: {
        fontSize: 24,
        fontWeight: '700' as const,
        color: Colors.dark.text,
    },
    userEmail: {
        fontSize: 16,
        color: Colors.dark.textSecondary,
    },
    badgesRow: {
        flexDirection: 'row',
        gap: 8,
        marginTop: 8,
    },
    formCard: {
        gap: 12,
    },
    sectionTitle: {
        fontSize: 16,
        fontWeight: '600' as const,
        color: Colors.dark.text,
    },
    input: {
        backgroundColor: Colors.dark.background,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: Colors.dark.border,
        paddingHorizontal: 16,
        paddingVertical: 12,
        fontSize: 16,
        color: Colors.dark.text,
        minHeight: 80,
        textAlignVertical: 'top',
    },
    radioGroup: {
        gap: 12,
    },
    radioOption: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
        paddingVertical: 8,
    },
    radio: {
        width: 24,
        height: 24,
        borderRadius: 12,
        borderWidth: 2,
        borderColor: Colors.dark.border,
        alignItems: 'center',
        justifyContent: 'center',
    },
    radioSelected: {
        borderColor: Colors.dark.primary,
        backgroundColor: Colors.dark.primary,
    },
    radioLabel: {
        fontSize: 16,
        color: Colors.dark.text,
    },
    switchRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    switchLabel: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
    },
    switchText: {
        fontSize: 16,
        color: Colors.dark.text,
    },
    actionsContainer: {
        gap: 12,
    },
    infoCard: {
        gap: 12,
    },
    infoRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    infoLabel: {
        fontSize: 14,
        color: Colors.dark.textSecondary,
    },
    infoValue: {
        fontSize: 14,
        fontWeight: '600' as const,
        color: Colors.dark.text,
    },
    errorContainer: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: Colors.dark.background,
    },
    errorText: {
        fontSize: 16,
        color: Colors.dark.textSecondary,
    },
});
