"use client";
import { QuizService } from "@/services/quizService";
import { OralQuestion } from "@/utils/types";
import { useQuery } from "@tanstack/react-query";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, PlusSquare } from "@/icons";
import Button from "@/components/ui/button/Button";
import QuestionSkeleton from "@/components/common/QuestionSkeleton";
import NavigationSkeleton from "@/components/common/NavigationSkeleton";
import { useCallback, useEffect } from "react";
import ErrorDisplay from "@/components/error/errorDisplay";
import VerbalQuestion from "@/components/verbal/VerbalQuestion";
import SearchIcon from "@/components/Icon/SearchIcon";
import { useDispatch } from "react-redux";
import { setActiveTab } from "@/store/reducers/tabSlice";

export default function VerbalQuizFeedback() {
    const params = useParams();
    const router = useRouter();
    const dispatch = useDispatch();
    const searchParams = useSearchParams();
    const logUUID = params?.uuid as string || "";
    const pageParam = searchParams.get("page");

    const { data: questionList = [], isLoading, error, isError } = useQuery<OralQuestion[]>({
        queryKey: ["verbalQuestionFeedback", logUUID],
        queryFn: () => QuizService.getVervalQuestionFeedback(logUUID),
        enabled: !!logUUID,
        retry: 1,
    });
    const currentPage = pageParam ? Math.max(1, parseInt(pageParam)) : 1;
    const quiz = questionList[currentPage - 1];
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

    const handlePageChange = useCallback((newPage: number) => {
        const validatedPage = Math.max(1, Math.min(newPage, questionList.length));
        let paramsStr = `?page=${validatedPage}`;
        router.push(paramsStr);
    }, [questionList.length, router]);

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
                    if (currentPage < questionList.length) {
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
    }, [currentPage, questionList.length, handlePageChange]);

    useEffect(() => {
        if (questionList.length > 0 && currentPage > questionList.length) {
            handlePageChange(questionList.length);
        }
    }, [questionList.length, currentPage, handlePageChange]);

    if (isError) {
        return <ErrorDisplay
            title="Error"
            message={"Failed to load feedback. Please try again."}
            onReturn={() => router.push("/")}
        />
    }

    return (
        <div className="min-h-screen bg-gradient-to-br dark:from-gray-900 dark:to-gray-800 py-8 px-4">
            <div className="max-w-4xl mx-auto">
                {/* Progress indicator - Only show when there are quizzes */}
                {questionList.length > 0 && (
                    <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.4 }}
                        className="flex items-center justify-between mb-6"
                    >
                        <div className="flex items-center gap-3">
                            <div className="text-sm font-medium text-gray-300 dark:text-gray-300">
                                Question {currentPage} of {questionList.length || 0}
                            </div>
                            <div className="w-32 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                                <motion.div
                                    className="bg-blue-400 h-2 rounded-full"
                                    initial={{ width: "0%" }}
                                    animate={{ width: `${(currentPage / (questionList.length || 1)) * 100}%` }}
                                    transition={{ duration: 0.5, ease: "easeOut" }}
                                />
                            </div>
                        </div>
                        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                            <Button
                                size="sm"
                                variant="outline"
                                onClick={() => router.push('/verbal')}
                                className="text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                            >
                                Back to list
                            </Button>
                        </motion.div>
                    </motion.div>
                )}

                {isLoading ? (
                    <>
                        <QuestionSkeleton />
                        <NavigationSkeleton />
                    </>
                ) : questionList.length === 0 ? (
                    // Beautiful Empty State
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.5 }}
                        className="text-center py-16"
                    >
                        <div className="max-w-md mx-auto">
                            {/* Animated Icon */}
                            <motion.div
                                initial={{ y: -20, opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                                transition={{ delay: 0.2, duration: 0.5 }}
                                className="mb-6"
                            >
                                <div className="relative inline-flex items-center justify-center w-24 h-24">
                                    <div className="absolute inset-0 bg-blue-100 dark:bg-blue-900/30 rounded-full animate-pulse"></div>
                                    <svg
                                        className="w-12 h-12 text-blue-500 relative z-10"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                    >
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                                    </svg>
                                </div>
                            </motion.div>

                            {/* Title */}
                            <motion.h2
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: 0.3 }}
                                className="text-2xl font-bold text-gray-800 dark:text-white mb-3"
                            >
                                No Quizzes Yet
                            </motion.h2>

                            {/* Description */}
                            <motion.p
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: 0.4 }}
                                className="text-gray-600 dark:text-gray-300 mb-8"
                            >
                                It looks like you haven't generated any quizzes yet. Start creating amazing quizzes to test your knowledge!
                            </motion.p>

                            {/* Action Buttons */}
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.5 }}
                                className="flex flex-col sm:flex-row gap-4 justify-center"
                            >
                                <Button
                                    size="md"
                                    onClick={() => {
                                        dispatch(setActiveTab('create'));
                                        router.push("/verbal");
                                    }}
                                    className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700"
                                >
                                    <PlusSquare className="w-6 h-6" />
                                    Create Quiz
                                </Button>
                                {
                                    <Button
                                        size="md"
                                        variant="outline"
                                        onClick={() => {
                                            dispatch(setActiveTab('logs'));
                                            router.push('/verbal');
                                        }}
                                    >
                                        <SearchIcon className="w-5 h-5 mr-2" />
                                        Explore Quizzes
                                    </Button>
                                }

                            </motion.div>

                            {/* Decorative Elements */}
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: 0.6 }}
                                className="mt-12 text-gray-400 dark:text-gray-500"
                            >
                                <div className="flex justify-center space-x-6">
                                    {[1, 2, 3].map((i) => (
                                        <motion.div
                                            key={i}
                                            animate={{ y: [0, -5, 0] }}
                                            transition={{ duration: 2, repeat: Infinity, delay: i * 0.2 }}
                                            className="text-2xl"
                                        >
                                            ❓
                                        </motion.div>
                                    ))}
                                </div>
                            </motion.div>
                        </div>
                    </motion.div>
                ) : (
                    // Existing Quiz Content
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
                                    <motion.div>
                                        <VerbalQuestion quiz={quiz} />
                                    </motion.div>
                                </motion.div>

                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.2 }}
                                    className="flex flex-col gap-3 sm:flex-row sm:justify-between sm:items-center"
                                >
                                    <div className="flex justify-between w-full gap-2 sm:w-auto">
                                        <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} className="flex-1">
                                            <Button
                                                size="md"
                                                variant="outline"
                                                startIcon={<ChevronLeft />}
                                                onClick={() => handlePageChange(currentPage - 1)}
                                                disabled={currentPage === 1}
                                                className="w-full"
                                            >
                                                Previous
                                            </Button>
                                        </motion.div>

                                        <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} className="flex-1">
                                            <Button
                                                size="md"
                                                variant="outline"
                                                endIcon={<ChevronRight />}
                                                onClick={() => handlePageChange(currentPage + 1)}
                                                disabled={currentPage === questionList.length}
                                                className="w-full"
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
}