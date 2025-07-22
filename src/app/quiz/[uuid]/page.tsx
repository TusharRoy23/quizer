"use client";
import { useEffect, useState } from "react";
import { QuizService } from "../../../services/quizService";
import { Quiz } from "@/types";
import Question from "@/components/quiz/question";
import Button from "@/components/ui/button/Button";
import { CheckLine, ChevronLeft, ChevronRight } from "@/icons";
import Timer from "@/components/quiz/timer";
import { persistor } from "@/store";
import { ClientDBService } from "@/services/clientDBService";
import { useParams, useRouter } from "next/navigation";

export default function QuizPage() {
    const params = useParams();
    const router = useRouter();
    const uuid = params?.uuid;

    const [quiz, setQuiz] = useState<Quiz>();
    const [quizList, setQuizList] = useState<Quiz[]>([]);
    const [pageNumber, setPageNumber] = useState(0);
    const [IsLoading, setIsLoading] = useState(false);
    const [remainingSeconds, setRemainingSeconds] = useState<number>(0);


    const getAllQuizzes = async () => {
        if (typeof uuid !== "string") {
            throw new Error("Invalid UUID");
        }
        try {
            await ClientDBService.clearAllQuizzes();
            const response = await QuizService.getQuizList(uuid);

            if (response.length > 0) {
                await ClientDBService.saveAllQuizzes(response);
            }
            setQuizList(response);
            if (response.length > 0) {
                setQuiz(response[0]);
            }
            persistor.purge();
            getQuizTimer();
        } catch (error) {
            setQuizList([]);
            setQuiz(undefined);
            if (typeof error === "object" && error !== null && "status" in error && (error as any).status === 404) {
                router.push('/');
            }
        }
    }
    const getQuizTimer = async () => {
        if (typeof uuid !== "string") {
            throw new Error("Invalid UUID");
        }
        try {
            const { remainingSeconds } = await QuizService.getQuizTimer(uuid);

            // Store for page reloads
            setRemainingSeconds(remainingSeconds);

            if (remainingSeconds < 0) {
                onSubmit();
            }
        } catch (error) {
            console.error("Error fetching quiz timer:", error);
        }
    }

    const paginate = async (pageNum: number) => {
        setPageNumber((prev) => prev + pageNum);
    }

    const onSubmit = async () => {
        setIsLoading(true);
        try {
            const response = await QuizService.submitQuiz(uuid as string);
            if (response) {
                persistor.purge();
                await ClientDBService.clearAllQuizzes();
                window.location.href = `/result/${uuid}`;
            }
        } catch (error) {
            setIsLoading(false);
        } finally {
            setIsLoading(false);
            await ClientDBService.clearAllQuizzes();
            window.location.href = `/result/${uuid}`;
        }
    }

    const onSelectAnswer = async (selectedIdx: number | number[]) => {
        try {
            setQuiz((prev) => prev ? { ...prev, selected_index: selectedIdx } : prev);
            const updatedQuiz = {
                ...quiz,
                uuid: quiz?.uuid || "",
                selected_index: selectedIdx,
                question: quiz?.question || "" // Ensure question is always a string
            } as Quiz;
            await ClientDBService.saveQuizAnswer(updatedQuiz);
            if (typeof uuid !== "string") {
                throw new Error("Invalid UUID");
            }
            await QuizService.saveQuiz(uuid, {
                uuid: updatedQuiz.uuid,
                answers: Array.isArray(selectedIdx) ? [...selectedIdx] : [selectedIdx]
            });
        } catch (error) {
            console.log('error: ', error);
        }
    }

    useEffect(() => {
        getAllQuizzes();
    }, [uuid]);

    useEffect(() => {
        const quiz = quizList[pageNumber];
        const updateQuiz = async () => {
            if (!quiz) return;
            const updatedQuiz = await ClientDBService.getQuiz(quiz.uuid) as Quiz;
            setQuiz(updatedQuiz);
        }
        updateQuiz();
    }, [pageNumber])

    return (
        <>
            {
                quizList.length > 0 && remainingSeconds >= 0 &&
                <div className="flex justify-center mb-4">
                    <Timer duration={remainingSeconds} onTimeUp={onSubmit} />
                </div>
            }
            {quiz && <Question quiz={quiz} onSelect={onSelectAnswer} canSelect={true} />}
            {quiz &&
                <div className="flex justify-center mt-4">
                    <Button
                        className="mr-2"
                        size="sm" variant="outline"
                        startIcon={<ChevronLeft />}
                        onClick={() => paginate(-1)} disabled={pageNumber === 0 || IsLoading}
                    >
                        Previous
                    </Button>
                    <Button
                        size="sm" variant="outline"
                        endIcon={<ChevronRight />}
                        onClick={() => paginate(1)} disabled={pageNumber === quizList.length - 1 || IsLoading}
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
                        onClick={() => onSubmit()}
                        disabled={IsLoading}
                    >
                        Submit
                    </Button>
                </div>
            }
        </>
    );
}