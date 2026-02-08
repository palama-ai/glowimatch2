import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Stack, useRouter, useSegments } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import React, { useEffect } from "react";
import { GestureHandlerRootView } from "react-native-gesture-handler";

import { AuthProvider, useAuth } from "@/contexts/AuthContext";

SplashScreen.preventAutoHideAsync();

const queryClient = new QueryClient();

function RootLayoutNav() {
  const { isAuthenticated, isLoading, user, pendingEmail } = useAuth();
  const segments = useSegments();
  const router = useRouter();

  useEffect(() => {
    if (isLoading) return;

    const currentRoute = segments[0];
    const inAuthGroup = currentRoute === '(tabs)';
    const inLoginGroup = currentRoute === 'login' || currentRoute === 'signup';
    const inVerifyScreen = currentRoute === 'verify-email';
    const inTermsScreen = currentRoute === 'accept-terms';
    const inProductScreens = currentRoute === 'add-product' || currentRoute === 'edit-product';

    // If there's a pending email (signup in progress), stay on verify-email
    if (pendingEmail && !isAuthenticated) {
      if (!inVerifyScreen) {
        router.replace('/verify-email');
      }
      return;
    }

    if (!isAuthenticated) {
      // Not authenticated - redirect to login unless already there
      if (!inLoginGroup && !inVerifyScreen) {
        router.replace('/login');
      }
    } else {
      // Authenticated - check terms and redirect accordingly
      if (!user?.termsAccepted) {
        if (!inTermsScreen) {
          router.replace('/accept-terms');
        }
      } else if (!inAuthGroup && !inProductScreens) {
        // Only redirect to tabs if not in tabs or product screens
        router.replace('/(tabs)');
      }
    }
  }, [isAuthenticated, isLoading, segments, user, pendingEmail, router]);

  return (
    <Stack screenOptions={{ headerBackTitle: "Back" }}>
      <Stack.Screen name="index" options={{ headerShown: false }} />
      <Stack.Screen name="login" options={{ headerShown: false }} />
      <Stack.Screen name="signup" options={{ headerShown: false }} />
      <Stack.Screen name="verify-email" options={{ headerShown: false }} />
      <Stack.Screen name="accept-terms" options={{ headerShown: false }} />
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      <Stack.Screen name="add-product" options={{ title: "Add Product" }} />
      <Stack.Screen name="edit-product" options={{ title: "Edit Product" }} />
    </Stack>
  );
}

export default function RootLayout() {
  useEffect(() => {
    SplashScreen.hideAsync();
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <GestureHandlerRootView style={{ flex: 1 }}>
          <RootLayoutNav />
        </GestureHandlerRootView>
      </AuthProvider>
    </QueryClientProvider>
  );
}
