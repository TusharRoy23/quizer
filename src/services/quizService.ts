import { apiClient, callRefreshToken, isAccessTokenExpiringSoon } from "@/hooks/baseApi";
import { PaginatedResponse, QuestionKeyword, Quiz, QuizRequest, QuizResult, QuizTimer } from "@/utils/types";
import { CommonService } from "./commonService"
import { env } from "@/lib/env";

// Create a utility function to check and refresh token
const ensureValidToken = async (): Promise<void> => {
    if (localStorage.getItem("accessTokenExpiry") && isAccessTokenExpiringSoon()) {
        await callRefreshToken();
    }
};

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
    },
    getQuestionKeywordsByUuid: async (uuid: string): Promise<QuestionKeyword[]> => {
        const response = await apiClient.get<QuestionKeyword[]>(`question/keywords/${uuid}/`);
        return response.data;
    },
    getKeywordDetails: async (keywordUuid: string): Promise<QuestionKeyword> => {
        const response = await apiClient.get<QuestionKeyword>(`question/keywords/details/${keywordUuid}/`);
        return response.data;
    },
    getKeywordExample: async (keywordUuid: string): Promise<string> => {
        const response = await apiClient.get<string>(`question/keywords/example/${keywordUuid}/`);
        return response.data;
    },
    getLatestOnGoingQuiz: async (): Promise<QuizResult> => {
        const response = await apiClient.get<QuizResult>(`question/ongoing/quiz/`);
        return response.data;
    },
    checkIfParticipatedInQuiz: async (): Promise<boolean> => {
        const response = await apiClient.get<boolean>(`question/participated/`);
        return response.data;
    },
    getExplanationForQuestion: async (questionUuid: string): Promise<string> => {
        const response = await apiClient.get<string>(`question/explanation/${questionUuid}/`);
        return response.data;
    },
    getStreamedExplanationForQuestion: async (
        apiUrl: string,
        onComplete: (fullText: string) => void, // Changed from onData to onComplete
        onChunk: (chunk: string) => void,
        onError: (error: Error) => void
    ): Promise<() => void> => {
        let reader: ReadableStreamDefaultReader<Uint8Array> | null = null;
        try {
            // Ensure we have a valid token before making the request
            await ensureValidToken();
            const response = await fetch(`${env.apiUrl}/question/explanation/${apiUrl}`, {
                method: 'GET',
                credentials: 'include',
            });

            if (!response.ok) {
                throw new Error(`Stream failed: ${response.status} ${response.statusText}`);
            }

            if (!response.body) {
                throw new Error('Response body is null');
            }

            reader = response.body.getReader();
            const decoder = new TextDecoder();
            let fullText = '';

            const processStream = async () => {
                try {
                    while (true) {
                        const { done, value } = await reader!.read();

                        if (done) {
                            onComplete(fullText); // Send complete text at once
                            break;
                        }

                        const textChunk = decoder.decode(value, { stream: true });
                        fullText += textChunk;
                        onChunk(textChunk);
                    }
                } catch (error) {
                    onError(error as Error);
                } finally {
                    reader!.releaseLock();
                }
            };

            processStream();

            return () => {
                reader!.cancel().catch(() => { });
            };

        } catch (error) {
            onError(error as Error);
            return () => { };
        }
    }
};