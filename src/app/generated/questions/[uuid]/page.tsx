"use client";
import Question from "@/components/quiz/question";
import Button from "@/components/ui/button/Button";
import { ChevronLeft, ChevronRight } from "@/icons";
import { QuizService } from "@/services/quizService";
import { Quiz } from "@/utils/types";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { useCallback, useEffect } from "react";
import KeywordPage from "@/components/quiz/keyword";
import ErrorDisplay from "@/components/error/errorDisplay";

const QuestionsPage = () => {
    const params = useParams();
    const searchParams = useSearchParams();
    const router = useRouter();
    const uuid = params?.uuid as string || "";

    // Get page from URL or default to 1
    const pageParam = searchParams.get("page");
    const currentPage = pageParam ? Math.max(1, parseInt(pageParam)) : 1;

    const { data: quizList = [], isLoading, error, isError } = useQuery<Quiz[]>({
        queryKey: ["quizLogs", uuid],
        queryFn: () => QuizService.getQuizLogs(uuid),
        enabled: !!uuid,
        retry: 1,
    });

    const quiz = quizList[currentPage - 1];

    const handlePageChange = useCallback((newPage: number) => {
        const validatedPage = Math.max(1, Math.min(newPage, quizList.length));
        router.push(`?page=${validatedPage}`);
    }, [quizList.length, router]);

    // Add keyboard navigation
    useEffect(() => {
        const handleKeyDown = (event: KeyboardEvent) => {
            // Only handle left/right arrows if we're not in an input field
            const isInputField = event.target instanceof HTMLInputElement ||
                event.target instanceof HTMLTextAreaElement;

            if (isInputField) return;

            switch (event.key) {
                case 'ArrowLeft':
                    if (currentPage > 1) {
                        event.preventDefault();
                        handlePageChange(currentPage - 1);
                    }
                    break;
                case 'ArrowRight':
                    if (currentPage < quizList.length) {
                        event.preventDefault();
                        handlePageChange(currentPage + 1);
                    }
                    break;
            }
        };

        window.addEventListener('keydown', handleKeyDown);

        // Cleanup
        return () => {
            window.removeEventListener('keydown', handleKeyDown);
        };
    }, [currentPage, quizList.length, handlePageChange]);

    useEffect(() => {
        if (quizList.length > 0 && currentPage > quizList.length) {
            handlePageChange(quizList.length);
        }
    }, [quizList.length, currentPage, handlePageChange]);

    if (isError) {
        return <ErrorDisplay
            title="Error"
            message={error?.message}
            onReturn={() => router.push("/")}
        />
    }

    return (
        <div className="max-w-4xl mx-auto px-4 py-6">
            {isLoading && <div className="text-center py-8">Loading questions...</div>}

            {quiz && (
                <>
                    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-6">
                        <Question quiz={quiz} onSelect={() => { }} canSelect={false} />

                        <div className="mt-6">
                            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-3">
                                Related Keywords
                            </h3>
                            <KeywordPage questionUuid={quiz.uuid} />
                        </div>
                    </div>

                    <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mt-6">
                        <div className="flex items-center gap-2">
                            <Button
                                size="sm"
                                variant="outline"
                                startIcon={<ChevronLeft />}
                                onClick={() => handlePageChange(currentPage - 1)}
                                disabled={currentPage === 1}
                            >
                                Previous
                            </Button>
                            <Button
                                size="sm"
                                variant="outline"
                                endIcon={<ChevronRight />}
                                onClick={() => handlePageChange(currentPage + 1)}
                                disabled={currentPage === quizList.length}
                            >
                                Next
                            </Button>
                        </div>

                        <Button
                            size="sm"
                            variant="outline"
                            onClick={() => router.push('/generated')}
                            className="text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                        >
                            Back to list
                        </Button>
                    </div>
                </>
            )}
        </div>
    );
};

export default QuestionsPage;