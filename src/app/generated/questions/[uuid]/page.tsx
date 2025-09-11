"use client";
import { QuizService } from "@/services/quizService";
import { Quiz } from "@/utils/types";
import { useParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import GeneratedQuizList from "@/components/quiz/GeneratedQuizList";

const QuestionsPage = () => {
    const params = useParams();
    const uuid = params?.uuid as string || "";

    const { data: quizList = [], isLoading, error, isError } = useQuery<Quiz[]>({
        queryKey: ["quizLogs", uuid],
        queryFn: () => QuizService.getQuizLogs(uuid),
        enabled: !!uuid,
        retry: 1,
    });

    return (
        <GeneratedQuizList
            quizList={quizList}
            isError={isError}
            isLoading={isLoading}
            errorMsg={isError && error ? (error as Error).message : undefined}
        />
    );
};

export default QuestionsPage;