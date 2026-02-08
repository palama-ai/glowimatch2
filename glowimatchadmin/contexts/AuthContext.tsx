import createContextHook from '@nkzw/create-context-hook';
import { useRouter, useSegments } from 'expo-router';
import { useEffect, useState } from 'react';

import { authService } from '@/services/auth';
import { User } from '@/types';

interface AuthContextValue {
    user: User | null;
    isLoading: boolean;
    isAuthenticated: boolean;
    login: (email: string, password: string, rememberMe: boolean) => Promise<void>;
    logout: () => Promise<void>;
}

export const [AuthProvider, useAuth] = createContextHook((): AuthContextValue => {
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const router = useRouter();
    const segments = useSegments();

    useEffect(() => {
        const checkAuth = async () => {
            try {
                const token = await authService.getToken();
                if (token) {
                    setUser({
                        id: 'admin',
                        email: 'admin@glowimatch.com',
                        name: 'Admin',
                        role: 'admin',
                        disabled: false,
                        createdAt: new Date().toISOString()
                    });
                }
            } catch (error) {
                console.error('Auth check failed:', error);
            } finally {
                setIsLoading(false);
            }
        };

        checkAuth();
    }, []);

    useEffect(() => {
        if (isLoading) return;

        const inAuthGroup = segments[0] === '(auth)';

        if (!user && !inAuthGroup) {
            router.replace('/login' as any);
        } else if (user && inAuthGroup) {
            router.replace('/' as any);
        }
    }, [user, segments, isLoading, router]);

    const login = async (email: string, password: string, rememberMe: boolean) => {
        try {
            const response = await authService.login(email, password, rememberMe);
            // Map full_name to name for compatibility
            const userWithName = {
                ...response.user,
                name: response.user.full_name || response.user.email,
                disabled: response.user.disabled ?? false,
            };
            setUser(userWithName);
            router.replace('/' as any);
        } catch (error) {
            console.error('Login failed:', error);
            throw error;
        }
    };

    const logout = async () => {
        try {
            await authService.logout();
            setUser(null);
            router.replace('/login' as any);
        } catch (error) {
            console.error('Logout failed:', error);
        }
    };

    return {
        user,
        isLoading,
        isAuthenticated: !!user,
        login,
        logout,
    };
});
