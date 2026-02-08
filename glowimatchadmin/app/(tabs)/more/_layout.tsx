import { Stack } from 'expo-router';
import React from 'react';

import Colors from '@/constants/colors';

export default function MoreLayout() {
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
          title: 'More',
          headerLargeTitle: true,
        }}
      />
      <Stack.Screen
        name="messages"
        options={{
          title: 'Messages',
        }}
      />
      <Stack.Screen
        name="notifications"
        options={{
          title: 'Notifications',
        }}
      />
      <Stack.Screen
        name="sessions"
        options={{
          title: 'Sessions',
        }}
      />
      <Stack.Screen
        name="safety"
        options={{
          title: 'Safety',
        }}
      />
    </Stack>
  );
}