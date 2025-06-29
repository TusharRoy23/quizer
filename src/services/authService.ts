import { apiClient } from '@/hooks/baseApi';

export const checkAuthentication = async (): Promise<any> => {
    const response = await apiClient.get('user/auth/check');
    if (response.status !== 200) {
        throw new Error('Authentication check failed');
    }
    return response.data;
};