"use client";
import { useEffect, useState } from "react";
import { QuizService } from "../../../services/quizService";
import { ObjectType, Quiz } from "@/types";
import Question from "@/components/quiz/question";
import Button from "@/components/ui/button/Button";
import { CheckLine, ChevronLeft, ChevronRight } from "@/icons";
import Timer from "@/components/quiz/timer";
import { useSelector } from "react-redux";
import { persistor, RootState } from "@/store";
import { ClientDBService } from "@/services/clientDBService";
import { useParams } from "next/navigation";

export default function QuizPage() {
    const router = useParams();
    const uuid = router?.uuid;
    const selector = useSelector((state: RootState) => state.steps.form);

    const [quiz, setQuiz] = useState<Quiz>();
    const [quizList, setQuizList] = useState<Quiz[]>([]);
    const [pageNumber, setPageNumber] = useState(0);
    const [IsLoading, setIsLoading] = useState(false);


    const getAllQuizzes = async () => {
        if (typeof uuid !== "string") {
            throw new Error("Invalid UUID");
        }
        const response = await QuizService.getQuizList(uuid);

        if (response.length > 0) {
            await ClientDBService.saveAllQuizzes(response);
        }
        setQuizList(response);
        if (response.length > 0) {
            setQuiz(response[0]);
        }
        persistor.purge(); ``
    }

    const paginate = async (pageNum: number) => {
        setPageNumber((prev) => prev + pageNum);
    }

    const onSubmit = async () => {
        setIsLoading(true);
        try {
            const response = await QuizService.submitQuiz(uuid as string);
            if (response) {
                setIsLoading(false);
                persistor.purge();
                ClientDBService.clearAllQuizzes();
                window.location.href = `/result/${uuid}`;
            }
        } catch (error) {
            setIsLoading(false);
        }
    }

    const onSelectAnswer = async (selectedIdx: number | number[]) => {
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
                quizList.length > 0 &&
                <div className="flex justify-center mb-4">
                    <Timer duration={selector.timer * 60} onTimeUp={onSubmit} />
                </div>
            }
            {quiz && <Question quiz={quiz} onSelect={onSelectAnswer} />}
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