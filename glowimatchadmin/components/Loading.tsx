import React from 'react';
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';

import Colors from '@/constants/colors';

interface LoadingProps {
  text?: string;
}

export default function Loading({ text = 'Loading...' }: LoadingProps) {
  return (
    <View style={styles.container}>
      <ActivityIndicator size="large" color={Colors.dark.primary} />
      <Text style={styles.text}>{text}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.dark.background,
    gap: 16,
  },
  text: {
    fontSize: 16,
    color: Colors.dark.textSecondary,
  },
});