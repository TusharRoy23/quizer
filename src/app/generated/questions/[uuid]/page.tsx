"use client";
import Question from "@/components/quiz/question";
import Button from "@/components/ui/button/Button";
import { ChevronLeft, ChevronRight } from "@/icons";
import { QuizService } from "@/services/quizService";
import { Quiz } from "@/types";
import { useParams, useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { RootState } from "@/store";
import { useDispatch, useSelector } from "react-redux";
import { setGeneratedPageNumber } from "@/store/reducers/quizSlice";

const QuestionsPage = () => {
    const params = useParams();
    const router = useRouter();
    const uuid = params?.uuid as string || "";

    const { data: quizList = [], isLoading, error } = useQuery<Quiz[]>({
        queryKey: ["quizLogs", uuid],
        queryFn: () => QuizService.getQuizLogs(uuid),
        enabled: !!uuid,
    });
    const pageNumber = useSelector((state: RootState) => state.quiz.generatedPageNumber);
    const dispatch = useDispatch();

    const quiz = quizList[pageNumber];

    const paginate = (pageNum: number) => {
        dispatch(setGeneratedPageNumber({ pageNumber: pageNumber + pageNum }));
    };

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