import { db } from "@/hooks/db";
import { Quiz } from "@/utils/types";

export const ClientDBService = {
    getQuiz: async (uuid: string) => {
        return await db.quiz.get(uuid);
    },
    getAllQuizzes: async (): Promise<Quiz[]> => {
        return await db.quiz.toArray();
    },
    saveAllQuizzes: async (quizData: Quiz[]) => {
        await db.quiz.bulkPut(quizData);
    },
    saveQuizAnswer: async (quizData: Quiz) => {
        await db.quiz.put(quizData);
    },
    clearAllQuizzes: async () => {
        await db.quiz.clear();
    }
};