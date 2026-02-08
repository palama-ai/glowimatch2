import { useMutation, useQuery } from '@tanstack/react-query';
import React, { useState } from 'react';
import {
    Alert,
    RefreshControl,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Bell, Send } from 'lucide-react-native';

import Button from '@/components/Button';
import Card from '@/components/Card';
import ErrorView from '@/components/ErrorView';
import Loading from '@/components/Loading';
import Colors from '@/constants/colors';
import { api } from '@/services/api';
import { Notification } from '@/types';

export default function NotificationsScreen() {
    const [title, setTitle] = useState('');
    const [body, setBody] = useState('');

    const notificationsQuery = useQuery<Notification[]>({
        queryKey: ['admin', 'notifications'],
        queryFn: async () => {
            const response = await api.get('/admin/notifications');
            // Backend returns { data: notifications[] }
            return response.data.data || [];
        },
    });

    const sendMutation = useMutation({
        mutationFn: async (data: { title: string; body: string }) => {
            const response = await api.post('/admin/notifications/send', data);
            return response.data;
        },
        onSuccess: () => {
            Alert.alert('Success', 'Notification sent to all users');
            setTitle('');
            setBody('');
            notificationsQuery.refetch();
        },
        onError: (error: any) => {
            Alert.alert('Error', error.response?.data?.message || 'Failed to send notification');
        },
    });

    const handleSend = () => {
        if (!title || !body) {
            Alert.alert('Error', 'Please enter title and body');
            return;
        }

        Alert.alert('Send Notification', 'Send this notification to all users?', [
            { text: 'Cancel', style: 'cancel' },
            {
                text: 'Send',
                onPress: () => sendMutation.mutate({ title, body }),
            },
        ]);
    };

    const renderNotification = ({ item }: { item: Notification }) => (
        <Card style={styles.notificationCard}>
            <View style={styles.notificationHeader}>
                <Bell size={20} color={Colors.dark.primary} />
                <Text style={styles.notificationDate}>
                    {new Date(item.createdAt).toLocaleString()}
                </Text>
            </View>
            <Text style={styles.notificationTitle}>{item.title}</Text>
            <Text style={styles.notificationBody}>{item.body}</Text>
            <Text style={styles.notificationSentTo}>Sent to: {item.sentTo}</Text>
        </Card>
    );

    if (notificationsQuery.isLoading) {
        return <Loading text="Loading notifications..." />;
    }

    if (notificationsQuery.error) {
        return (
            <ErrorView
                message="Failed to load notifications"
                onRetry={() => notificationsQuery.refetch()}
            />
        );
    }

    const notifications = notificationsQuery.data || [];

    return (
        <SafeAreaView style={styles.container} edges={['bottom']}>
            <ScrollView
                style={styles.scrollView}
                contentContainerStyle={styles.scrollContent}
                refreshControl={
                    <RefreshControl
                        refreshing={false}
                        onRefresh={() => notificationsQuery.refetch()}
                        tintColor={Colors.dark.primary}
                    />
                }
            >
                <Card style={styles.sendCard}>
                    <View style={styles.sendHeader}>
                        <Send size={24} color={Colors.dark.primary} />
                        <Text style={styles.sendTitle}>Send Notification to All</Text>
                    </View>

                    <View style={styles.inputContainer}>
                        <Text style={styles.inputLabel}>Title</Text>
                        <TextInput
                            style={styles.input}
                            placeholder="Notification title"
                            placeholderTextColor={Colors.dark.textMuted}
                            value={title}
                            onChangeText={setTitle}
                            editable={!sendMutation.isPending}
                        />
                    </View>

                    <View style={styles.inputContainer}>
                        <Text style={styles.inputLabel}>Body</Text>
                        <TextInput
                            style={[styles.input, styles.textArea]}
                            placeholder="Notification message"
                            placeholderTextColor={Colors.dark.textMuted}
                            value={body}
                            onChangeText={setBody}
                            multiline
                            numberOfLines={4}
                            editable={!sendMutation.isPending}
                        />
                    </View>

                    <Button
                        title="Send to All Users"
                        onPress={handleSend}
                        loading={sendMutation.isPending}
                        disabled={!title || !body}
                    />
                </Card>

                <View style={styles.historyHeader}>
                    <Text style={styles.historyTitle}>Notification History</Text>
                    <Text style={styles.historyCount}>{notifications.length} sent</Text>
                </View>

                {notifications.length === 0 ? (
                    <Card style={styles.emptyCard}>
                        <Bell size={48} color={Colors.dark.textMuted} />
                        <Text style={styles.emptyText}>No notifications sent yet</Text>
                    </Card>
                ) : (
                    notifications.map((notification) => (
                        <View key={notification.id}>
                            {renderNotification({ item: notification })}
                        </View>
                    ))
                )}
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
    sendCard: {
        gap: 16,
    },
    sendHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
    },
    sendTitle: {
        fontSize: 18,
        fontWeight: '600' as const,
        color: Colors.dark.text,
    },
    inputContainer: {
        gap: 8,
    },
    inputLabel: {
        fontSize: 14,
        fontWeight: '600' as const,
        color: Colors.dark.textSecondary,
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
    },
    textArea: {
        minHeight: 100,
        textAlignVertical: 'top',
    },
    historyHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 4,
    },
    historyTitle: {
        fontSize: 18,
        fontWeight: '600' as const,
        color: Colors.dark.text,
    },
    historyCount: {
        fontSize: 14,
        color: Colors.dark.textSecondary,
    },
    notificationCard: {
        gap: 8,
    },
    notificationHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    notificationDate: {
        fontSize: 12,
        color: Colors.dark.textMuted,
    },
    notificationTitle: {
        fontSize: 16,
        fontWeight: '600' as const,
        color: Colors.dark.text,
    },
    notificationBody: {
        fontSize: 14,
        color: Colors.dark.textSecondary,
        lineHeight: 20,
    },
    notificationSentTo: {
        fontSize: 12,
        color: Colors.dark.textMuted,
        fontStyle: 'italic' as const,
    },
    emptyCard: {
        alignItems: 'center',
        paddingVertical: 40,
        gap: 16,
    },
    emptyText: {
        fontSize: 16,
        color: Colors.dark.textMuted,
    },
});
