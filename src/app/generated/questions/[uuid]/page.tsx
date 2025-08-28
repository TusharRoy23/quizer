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
import { motion, AnimatePresence } from "framer-motion";

// Loading skeleton component
const QuestionSkeleton = () => {
    return (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 sm:p-6 mb-4 sm:mb-6 overflow-x-auto">
            <div className="min-w-0">
                {/* Question skeleton */}
                <div className="animate-pulse">
                    <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-4"></div>
                    <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-full mb-2"></div>
                    <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-5/6 mb-6"></div>

                    {/* Options skeleton */}
                    <div className="space-y-3">
                        {[1, 2, 3, 4].map((i) => (
                            <div key={i} className="h-12 bg-gray-200 dark:bg-gray-700 rounded-lg"></div>
                        ))}
                    </div>

                    {/* Keywords skeleton */}
                    <div className="mt-6">
                        <div className="h-5 bg-gray-200 dark:bg-gray-700 rounded w-1/3 mb-4"></div>
                        <div className="flex flex-wrap gap-2">
                            {[1, 2, 3, 4, 5].map((i) => (
                                <div key={i} className="h-8 bg-gray-200 dark:bg-gray-700 rounded-full w-20"></div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

// Navigation controls skeleton
const NavigationSkeleton = () => {
    return (
        <div className="flex flex-col gap-3 sm:flex-row sm:justify-between sm:items-center sm:gap-4 mt-4 sm:mt-6">
            <div className="flex items-center gap-2 w-full sm:w-auto">
                <div className="h-9 bg-gray-200 dark:bg-gray-700 rounded-md w-24 flex-1 sm:flex-none"></div>
                <div className="h-9 bg-gray-200 dark:bg-gray-700 rounded-md w-24 flex-1 sm:flex-none"></div>
            </div>
            <div className="h-9 bg-gray-200 dark:bg-gray-700 rounded-md w-32 w-full sm:w-auto"></div>
        </div>
    );
};

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

    // Animation variants
    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1
            }
        }
    };

    const pageVariants = {
        initial: { opacity: 0, x: currentPage > 1 ? -20 : 20 },
        animate: { opacity: 1, x: 0, transition: { duration: 0.3 } },
        exit: { opacity: 0, x: currentPage > 1 ? 20 : -20, transition: { duration: 0.2 } }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br dark:from-gray-900 dark:to-gray-800 py-8 px-4">
            <div className="max-w-4xl mx-auto">
                {/* Progress indicator */}
                <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4 }}
                    className="flex items-center justify-between mb-6"
                >
                    <div className="flex items-center gap-3">
                        <div className="text-sm font-medium text-gray-300 dark:text-gray-300">
                            Question {currentPage} of {quizList.length || 0}
                        </div>
                        <div className="w-32 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                            <motion.div
                                className="bg-blue-400 h-2 rounded-full"
                                initial={{ width: "0%" }}
                                animate={{ width: `${(currentPage / (quizList.length || 1)) * 100}%` }}
                                transition={{ duration: 0.5, ease: "easeOut" }}
                            />
                        </div>
                    </div>

                    <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                        <Button
                            size="sm"
                            variant="outline"
                            onClick={() => router.push('/generated')}
                            className="text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                        >
                            Back to list
                        </Button>
                    </motion.div>
                </motion.div>

                {isLoading ? (
                    <>
                        <QuestionSkeleton />
                        <NavigationSkeleton />
                    </>
                ) : (
                    <AnimatePresence mode="wait">
                        {quiz && (
                            <motion.div
                                key={currentPage}
                                variants={pageVariants}
                                initial="initial"
                                animate="animate"
                                exit="exit"
                            >
                                <motion.div
                                    variants={containerVariants}
                                    initial="hidden"
                                    animate="visible"
                                    className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 mb-6 border border-gray-100 dark:border-gray-700"
                                >
                                    <motion.div >
                                        <Question quiz={quiz} onSelect={() => { }} canSelect={false} />
                                    </motion.div>

                                    <motion.div

                                        className="mt-6 pt-6 border-t border-gray-100 dark:border-gray-700"
                                    >
                                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                                            Related Keywords
                                        </h3>
                                        <KeywordPage questionUuid={quiz.uuid} />
                                    </motion.div>
                                </motion.div>

                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.2 }}
                                    className="flex flex-col gap-3 sm:flex-row sm:justify-between sm:items-center"
                                >
                                    <div className="flex gap-2 w-full sm:w-auto">
                                        <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                                            <Button
                                                size="md"
                                                variant="outline"
                                                startIcon={<ChevronLeft />}
                                                onClick={() => handlePageChange(currentPage - 1)}
                                                disabled={currentPage === 1}
                                                className="flex-1 sm:flex-none"
                                            >
                                                Previous
                                            </Button>
                                        </motion.div>
                                        <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                                            <Button
                                                size="md"
                                                variant="outline"
                                                endIcon={<ChevronRight />}
                                                onClick={() => handlePageChange(currentPage + 1)}
                                                disabled={currentPage === quizList.length}
                                                className="flex-1 sm:flex-none"
                                            >
                                                Next
                                            </Button>
                                        </motion.div>
                                    </div>

                                    <div className="text-center text-sm text-gray-300 dark:text-gray-400 mt-4 sm:mt-0">
                                        Use ← → arrow keys to navigate
                                    </div>
                                </motion.div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                )}
            </div>
        </div>
    );
};

export default QuestionsPage;