import { Quiz } from "@/utils/types";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, PlusSquare } from "@/icons";
import Question from "@/components/quiz/question";
import Button from "@/components/ui/button/Button";
import KeywordPage from "@/components/quiz/keyword";
import ErrorDisplay from "@/components/error/errorDisplay";
import QuestionSkeleton from "@/components/common/QuestionSkeleton";
import NavigationSkeleton from "@/components/common/NavigationSkeleton";
import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import SearchIcon from "../Icon/SearchIcon";
import { useDispatch } from "react-redux";
import { setStep } from "@/store/reducers/stepSlice";
import { STEPS } from "@/utils/enum";

const GeneratedQuizList = ({
    quizList,
    isLoading,
    isError,
    errorMsg,
    isBackBtnVisible = true,
    isItForSearch = false,
}: {
    quizList: Quiz[],
    isLoading: boolean,
    isError: boolean,
    errorMsg: string | undefined,
    isBackBtnVisible?: boolean,
    isItForSearch?: boolean,
}) => {
    const searchParams = useSearchParams();
    const router = useRouter();
    const pageParam = searchParams.get("page");
    const queryParam = useSearchParams().get("query") || '';
    const dispatch = useDispatch();

    const [explanation, IsSetExplanation] = useState<string | undefined>(undefined);

    const currentPage = pageParam ? Math.max(1, parseInt(pageParam)) : 1;

    const quiz = quizList[currentPage - 1];

    const onReturnQuiz = (updatedQuiz: Quiz) => {
        quiz.explanation = updatedQuiz.explanation;
        IsSetExplanation(quiz.explanation);
    }

    const handlePageChange = (newPage: number) => {
        const validatedPage = Math.max(1, Math.min(newPage, quizList.length));
        IsSetExplanation(undefined);
        let paramsStr = `?page=${validatedPage}`;
        if (isItForSearch) {
            paramsStr += `&query=${encodeURIComponent(queryParam)}`;
        }
        router.push(paramsStr);
    };

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
            message={errorMsg}
            onReturn={() => router.push("/")}
        />
    }

    return (
        <div className="min-h-screen bg-gradient-to-br dark:from-gray-900 dark:to-gray-800 py-8 px-4">
            <div className="max-w-4xl mx-auto">
                {/* Progress indicator - Only show when there are quizzes */}
                {quizList.length > 0 && (
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

                        {isBackBtnVisible && (
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
                        )}
                    </motion.div>
                )}

                {isLoading ? (
                    <>
                        <QuestionSkeleton />
                        <NavigationSkeleton />
                    </>
                ) : quizList.length === 0 ? (
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
                                It looks like you have not generated any quizzes yet. Start creating amazing quizzes to test your knowledge!
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
                                        dispatch(setStep(STEPS.Department));
                                        router.push("/");
                                    }}
                                    className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700"
                                >
                                    <PlusSquare className="w-6 h-6" />
                                    Create First Quiz
                                </Button>
                                {
                                    isItForSearch &&
                                    <Button
                                        size="md"
                                        variant="outline"
                                        onClick={() => router.push('/generated')}
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
                                        <Question
                                            quiz={quiz}
                                            onSelect={() => { }}
                                            canSelect={false}
                                            onReturn={onReturnQuiz}
                                        />
                                    </motion.div>
                                    {(quiz.explanation || explanation) && (
                                        <motion.div className="mt-6 pt-6 border-t border-gray-100 dark:border-gray-700">
                                            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                                                Related Keywords
                                            </h3>
                                            <KeywordPage questionUuid={quiz.uuid} />
                                        </motion.div>
                                    )}
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
                                                disabled={currentPage === quizList.length}
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

export default GeneratedQuizList;