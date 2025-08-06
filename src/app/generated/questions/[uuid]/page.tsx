"use client";
import Question from "@/components/quiz/question";
import Button from "@/components/ui/button/Button";
import { ChevronLeft, ChevronRight } from "@/icons";
import { QuizService } from "@/services/quizService";
import { Quiz } from "@/types";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { useEffect } from "react";

const QuestionsPage = () => {
    const params = useParams();
    const searchParams = useSearchParams();
    const router = useRouter();
    const uuid = params?.uuid as string || "";

    // Get page from URL or default to 1
    const pageParam = searchParams.get("page");
    const currentPage = pageParam ? Math.max(1, parseInt(pageParam)) : 1;

    const { data: quizList = [], isLoading, error } = useQuery<Quiz[]>({
        queryKey: ["quizLogs", uuid],
        queryFn: () => QuizService.getQuizLogs(uuid),
        enabled: !!uuid,
    });

    const quiz = quizList[currentPage - 1];

    const handlePageChange = (newPage: number) => {
        // Ensure page stays within bounds
        const validatedPage = Math.max(0, Math.min(newPage, quizList.length));
        router.push(`?page=${validatedPage}`);
    };

    // Validate page number on load
    useEffect(() => {
        if (quizList.length > 0 && currentPage >= quizList.length) {
            // If page is out of bounds, redirect to last page
            handlePageChange(quizList.length);
        }
    }, [quizList.length, currentPage]);

    return (
        <>
            {isLoading && <div className="text-center">Loading...</div>}
            {error && <div className="text-center text-red-500">Error loading questions</div>}

            {quiz && <Question quiz={quiz} onSelect={() => { }} canSelect={false} />}

            {quizList.length > 0 && (
                <>
                    <div className="flex justify-center mt-4">
                        <Button
                            className="mr-2"
                            size="sm"
                            variant="outline"
                            startIcon={<ChevronLeft />}
                            onClick={() => handlePageChange(currentPage - 1)}
                            disabled={currentPage === 1}
                        >
                            Previous
                        </Button>
                        <Button
                            size="sm"
                            variant="outline"
                            endIcon={<ChevronRight />}
                            onClick={() => handlePageChange(currentPage + 1)}
                            disabled={currentPage === quizList.length}
                        >
                            Next
                        </Button>
                    </div>

                    <div className="flex justify-center mt-4">
                        <Button
                            size="sm"
                            variant="outline"
                            onClick={() => router.push('/generated')}
                        >
                            Back to list
                        </Button>
                    </div>
                </>
            )}
        </>
    );
};

export default QuestionsPage;