import { apiClient } from '@/hooks/baseApi';
import { Department } from '@/types';

export const fetchDepartments = async (): Promise<Department[]> => {
    const response = await apiClient.get('department/');
    return response.data as Array<Department>;
};