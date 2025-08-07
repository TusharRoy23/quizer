import { apiClient } from "@/hooks/baseApi";
import { PaginatedResponse, Quiz, QuizRequest, QuizResult, QuizTimer } from "@/types";
import { CommonService } from "./commonService"

export const QuizService = {
    getQuizList: async (uuid: string) => {
        const response = await apiClient.get<Quiz[]>(`question/quiz/${uuid}/`);
        return response.data;
    },
    saveQuiz: async (logUuid: string, answer: { uuid: string, answers: number[] }): Promise<Quiz> => {
        const response = await apiClient.post<Quiz>(`question/quiz/${logUuid}/save/`, answer);
        return response.data;
    },
    generateQuiz: async (payload: QuizRequest): Promise<string> => {
        const response = await apiClient.post<string>('question/quiz/generate/', payload);
        return response.data;
    },
    submitQuiz: async (logUuid: string): Promise<string> => {
        const response = await apiClient.post<string>(`question/quiz/${logUuid}/submit/`);
        return response.data;
    },
    getQuizResult: async (logUuid: string): Promise<QuizResult> => {
        const response = await apiClient.get<QuizResult>(`question/quiz/${logUuid}/result/`);
        return response.data;
    },

    getQuizLogList: async ({ page, limit }: { page: number, limit: number } = { page: 1, limit: 10 }): Promise<PaginatedResponse<QuizResult>> => {
        return CommonService.createPaginationFetcher<QuizResult>()('question/logs', page, limit);
    },
    getQuizLogs: async (logUuid: string): Promise<Quiz[]> => {
        const response = await apiClient.get<Quiz[]>(`question/logs/${logUuid}`);
        return response.data;
    },
    getQuizTimer: async (logUuid: string): Promise<QuizTimer> => {
        const response = await apiClient.get<QuizTimer>(`question/quiz/${logUuid}/timer`);
        return response.data;
    }
};