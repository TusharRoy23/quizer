// import axios from 'axios';
import { Department } from '@/types';

const API_URL = '/api/departments';

const departmentList: Department[] = [
    { uuid: '1', name: 'HR' },
    { uuid: '2', name: 'Software Development' }
];

export const fetchDepartments = async (): Promise<Department[]> => {
    // const response = await axios.get(API_URL);
    const response = new Promise<Department[]>((resolve) => {
        setTimeout(() => {
            resolve(departmentList);
        }, 1000);
    });
    return response;
};