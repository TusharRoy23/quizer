import { apiClient } from '@/hooks/baseApi';
import { Authentication } from '@/utils/types';

export const AuthService = {
    checkAuthentication: async () => {
        const response = await apiClient.get<Authentication>('user/auth/check');
        if (response.status !== 200) {
            throw new Error('Authentication check failed');
        }
        return response.data;
    },
    logout: async () => {
        const response = await apiClient.get('user/auth/logout');
        if (response.status !== 200) {
            throw new Error('Logout failed');
        }
        return response.data;
    }
}