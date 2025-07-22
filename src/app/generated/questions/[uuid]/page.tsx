"use client";
import Question from "@/components/quiz/question";
import Button from "@/components/ui/button/Button";
import { ChevronLeft, ChevronRight } from "@/icons";
import { QuizService } from "@/services/quizService";
import { Quiz } from "@/types";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

const QuestionsPage = () => {
    const params = useParams();
    const router = useRouter();
    const uuid = params?.uuid as string || "";
    const [quizList, setQuizList] = useState<Quiz[]>([]);
    const [quiz, setQuiz] = useState<Quiz>();
    const [pageNumber, setPageNumber] = useState(0);

    const getAllQuestions = async () => {
        try {
            const list = await QuizService.getQuizLogs(uuid);
            if (list && list.length > 0) {
                setQuizList(list);
                setQuiz(list[0]);
            }
        } catch (error) {
            console.log('error: ', error);
        }
    }

    useEffect(() => {
        if (uuid) {
            getAllQuestions();
        }
    }, [uuid]);

    useEffect(() => {
        const quiz = quizList[pageNumber];
        const updateQuiz = async () => {
            if (!quiz) return;
            setQuiz(quiz);
        }
        updateQuiz();
    }, [pageNumber])

    const paginate = async (pageNum: number) => {
        setPageNumber((prev) => prev + pageNum);
    }

    return (
        <>
            {quiz && <Question quiz={quiz} onSelect={() => { }} canSelect={false} />}
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
            {quiz &&
                <div className="flex justify-center mt-4">
                    <Button
                        className="mr-2"
                        size="sm" variant="outline"
                        startIcon={<ChevronLeft />}
                        onClick={() => router.push('/generated')}
                    >
                        Back to list
                    </Button>
                </div>
            }
        </>
    );
}

export default QuestionsPage;