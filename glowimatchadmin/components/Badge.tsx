import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

import Colors from '@/constants/colors';

interface BadgeProps {
    label: string | undefined | null;
    variant?: 'default' | 'success' | 'warning' | 'error' | 'info';
}

export default function Badge({ label, variant = 'default' }: BadgeProps) {
    // Don't render if label is empty/undefined
    if (!label) {
        return null;
    }

    const badgeStyle = [
        styles.badge,
        variant === 'success' && styles.badgeSuccess,
        variant === 'warning' && styles.badgeWarning,
        variant === 'error' && styles.badgeError,
        variant === 'info' && styles.badgeInfo,
    ];

    return (
        <View style={badgeStyle}>
            <Text style={styles.badgeText}>{label}</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    badge: {
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 6,
        backgroundColor: Colors.dark.surfaceLight,
    },
    badgeSuccess: {
        backgroundColor: `${Colors.dark.success}20`,
    },
    badgeWarning: {
        backgroundColor: `${Colors.dark.warning}20`,
    },
    badgeError: {
        backgroundColor: `${Colors.dark.error}20`,
    },
    badgeInfo: {
        backgroundColor: `${Colors.dark.info}20`,
    },
    badgeText: {
        fontSize: 12,
        fontWeight: '600' as const,
        color: Colors.dark.text,
    },
});