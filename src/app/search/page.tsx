"use client";

import GeneratedQuizList from "@/components/quiz/GeneratedQuizList";
import { QuizService } from "@/services/quizService";
import { RootState } from "@/store";
import { Quiz } from "@/utils/types";
import { useQuery } from "@tanstack/react-query";
import { useSearchParams } from "next/navigation";
import { useSelector } from "react-redux";

const SearchResultPage = () => {
    const queryParam = useSearchParams().get("query") || '';
    const decodedQuery = decodeURIComponent(queryParam);
    const isAuthenticated = useSelector((state: RootState) => state.auth.isAuthenticated);

    const { data: quizList = [], isLoading, error, isError } = useQuery<Quiz[]>({
        queryKey: ['searchQuestions'],
        queryFn: () => QuizService.getQuestionsByQuery(decodedQuery),
        enabled: isAuthenticated,
        retry: 1,
        refetchOnWindowFocus: false,
    });

    return (
        <GeneratedQuizList
            quizList={quizList}
            isError={isError}
            isLoading={isLoading}
            errorMsg={isError && error ? (error as Error).message : undefined}
            isBackBtnVisible={false}
            isItForSearch={true}
        />
    );
}

export default SearchResultPage;