"use client";
import { useEffect, useState } from "react";
import { QuizService } from "../../../services/quizService";
import { Quiz, QuizTimer } from "@/types";
import Question from "@/components/quiz/question";
import Button from "@/components/ui/button/Button";
import { CheckLine, ChevronLeft, ChevronRight } from "@/icons";
import Timer from "@/components/quiz/timer";
import { persistor } from "@/store";
import { ClientDBService } from "@/services/clientDBService";
import { useParams, useRouter } from "next/navigation";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export default function QuizPage() {
    const params = useParams();
    const router = useRouter();
    const uuid = params?.uuid;
    const queryClient = useQueryClient();
    const [pageNumber, setPageNumber] = useState(0);

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
    const { data: quizList = [], isError: inQuizListError } = useQuery<Quiz[]>({
        queryKey: ['quizzes', uuid],
        queryFn: async () => {
            if (typeof uuid !== "string") throw new Error("Invalid UUID");
            await ClientDBService.clearAllQuizzes();
            const response = await QuizService.getQuizList(uuid);
            if (response.length > 0) {
                await ClientDBService.saveAllQuizzes(response);
            }
            persistor.purge();
            return response;
        }
    });

    // Get current quiz from local DB
    const { data: quiz } = useQuery({
        queryKey: ['currentQuiz', quizList?.[pageNumber]?.uuid],
        queryFn: async () => {
            const currentQuiz = quizList[pageNumber];
            if (!currentQuiz) return null;
            return await ClientDBService.getQuiz(currentQuiz.uuid) as Quiz;
        },
        enabled: !!quizList?.[pageNumber]?.uuid
    });

    // Save answer mutation
    const saveAnswer = useMutation({
        mutationFn: async (selectedIdx: number | number[]) => {
            if (!quiz || typeof uuid !== "string") return;

            const updatedQuiz = {
                ...quiz,
                uuid: quiz.uuid,
                selected_index: selectedIdx,
                question: quiz.question
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
                queryKey: ['currentQuiz', quizList?.[pageNumber]?.uuid]
            });

            // 2. Get the current quiz data snapshot
            const previousQuiz = queryClient.getQueryData<Quiz>(['currentQuiz', quizList?.[pageNumber]?.uuid]);

            // 3. Optimistically update to the new value
            queryClient.setQueryData(['currentQuiz', quizList?.[pageNumber]?.uuid], (old: Quiz | undefined) => {
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
                    ['currentQuiz', quizList?.[pageNumber]?.uuid],
                    context.previousQuiz
                );
            }
        },
        onSettled: () => {
            // 6. Invalidate query to ensure server-state sync
            queryClient.invalidateQueries({
                queryKey: ['currentQuiz', quizList?.[pageNumber]?.uuid]
            });
        }
    });

    // Fetch timer
    const { data: timer, isError: isTimerError } = useQuery<QuizTimer>({
        queryKey: ['quizTimer', uuid],
        queryFn: async () => {
            if (typeof uuid !== "string") throw new Error("Invalid UUID");
            return await QuizService.getQuizTimer(uuid);
        },
        refetchInterval: 30000, // Refetch every 30 seconds
    });

    if (isTimerError || inQuizListError) {
        router.push(`/result/${uuid}`);
    }

    const paginate = async (pageNum: number) => {
        setPageNumber((prev) => prev + pageNum);
    }

    const onSelectAnswer = async (selectedIdx: number | number[]) => {
        saveAnswer.mutate(selectedIdx, {
            onSuccess: () => {
                queryClient.invalidateQueries({
                    queryKey: ['currentQuiz', quizList?.[pageNumber]?.uuid]
                });
            }
        });
    }

    return (
        <>
            {
                quizList.length > 0 && timer && timer?.remainingSeconds >= 0 &&
                <div className="flex justify-center mb-4">
                    <Timer duration={timer.remainingSeconds} onTimeUp={() => submitQuiz.mutate()} />
                </div>
            }
            {quiz && <Question quiz={quiz} onSelect={onSelectAnswer} canSelect={true} />}
            {quiz &&
                <div className="flex justify-center mt-4">
                    <Button
                        className="mr-2"
                        size="sm" variant="outline"
                        startIcon={<ChevronLeft />}
                        onClick={() => paginate(-1)} disabled={pageNumber === 0 || submitQuiz.isPending}
                    >
                        Previous
                    </Button>
                    <Button
                        size="sm" variant="outline"
                        endIcon={<ChevronRight />}
                        onClick={() => paginate(1)} disabled={pageNumber === quizList.length - 1 || submitQuiz.isPending}
                    >
                        Next
                    </Button>
                </div>
            }
            {quizList.length > 0 &&
                <div className="flex justify-center mt-4">
                    <Button
                        className="mr-2"
                        size="sm" variant="primary"
                        startIcon={<CheckLine />}
                        onClick={() => submitQuiz.mutate()}
                        disabled={submitQuiz.isPending}
                    >
                        Submit
                    </Button>
                </div>
            }
        </>
    );
}