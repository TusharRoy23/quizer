"use client";
import { QuizService } from "@/services/quizService";
import { QuestionKeyword } from "@/types";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import KeywordDetails from "./KeywordDetails";

const KeywordPage = ({ questionUuid }: { questionUuid: string }) => {
    const { data: keywords = [], isLoading, error } = useQuery<QuestionKeyword[]>({
        queryKey: ["questionKeywords", questionUuid],
        queryFn: () => QuizService.getQuestionKeywordsByUuid(questionUuid),
        enabled: !!questionUuid,
    });
    const [selectedKeyword, setSelectedKeyword] = useState<string | null>(null);

    if (isLoading) {
        return (
            <div className="flex flex-wrap gap-2">
                {[...Array(6)].map((_, i) => (
                    <div key={i} className="h-8 w-20 bg-gray-200 dark:bg-gray-700 rounded-full animate-pulse"></div>
                ))}
            </div>
        );
    }

    if (error) {
        return <div className="text-red-500 text-sm">Failed to load keywords</div>;
    }

    if (keywords.length === 0) {
        return <div className="text-gray-500 text-sm">No keywords available</div>;
    }

    return (
        <>
            <div className="flex flex-wrap gap-2">
                {keywords.map((keyword) => (
                    <div
                        key={keyword.uuid}
                        className="flex"
                    >
                        <span
                            className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200
                        break-words whitespace-normal max-w-[200px] text-left"
                            style={{
                                wordBreak: 'break-word',
                                lineHeight: '1.2',
                                minHeight: '28px',
                                cursor: 'pointer',
                            }}
                            onClick={() => setSelectedKeyword(keyword.uuid)}
                        >
                            {keyword.keyword}
                        </span>
                    </div>
                ))}
            </div>
            {selectedKeyword && (
                <KeywordDetails keywordUuid={selectedKeyword} onClose={() => setSelectedKeyword(null)} />
            )}
        </>
    );
};

export default KeywordPage;