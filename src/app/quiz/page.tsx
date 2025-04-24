"use client";
import { useEffect, useState } from "react";
import { QuizService } from "../../services/quizService";
import { ObjectType, Quiz } from "@/types";
import Question from "@/components/quiz/question";
import Button from "@/components/ui/button/Button";
import { CheckLine, ChevronLeft, ChevronRight } from "@/icons";
import Timer from "@/components/quiz/timer";
import { useSelector } from "react-redux";
import { persistor, RootState } from "@/store";
import { ClientDBService } from "@/services/clientDBService";

export default function QuizPage() {
    const selector = useSelector((state: RootState) => state.steps.form);

    const [quiz, setQuiz] = useState<Quiz>();
    const [quizList, setQuizList] = useState<Quiz[]>([]);
    const [pageNumber, setPageNumber] = useState(0);

    const getAllQuizzes = async () => {
        const response = await QuizService.getQuizList();

        if (response.length > 0) {
            await ClientDBService.saveAllQuizzes(response);
        }
        setQuizList(response);
        if (response.length > 0) {
            setQuiz(response[0]);
        }
        persistor.purge();
    }

    const paginate = async (pageNum: number) => {
        setPageNumber((prev) => prev + pageNum);
    }

    const onTimeUp = () => {
        // Handle time up logic here
        persistor.purge();
        ClientDBService.clearAllQuizzes();
        window.location.href = "/result";
    }

    const onSelectAnswer = async (answer: ObjectType) => {
        setQuiz((prev) => prev ? { ...prev, answer: String(answer.value) } : prev);
        const updatedQuiz = {
            ...quiz,
            uuid: quiz?.uuid || "",
            answer: String(answer.value),
            question: quiz?.question || "" // Ensure question is always a string
        } as Quiz;
        await ClientDBService.saveQuizAnswer(updatedQuiz);
        await QuizService.saveQuiz(updatedQuiz);
    }

    useEffect(() => {
        getAllQuizzes();
    }, []);

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
                    <Timer duration={selector.timer * 60} onTimeUp={onTimeUp} />
                </div>
            }
            {quiz && <Question quiz={quiz} onSelect={onSelectAnswer} />}
            {quiz &&
                <div className="flex justify-center mt-4">
                    <Button
                        className="mr-2"
                        size="sm" variant="outline"
                        startIcon={<ChevronLeft />}
                        onClick={() => paginate(-1)} disabled={pageNumber === 0}
                    >
                        Previous
                    </Button>
                    <Button
                        size="sm" variant="outline"
                        endIcon={<ChevronRight />}
                        onClick={() => paginate(1)} disabled={pageNumber === quizList.length - 1}
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
                        onClick={() => { window.location.href = "/result" }}
                    >
                        Submit
                    </Button>
                </div>
            }
        </>
    );
}