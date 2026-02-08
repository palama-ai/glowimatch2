import createContextHook from '@nkzw/create-context-hook';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { router } from 'expo-router';
import { useState, useEffect, useCallback } from 'react';
import { Alert, Platform } from 'react-native';

import { api, getToken, removeToken, setToken, handleApiError } from '@/lib/api';
import {
  User,
  LoginRequest,
  SignupRequest,
  VerifyEmailRequest,
  AcceptTermsRequest,
  ApiResponse,
} from '@/types';

export const [AuthProvider, useAuth] = createContextHook(() => {
  const [isReady, setIsReady] = useState<boolean>(false);
  const [pendingEmail, setPendingEmail] = useState<string>('');
  const queryClient = useQueryClient();

  // Fetch current user from session
  const userQuery = useQuery<User | null>({
    queryKey: ['user'],
    queryFn: async () => {
      const token = await getToken();
      if (!token) return null;

      try {
        const response = await api.get<ApiResponse<{ session: { user: User } | null }>>('/auth/session');
        return response.data.data?.session?.user || null;
      } catch (error) {
        console.error('Failed to fetch user:', error);
        await removeToken();
        return null;
      }
    },
    staleTime: 5 * 60 * 1000,
  });

  useEffect(() => {
    if (userQuery.isFetched) {
      setIsReady(true);
    }
  }, [userQuery.isFetched]);

  // LOGIN: Existing users go directly to app (or terms if not accepted)
  const loginMutation = useMutation({
    mutationFn: async (credentials: LoginRequest) => {
      const response = await api.post<ApiResponse<{ token: string; user: User }>>('/auth/login', credentials);
      return response.data.data!;
    },
    onSuccess: async (data) => {
      await setToken(data.token);
      queryClient.setQueryData(['user'], data.user);

      // Login: If terms already accepted, go to main app; otherwise go to terms
      if (data.user.termsAccepted) {
        router.replace('/(tabs)');
      } else {
        router.replace('/accept-terms');
      }
    },
    onError: (error: unknown) => {
      const message = handleApiError(error);
      if (Platform.OS === 'web') {
        alert(message);
      } else {
        Alert.alert('Login Failed', message);
      }
    },
  });

  // SIGNUP: New users go to verification first, then terms
  const signupMutation = useMutation({
    mutationFn: async (data: SignupRequest) => {
      const response = await api.post<ApiResponse<{ message: string; email: string }>>('/auth/signup', {
        ...data,
        accountType: 'seller'
      });
      return response.data.data!;
    },
    onSuccess: (data) => {
      // Store email for verification screen
      setPendingEmail(data.email);
      // New users must verify email first
      router.replace('/verify-email');
    },
    onError: (error: unknown) => {
      const message = handleApiError(error);
      if (Platform.OS === 'web') {
        alert(message);
      } else {
        Alert.alert('Signup Failed', message);
      }
    },
  });

  // VERIFY EMAIL: After verification, go to terms
  const verifyEmailMutation = useMutation({
    mutationFn: async (data: VerifyEmailRequest) => {
      const response = await api.post<ApiResponse<{ token: string; user: User }>>('/auth/verify-email', data);
      return response.data.data!;
    },
    onSuccess: async (data) => {
      await setToken(data.token);
      queryClient.setQueryData(['user'], data.user);

      // After verification, go to terms (new users must accept terms)
      router.replace('/accept-terms');
    },
    onError: (error: unknown) => {
      const message = handleApiError(error);
      if (Platform.OS === 'web') {
        alert(message);
      } else {
        Alert.alert('Verification Failed', message);
      }
    },
  });

  // ACCEPT TERMS: After accepting, go to main app
  const acceptTermsMutation = useMutation({
    mutationFn: async (data: AcceptTermsRequest) => {
      const response = await api.post<{ success: boolean; message: string }>('/seller/accept-terms', data);
      return response.data;
    },
    onSuccess: () => {
      // Update local user data to mark terms as accepted
      const currentUser = queryClient.getQueryData<User>(['user']);
      if (currentUser) {
        queryClient.setQueryData(['user'], { ...currentUser, termsAccepted: true });
      }
      router.replace('/(tabs)');
    },
    onError: (error: unknown) => {
      const message = handleApiError(error);
      if (Platform.OS === 'web') {
        alert(message);
      } else {
        Alert.alert('Error', message);
      }
    },
  });

  // RESEND VERIFICATION CODE
  const resendVerificationMutation = useMutation({
    mutationFn: async (email: string) => {
      const response = await api.post<ApiResponse<{ message: string }>>('/auth/resend-verification', { email });
      return response.data.data!;
    },
    onSuccess: () => {
      if (Platform.OS === 'web') {
        alert('Verification code sent! Check your email.');
      } else {
        Alert.alert('Success', 'Verification code sent! Check your email.');
      }
    },
    onError: (error: unknown) => {
      const message = handleApiError(error);
      if (Platform.OS === 'web') {
        alert(message);
      } else {
        Alert.alert('Error', message);
      }
    },
  });

  // LOGOUT
  const logout = useCallback(async () => {
    await removeToken();
    queryClient.setQueryData(['user'], null);
    queryClient.clear();
    setPendingEmail('');
    router.replace('/login');
  }, [queryClient]);

  return {
    user: userQuery.data || null,
    isLoading: userQuery.isLoading || !isReady,
    isAuthenticated: !!userQuery.data,
    pendingEmail,
    login: loginMutation.mutate,
    signup: signupMutation.mutate,
    verifyEmail: verifyEmailMutation.mutate,
    resendVerification: resendVerificationMutation.mutate,
    acceptTerms: acceptTermsMutation.mutate,
    logout,
    isLoginLoading: loginMutation.isPending,
    isSignupLoading: signupMutation.isPending,
    isVerifyLoading: verifyEmailMutation.isPending,
    isResendLoading: resendVerificationMutation.isPending,
    isAcceptTermsLoading: acceptTermsMutation.isPending,
  };
});