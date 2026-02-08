import { api, secureStorePolyfill } from './api';

import { REMEMBER_ME_KEY, TOKEN_KEY } from '@/constants/config';
import { AuthResponse } from '@/types';

export const authService = {
    async login(email: string, password: string, rememberMe: boolean): Promise<AuthResponse> {
        // Use the main auth login endpoint (same for all users including admin)
        const response = await api.post('/auth/login', {
            email,
            password,
        });

        // Backend returns { data: { user, token } }
        const { token, user } = response.data.data;

        // Check if user is admin
        if (user.role !== 'admin') {
            throw new Error('Access denied. Admin privileges required.');
        }

        await secureStorePolyfill.setItemAsync(TOKEN_KEY, token);
        await secureStorePolyfill.setItemAsync(REMEMBER_ME_KEY, rememberMe ? 'true' : 'false');

        return { token, user };
    },

    async logout(): Promise<void> {
        await secureStorePolyfill.deleteItemAsync(TOKEN_KEY);
    },

    async getToken(): Promise<string | null> {
        return secureStorePolyfill.getItemAsync(TOKEN_KEY);
    },

    async isRemembered(): Promise<boolean> {
        const remembered = await secureStorePolyfill.getItemAsync(REMEMBER_ME_KEY);
        return remembered === 'true';
    },
};
