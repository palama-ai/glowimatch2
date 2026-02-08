import { useQuery } from '@tanstack/react-query';
import { useRouter } from 'expo-router';
import React from 'react';
import {
    FlatList,
    RefreshControl,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Mail, MailOpen } from 'lucide-react-native';

import Card from '@/components/Card';
import ErrorView from '@/components/ErrorView';
import Loading from '@/components/Loading';
import Colors from '@/constants/colors';
import { api } from '@/services/api';
import { Message } from '@/types';

export default function MessagesScreen() {
    const router = useRouter();

    const messagesQuery = useQuery<Message[]>({
        queryKey: ['admin', 'messages'],
        queryFn: async () => {
            const response = await api.get('/admin/messages');
            // Backend returns { data: messages[] }
            return response.data.data || [];
        },
    });

    const renderMessage = ({ item }: { item: Message }) => (
        <TouchableOpacity
            onPress={() => router.push(`/message-detail?id=${item.id}` as any)}
            style={styles.messageItem}
        >
            <Card style={[styles.messageCard, !item.read && styles.unreadCard]}>
                <View style={styles.messageHeader}>
                    {item.read ? (
                        <MailOpen size={20} color={Colors.dark.textSecondary} />
                    ) : (
                        <Mail size={20} color={Colors.dark.primary} />
                    )}
                    <View style={styles.messageInfo}>
                        <Text style={[styles.messageName, !item.read && styles.unreadText]}>
                            {item.name}
                        </Text>
                        <Text style={styles.messageEmail}>{item.email}</Text>
                    </View>
                    <Text style={styles.messageDate}>
                        {new Date(item.createdAt).toLocaleDateString()}
                    </Text>
                </View>
                <Text style={styles.messageSubject}>{item.subject}</Text>
                <Text style={styles.messagePreview} numberOfLines={2}>
                    {item.message}
                </Text>
            </Card>
        </TouchableOpacity>
    );

    if (messagesQuery.isLoading) {
        return <Loading text="Loading messages..." />;
    }

    if (messagesQuery.error) {
        return (
            <ErrorView
                message="Failed to load messages"
                onRetry={() => messagesQuery.refetch()}
            />
        );
    }

    const messages = messagesQuery.data || [];
    const unreadCount = messages.filter((m) => !m.read).length;

    return (
        <SafeAreaView style={styles.container} edges={['bottom']}>
            <View style={styles.header}>
                <Text style={styles.title}>Messages</Text>
                {unreadCount > 0 && (
                    <View style={styles.unreadBadge}>
                        <Text style={styles.unreadBadgeText}>{unreadCount} unread</Text>
                    </View>
                )}
            </View>

            <FlatList
                data={messages}
                renderItem={renderMessage}
                keyExtractor={(item) => item.id}
                contentContainerStyle={styles.list}
                refreshControl={
                    <RefreshControl
                        refreshing={false}
                        onRefresh={() => messagesQuery.refetch()}
                        tintColor={Colors.dark.primary}
                    />
                }
                ListEmptyComponent={
                    <View style={styles.emptyContainer}>
                        <Mail size={48} color={Colors.dark.textMuted} />
                        <Text style={styles.emptyText}>No messages yet</Text>
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
    unreadBadge: {
        backgroundColor: Colors.dark.primary,
        borderRadius: 12,
        paddingHorizontal: 12,
        paddingVertical: 6,
    },
    unreadBadgeText: {
        fontSize: 12,
        fontWeight: '600' as const,
        color: Colors.dark.text,
    },
    list: {
        padding: 16,
        gap: 12,
    },
    messageItem: {
        marginBottom: 0,
    },
    messageCard: {
        gap: 8,
    },
    unreadCard: {
        borderColor: Colors.dark.primary,
        borderWidth: 2,
    },
    messageHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
    },
    messageInfo: {
        flex: 1,
    },
    messageName: {
        fontSize: 16,
        fontWeight: '600' as const,
        color: Colors.dark.text,
    },
    unreadText: {
        fontWeight: '700' as const,
    },
    messageEmail: {
        fontSize: 14,
        color: Colors.dark.textSecondary,
    },
    messageDate: {
        fontSize: 12,
        color: Colors.dark.textMuted,
    },
    messageSubject: {
        fontSize: 15,
        fontWeight: '500' as const,
        color: Colors.dark.text,
    },
    messagePreview: {
        fontSize: 14,
        color: Colors.dark.textSecondary,
        lineHeight: 20,
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
});