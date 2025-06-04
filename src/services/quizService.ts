import { apiClient } from "@/hooks/baseApi";
import { Quiz, QuizRequest, QuizResult } from "@/types";
const quizList: Quiz[] = [
    // {
    //     uuid: "1",
    //     question: "What is the capital of France?",
    //     answer: "",
    //     options: [
    //         { name: "Paris", value: "Paris" },
    //         { name: "London", value: "London" },
    //         { name: "Berlin", value: "Berlin" },
    //         { name: "Madrid", value: "Madrid" }
    //     ],
    //     difficulty: { name: "easy", value: "easy" }
    // },
    // {
    //     uuid: "2",
    //     question: "What is 2 + 2?",
    //     answer: "",
    //     options: [
    //         { name: "3", value: "3" },
    //         { name: "4", value: "4" },
    //         { name: "5", value: "5" },
    //         { name: "6", value: "6" }
    //     ],
    //     difficulty: { name: "easy", value: "easy" }
    // }
]
let pageNum = 0;

export const QuizService = {
    getQuizList: async (uuid: string) => {
        const response = await apiClient.get<Quiz[]>(`question/${uuid}/`);
        return response.data;
    },
    getQuiz: async (pageNum: number) => {
        const response = new Promise<Quiz>((resolve) => {
            setTimeout(() => {
                if (pageNum < 0 || pageNum >= quizList.length) {
                    resolve(quizList[0]);
                    return;
                }
                resolve(quizList[pageNum]);
            }, 1000);
        });
        return response;
    },
    saveQuiz: async (logUuid: string, answer: { uuid: string, answers: number[] }): Promise<Quiz> => {
        const response = await apiClient.post<Quiz>(`question/${logUuid}/save/`, answer);
        return response.data;
    },
    generateQuiz: async (payload: QuizRequest): Promise<string> => {
        const response = await apiClient.post<string>('question/generate/', payload);
        return response.data;
    },
    submitQuiz: async (logUuid: string): Promise<string> => {
        const response = await apiClient.post<string>(`question/${logUuid}/submit/`);
        return response.data;
    },
    getQuizResult: async (logUuid: string): Promise<QuizResult> => {
        const response = await apiClient.get<QuizResult>(`question/${logUuid}/result/`);
        return response.data;
    }
};

export const fetchQuizes = async (pageStep: number = 0): Promise<Quiz> => {
    const response = new Promise<Quiz>((resolve) => {
        setTimeout(() => {
            if (pageNum + pageStep < 0 || pageNum + pageStep >= quizList.length) {
                resolve(quizList[pageNum]);
                return;
            }
            resolve(quizList[pageNum + pageStep]);
            pageNum += pageStep;
        }, 1000);
    });
    return response;
}