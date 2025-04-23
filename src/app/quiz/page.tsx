"use client";
import { useEffect, useState } from "react";
import { fetchQuizes } from "../../services/quizService";
import { ObjectType, Quiz } from "@/types";
import Question from "@/components/quiz/question";
import Button from "@/components/ui/button/Button";
import { ChevronLeft, ChevronRight } from "@/icons";
import Timer from "@/components/quiz/timer";
import { useSelector } from "react-redux";
import { persistor, RootState } from "@/store";

export default function QuizPage() {
    const selector = useSelector((state: RootState) => state.steps.form);

    const [quiz, setQuiz] = useState<Quiz>();
    const fetchQuizs = async (pageNum: number) => {
        const response = await fetchQuizes(pageNum);
        setQuiz(response);
        persistor.purge();
    }

    const onTimeUp = () => {
        // Handle time up logic here
        persistor.purge();
        window.location.href = "/";
    }

    const onSelectAnswer = (answer: ObjectType) => {
        setQuiz((prev) => prev ? { ...prev, answer: String(answer.value) } : prev);
    }

    useEffect(() => {
        fetchQuizs(0);
    }, []);
    return (
        <>
            <div className="flex justify-center mb-4">
                <Timer duration={selector.timer * 60} onTimeUp={onTimeUp} />
            </div>
            {quiz && <Question quiz={quiz} onSelect={onSelectAnswer} />}
            {quiz &&
                <div className="flex justify-center mt-4">
                    <Button
                        className="mr-2"
                        size="sm" variant="outline"
                        startIcon={<ChevronLeft />}
                        onClick={() => fetchQuizs(-1)} disabled={false}
                    >
                        Previous
                    </Button>
                    <Button
                        size="sm" variant="outline"
                        endIcon={<ChevronRight />}
                        onClick={() => fetchQuizs(1)} disabled={false}
                    >
                        Next
                    </Button>
                </div>
            }
        </>
    );
}