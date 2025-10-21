"use client";
import Quiz from "@/components/verbal/Quiz";
import { QuizService } from "@/services/quizService";
import { OralQuestion } from "@/utils/types";
import { useQuery } from "@tanstack/react-query";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { useCallback, useState } from "react";
import { motion } from "framer-motion";

export default function VerbalQuiz() {
    const params = useParams();
    const router = useRouter();
    const queryParam = useSearchParams();
    const pageParam = queryParam.get("page");
    const uuid = params?.uuid as string || "";
    const [currentPage, setCurrentPage] = useState(pageParam ? Math.max(1, parseInt(pageParam)) : 1);

    const { data: quizList = [], isLoading, isError } = useQuery<OralQuestion[]>({
        queryKey: ["quizLogs", uuid],
        queryFn: () => QuizService.getVerbalQuestions(uuid),
        enabled: !!uuid,
        retry: 1,
    });

    const quiz = quizList[currentPage - 1];
    const isLastQuestion = currentPage >= quizList.length;

    const handlePageChange = useCallback((newPage: number) => {
        const validatedPage = Math.max(1, Math.min(newPage, quizList.length));
        setCurrentPage(validatedPage);
        router.push(`?page=${validatedPage}`);
    }, [quizList.length, router]);

    if (isLoading) {
        return (
            <div className="min-h-screen bg-gradient-to-br dark:from-gray-900 dark:to-gray-800 py-8 px-4">
                <div className="max-w-4xl mx-auto text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
                    <p className="text-gray-600 mt-4">Loading questions...</p>
                </div>
            </div>
        );
    }

    if (isError || !quiz) {
        return (
            <div className="min-h-screen bg-gradient-to-br dark:from-gray-900 dark:to-gray-800 py-8 px-4">
                <div className="max-w-4xl mx-auto text-center">
                    <h2 className="text-2xl font-bold text-red-600 mb-4">Error</h2>
                    <p className="text-gray-600">Failed to load questions. Please try again.</p>
                    <button
                        onClick={() => window.location.reload()}
                        className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-lg"
                    >
                        Retry
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br dark:from-gray-900 dark:to-gray-800 py-8 px-4">
            <div className="max-w-4xl mx-auto">
                {/* Progress indicator */}
                <div className="mb-6 flex items-center justify-between">
                    <div className="text-sm text-gray-600">
                        Question {currentPage} of {quizList.length}
                    </div>
                    <div className="w-32 bg-gray-200 rounded-full h-2">
                        <div
                            className="bg-blue-500 h-2 rounded-full transition-all"
                            style={{ width: `${(currentPage / quizList.length) * 100}%` }}
                        />
                    </div>
                </div>
                <motion.div layout className="p-6 bg-white rounded-lg shadow-lg max-w-2xl mx-auto">
                    <Quiz
                        quiz={quiz}
                        logUUID={uuid}
                        onNextQuestion={() => handlePageChange(currentPage + 1)}
                        isLastQuestion={isLastQuestion}
                        isFirstQuestion={currentPage == 1}
                    />
                </motion.div>
            </div>
        </div>
    );
}