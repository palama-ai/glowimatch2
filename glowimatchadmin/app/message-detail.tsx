import { useMutation, useQuery } from '@tanstack/react-query';
import { useLocalSearchParams, useRouter } from 'expo-router';
import * as Linking from 'expo-linking';
import React from 'react';
import {
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Mail, X } from 'lucide-react-native';

import Button from '@/components/Button';
import Card from '@/components/Card';
import Loading from '@/components/Loading';
import Colors from '@/constants/colors';
import { api } from '@/services/api';
import { Message } from '@/types';

export default function MessageDetailScreen() {
    const { id } = useLocalSearchParams<{ id: string }>();
    const router = useRouter();

    const messageQuery = useQuery<Message>({
        queryKey: ['admin', 'messages', id],
        queryFn: async () => {
            const response = await api.get(`/admin/messages/${id}`);
            // Backend returns { data: message }
            return response.data.data;
        },
        enabled: !!id,
    });

    const markAsReadMutation = useMutation({
        mutationFn: async () => {
            const response = await api.patch(`/admin/messages/${id}/read`);
            return response.data;
        },
    });

    const { mutate: markAsRead } = markAsReadMutation;

    React.useEffect(() => {
        if (messageQuery.data && !messageQuery.data.read) {
            markAsRead();
        }
    }, [messageQuery.data, markAsRead]);

    const handleReply = () => {
        if (messageQuery.data) {
            const subject = `Re: ${messageQuery.data.subject}`;
            const mailtoUrl = `mailto:${messageQuery.data.email}?subject=${encodeURIComponent(subject)}`;
            Linking.openURL(mailtoUrl);
        }
    };

    if (messageQuery.isLoading) {
        return <Loading text="Loading message..." />;
    }

    if (!messageQuery.data) {
        return (
            <View style={styles.errorContainer}>
                <Text style={styles.errorText}>Message not found</Text>
            </View>
        );
    }

    const message = messageQuery.data;

    return (
        <SafeAreaView style={styles.container} edges={['bottom']}>
            <View style={styles.header}>
                <Text style={styles.title}>Message</Text>
                <TouchableOpacity onPress={() => router.back()} style={styles.closeButton}>
                    <X size={24} color={Colors.dark.text} />
                </TouchableOpacity>
            </View>

            <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
                <Card style={styles.metaCard}>
                    <View style={styles.metaRow}>
                        <Text style={styles.metaLabel}>From:</Text>
                        <Text style={styles.metaValue}>{message.name}</Text>
                    </View>
                    <View style={styles.metaRow}>
                        <Text style={styles.metaLabel}>Email:</Text>
                        <Text style={styles.metaEmail}>{message.email}</Text>
                    </View>
                    <View style={styles.metaRow}>
                        <Text style={styles.metaLabel}>Date:</Text>
                        <Text style={styles.metaValue}>
                            {new Date(message.createdAt).toLocaleString()}
                        </Text>
                    </View>
                </Card>

                <Card style={styles.subjectCard}>
                    <Text style={styles.subjectLabel}>Subject:</Text>
                    <Text style={styles.subjectText}>{message.subject}</Text>
                </Card>

                <Card style={styles.messageCard}>
                    <Text style={styles.messageLabel}>Message:</Text>
                    <Text style={styles.messageText}>{message.message}</Text>
                </Card>

                <Button
                    title="Reply via Email"
                    onPress={handleReply}
                    icon={<Mail size={20} color={Colors.dark.text} />}
                />
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
    metaCard: {
        gap: 12,
    },
    metaRow: {
        flexDirection: 'row',
        gap: 8,
    },
    metaLabel: {
        fontSize: 14,
        fontWeight: '600' as const,
        color: Colors.dark.textSecondary,
        width: 60,
    },
    metaValue: {
        flex: 1,
        fontSize: 14,
        color: Colors.dark.text,
    },
    metaEmail: {
        flex: 1,
        fontSize: 14,
        color: Colors.dark.primary,
    },
    subjectCard: {
        gap: 8,
    },
    subjectLabel: {
        fontSize: 14,
        fontWeight: '600' as const,
        color: Colors.dark.textSecondary,
    },
    subjectText: {
        fontSize: 18,
        fontWeight: '600' as const,
        color: Colors.dark.text,
    },
    messageCard: {
        gap: 12,
    },
    messageLabel: {
        fontSize: 14,
        fontWeight: '600' as const,
        color: Colors.dark.textSecondary,
    },
    messageText: {
        fontSize: 16,
        color: Colors.dark.text,
        lineHeight: 24,
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