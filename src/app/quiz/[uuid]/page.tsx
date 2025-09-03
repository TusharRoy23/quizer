"use client";
import { QuizService } from "../../../services/quizService";
import { Quiz, QuizTimer } from "@/utils/types";
import Question from "@/components/quiz/question";
import Button from "@/components/ui/button/Button";
import { CheckLine, ChevronLeft, ChevronRight } from "@/icons";
import Timer from "@/components/quiz/timer";
import { persistor } from "@/store";
import { ClientDBService } from "@/services/clientDBService";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useCallback, useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import QuizSkeleton from "@/components/common/QuizSkeleton";

export default function QuizPage() {
    const params = useParams();
    const searchParams = useSearchParams();
    const router = useRouter();
    const uuid = params?.uuid;
    const queryClient = useQueryClient();
    const [remainingTime, setRemainingTime] = useState<number>(0);

    // Get page from URL or default to 1
    const pageParam = searchParams.get("page");
    const displayPage = pageParam ? Math.max(1, parseInt(pageParam)) : 1;
    // Convert to 0-based index for array access
    const currentPageIndex = displayPage - 1;

    const submitQuiz = useMutation({
        mutationFn: async () => {
            if (typeof uuid !== "string") throw new Error("Invalid UUID");
            return await QuizService.submitQuiz(uuid);
        },
        onSuccess: async () => {
            // Clear local data and redirect
            await ClientDBService.clearAllQuizzes();
            persistor.purge();
            router.push(`/result/${uuid}`);
        },
        onError: async () => {
            // Still clear data and redirect even on error
            await ClientDBService.clearAllQuizzes();
            router.push(`/result/${uuid}`);
        },
    });

    // Fetch quiz list
    const { data: quizList = [], isError: inQuizListError, isLoading: isQuizListLoading } = useQuery<Quiz[]>({
        queryKey: ['quizzes', uuid],
        queryFn: async () => {
            if (typeof uuid !== "string") throw new Error("Invalid UUID");
            await ClientDBService.clearAllQuizzes();
            const response = await QuizService.getQuizList(uuid);
            if (response.length > 0) {
                const data = response.map(quiz => ({
                    ...quiz,
                    selected_index: quiz.question_type === "CHOICE" ? (quiz.selected_answer && quiz?.selected_answer[0]) : quiz.selected_answer
                }))
                await ClientDBService.saveAllQuizzes(data);
            }
            persistor.purge();
            return response;
        },
        retry: 1
    });

    // Get current quiz from local DB
    const { data: quiz } = useQuery({
        queryKey: ['currentQuiz', quizList?.[currentPageIndex]?.uuid],
        queryFn: async () => {
            const currentQuiz = quizList[currentPageIndex];
            if (!currentQuiz) return null;
            return await ClientDBService.getQuiz(currentQuiz.uuid) as Quiz;
        },
        enabled: !!quizList?.[currentPageIndex]?.uuid
    });

    // Save answer mutation
    const saveAnswer = useMutation({
        mutationFn: async (selectedIdx: number | number[]) => {
            if (!quiz || typeof uuid !== "string") return;

            const updatedQuiz = {
                ...quiz,
                uuid: quiz.uuid,
                selected_index: selectedIdx,
                question: quiz.question,
            } as Quiz;

            await ClientDBService.saveQuizAnswer(updatedQuiz);
            return QuizService.saveQuiz(uuid, {
                uuid: updatedQuiz.uuid,
                answers: Array.isArray(selectedIdx) ? [...selectedIdx] : [selectedIdx]
            });
        },
        onMutate: async (selectedIdx) => {
            // 1. Cancel any ongoing queries for the current quiz
            await queryClient.cancelQueries({
                queryKey: ['currentQuiz', quizList?.[currentPageIndex]?.uuid]
            });

            // 2. Get the current quiz data snapshot
            const previousQuiz = queryClient.getQueryData<Quiz>(['currentQuiz', quizList?.[currentPageIndex]?.uuid]);

            // 3. Optimistically update to the new value
            queryClient.setQueryData(['currentQuiz', quizList?.[currentPageIndex]?.uuid], (old: Quiz | undefined) => {
                if (!old) return old;
                return {
                    ...old,
                    selected_index: selectedIdx
                };
            });

            // 4. Return the context with previous value for potential rollback
            return { previousQuiz };
        },
        onError: (err, variables, context) => {
            // 5. Roll back to previous value if error occurs
            if (context?.previousQuiz) {
                queryClient.setQueryData(
                    ['currentQuiz', quizList?.[currentPageIndex]?.uuid],
                    context.previousQuiz
                );
            }
        },
        onSettled: () => {
            // 6. Invalidate query to ensure server-state sync
            queryClient.invalidateQueries({
                queryKey: ['currentQuiz', quizList?.[currentPageIndex]?.uuid]
            });
        }
    });

    // Fetch timer - only once when component mounts
    const { data: timer, isError: isTimerError } = useQuery<QuizTimer>({
        queryKey: ['quizTimer', uuid],
        queryFn: async () => {
            if (typeof uuid !== "string") throw new Error("Invalid UUID");
            const timerData = await QuizService.getQuizTimer(uuid);
            setRemainingTime(timerData.remainingSeconds);
            return timerData;
        },
        retry: 1,
        staleTime: 0,
        refetchInterval: 15000,
        refetchOnWindowFocus: false, // Prevent refetch on focus
    });

    if (isTimerError || inQuizListError) {
        router.push(`/result/${uuid}`);
    }

    const handlePageChange = useCallback((newDisplayPage: number) => {
        const validatedPage = Math.max(1, Math.min(newDisplayPage, quizList.length));
        router.push(`?page=${validatedPage}`);
    }, [quizList.length, router]);

    // Add keyboard navigation
    useEffect(() => {
        const handleKeyDown = (event: KeyboardEvent) => {
            // Only handle left/right arrows if we're not in an input field
            const isInputField = event.target instanceof HTMLInputElement ||
                event.target instanceof HTMLTextAreaElement;

            // Check if we're dealing with a radio button
            const isRadioButton = event.target instanceof HTMLInputElement &&
                event.target.type === 'radio';

            // Check if we're dealing with a radio button
            const isCheckbox = event.target instanceof HTMLInputElement &&
                event.target.type === 'checkbox';

            if (isInputField && !isRadioButton && !isCheckbox) return;

            switch (event.key) {
                case 'ArrowLeft':
                    if (displayPage > 1) {
                        event.preventDefault();
                        handlePageChange(displayPage - 1);
                    }
                    break;
                case 'ArrowRight':
                    if (displayPage < quizList.length) {
                        event.preventDefault();
                        handlePageChange(displayPage + 1);
                    }
                    break;
            }
        };

        window.addEventListener('keydown', handleKeyDown);

        // Cleanup
        return () => {
            window.removeEventListener('keydown', handleKeyDown);
        };
    }, [displayPage, quizList.length, handlePageChange]);

    // Validate page number on load and quizList changes
    useEffect(() => {
        if (quizList.length > 0 && displayPage > quizList.length) {
            handlePageChange(quizList.length);
        }
    }, [quizList.length, displayPage, handlePageChange]);

    // Handle timer expiration and errors
    useEffect(() => {
        if (isTimerError || inQuizListError) {
            router.push(`/result/${uuid}`);
        }
        if (timer?.remainingSeconds && timer?.remainingSeconds <= 0) {
            submitQuiz.mutate();
        }
    }, [isTimerError, inQuizListError, timer, router, uuid, submitQuiz]);

    const onSelectAnswer = async (selectedIdx: number | number[]) => {
        saveAnswer.mutate(selectedIdx, {
            onSuccess: () => {
                queryClient.invalidateQueries({
                    queryKey: ['currentQuiz', quizList?.[currentPageIndex]?.uuid]
                });
            }
        });
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
        initial: { opacity: 0, x: displayPage > 1 ? -20 : 20 },
        animate: { opacity: 1, x: 0, transition: { duration: 0.3 } },
        exit: { opacity: 0, x: displayPage > 1 ? 20 : -20, transition: { duration: 0.2 } }
    };

    if (isQuizListLoading) {
        return (
            <div className="min-h-screen bg-gradient-to-br dark:from-gray-900 dark:to-gray-800 py-8 px-4">
                <QuizSkeleton />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br dark:from-gray-900 dark:to-gray-800 py-8 px-4">
            <div className="max-w-4xl mx-auto">
                {/* Timer and progress section */}
                <div
                    className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4"
                >
                    {quizList.length > 0 && remainingTime && (
                        <div className="flex justify-center w-full sm:w-auto">
                            <Timer
                                duration={remainingTime}
                                onTimeUp={() => submitQuiz.mutate()}
                            />
                        </div>
                    )}

                    <div className="flex items-center gap-3">
                        <div className="text-sm font-medium text-gray-600 dark:text-gray-300">
                            Question {displayPage} of {quizList.length}
                        </div>
                        <div className="w-32 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                            <motion.div
                                className="bg-blue-600 h-2 rounded-full"
                                initial={{ width: "0%" }}
                                animate={{ width: `${(displayPage / quizList.length) * 100}%` }}
                                transition={{ duration: 0.5, ease: "easeOut" }}
                            />
                        </div>
                    </div>
                </div>

                <AnimatePresence mode="wait">
                    {quiz && (
                        <motion.div
                            key={displayPage}
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
                                        onSelect={onSelectAnswer}
                                        canSelect={true}
                                    />
                                </motion.div>
                            </motion.div>
                        </motion.div>
                    )}
                </AnimatePresence>

                {quizList.length > 0 && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="flex flex-col gap-3 sm:flex-row sm:justify-between sm:items-center"
                    >
                        <div className="flex justify-between w-full gap-2 sm:w-auto">
                            <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} className="flex-1">
                                <Button
                                    className="w-full"
                                    size="md"
                                    variant="outline"
                                    startIcon={<ChevronLeft />}
                                    onClick={() => handlePageChange(displayPage - 1)}
                                    disabled={displayPage === 1 || submitQuiz.isPending}
                                >
                                    Previous
                                </Button>
                            </motion.div>
                            <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} className="flex-1">
                                <Button
                                    className="w-full"
                                    size="md"
                                    variant="outline"
                                    endIcon={<ChevronRight />}
                                    onClick={() => handlePageChange(displayPage + 1)}
                                    disabled={displayPage === quizList.length || submitQuiz.isPending}
                                >
                                    Next
                                </Button>
                            </motion.div>
                        </div>

                        <motion.div
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            className="w-full sm:w-auto"
                        >
                            <Button
                                className="w-full"
                                size="md"
                                variant="primary"
                                startIcon={<CheckLine />}
                                onClick={() => submitQuiz.mutate()}
                                disabled={submitQuiz.isPending}
                            >
                                Submit Quiz
                            </Button>
                        </motion.div>
                    </motion.div>
                )}

                {/* Keyboard navigation hint */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.5 }}
                    className="text-center text-sm text-gray-500 dark:text-gray-400 mt-6"
                >
                    Use ← → arrow keys to navigate
                </motion.div>
            </div>
        </div>
    );
}