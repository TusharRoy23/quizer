import { Department, Topic } from "@/types";
import { topicList } from "@/utils/data";

export const fetchTopics = async (department: Department): Promise<Topic[]> => {
    const response = new Promise<Topic[]>((resolve) => {
        setTimeout(() => {
            resolve(topicList.filter((topic) => topic.department.uuid === department.uuid));
        }, 1000);
    });
    return response;
}