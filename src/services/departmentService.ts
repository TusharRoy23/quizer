// import axios from 'axios';
import { Department } from '@/types';
import { departmentList } from '@/utils/data';

const API_URL = '/api/departments';

export const fetchDepartments = async (): Promise<Department[]> => {
    // const response = await axios.get(API_URL);
    const response = new Promise<Department[]>((resolve) => {
        setTimeout(() => {
            resolve(departmentList);
        }, 1000);
    });
    return response;
};