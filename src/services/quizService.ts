import { apiClient } from "@/hooks/baseApi";
import { Quiz, QuizLog, QuizRequest, QuizResult } from "@/types";

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
    getQuizLogList: async (): Promise<QuizLog[]> => {
        const response = await apiClient.get<QuizLog[]>(`question/logs`);
        return response.data;
    }
};