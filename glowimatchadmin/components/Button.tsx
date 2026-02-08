import React from 'react';
import { ActivityIndicator, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import Colors from '@/constants/colors';

interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'danger' | 'success';
  disabled?: boolean;
  loading?: boolean;
  icon?: React.ReactNode;
}

export default function Button({ 
  title, 
  onPress, 
  variant = 'primary', 
  disabled = false, 
  loading = false,
  icon 
}: ButtonProps) {
  const buttonStyle = [
    styles.button,
    variant === 'primary' && styles.buttonPrimary,
    variant === 'secondary' && styles.buttonSecondary,
    variant === 'danger' && styles.buttonDanger,
    variant === 'success' && styles.buttonSuccess,
    (disabled || loading) && styles.buttonDisabled,
  ];

  return (
    <TouchableOpacity style={buttonStyle} onPress={onPress} disabled={disabled || loading}>
      {loading ? (
        <ActivityIndicator color={Colors.dark.text} />
      ) : (
        <View style={styles.content}>
          {icon}
          <Text style={styles.buttonText}>{title}</Text>
        </View>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    height: 48,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 16,
  },
  buttonPrimary: {
    backgroundColor: Colors.dark.primary,
  },
  buttonSecondary: {
    backgroundColor: Colors.dark.surfaceLight,
  },
  buttonDanger: {
    backgroundColor: Colors.dark.error,
  },
  buttonSuccess: {
    backgroundColor: Colors.dark.success,
  },
  buttonDisabled: {
    opacity: 0.5,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: '600' as const,
    color: Colors.dark.text,
  },
});
