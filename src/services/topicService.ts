import { apiClient } from "@/hooks/baseApi";
import { Department, Topic } from "@/types";

export const fetchTopics = async (department: Department): Promise<Topic[]> => {
    const response = await apiClient.get<Topic[]>(`department/topic/${department.uuid}/`);
    return response.data;
}