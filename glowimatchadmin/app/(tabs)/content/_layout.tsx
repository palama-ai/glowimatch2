import { Stack } from 'expo-router';
import React from 'react';

import Colors from '@/constants/colors';

export default function ContentLayout() {
  return (
    <Stack
      screenOptions={{
        headerStyle: {
          backgroundColor: Colors.dark.surface,
        },
        headerTintColor: Colors.dark.text,
      }}
    >
      <Stack.Screen
        name="index"
        options={{
          title: 'Content',
          headerLargeTitle: true,
        }}
      />
    </Stack>
  );
}