import { QuizService } from "@/services/quizService";
import { QuestionKeyword } from "@/utils/types";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Modal } from "../ui/modal";
import Button from "../ui/button/Button";
import { useEffect, useRef, useState } from "react";
import MarkdownRenderer from "../common/MarkdownRenderer";

interface KeywordDetailsProps {
    keywordUuid: string;
    onClose: () => void;
}

const KeywordDetails = ({ keywordUuid, onClose }: KeywordDetailsProps) => {
    const queryClient = useQueryClient();

    const [keywordExplanation, setKeywordExplanation] = useState("");
    const [isKeywordStreaming, setIsKeywordStreaming] = useState(false);
    const [isKeywordTyping, setIsKeywordTyping] = useState(false);
    const [keywordStreamError, setKeywordStreamError] = useState<string | null>(null);
    const keywordControllerRef = useRef<(() => void) | null>(null);

    const [keywordExampleExplanation, setKeywordExampleExplanation] = useState("");
    const [isKeywordExampleStreaming, setIsKeywordExampleStreaming] = useState(false);
    const [isKeywordExampleTyping, setIsKeywordExampleTyping] = useState(false);
    const [keywordExampleStreamError, setKeywordExampleStreamError] = useState<string | null>(null);
    const keywordExampleControllerRef = useRef<(() => void) | null>(null);

    const { data: keywordDetails, isLoading, error } = useQuery<QuestionKeyword>({
        queryKey: ["keywordDetails", keywordUuid],
        queryFn: () => QuizService.getKeywordDetails(keywordUuid),
        enabled: !!keywordUuid,
        retry: 1
    });

    const startStreaming = async () => {
        setIsKeywordStreaming(true);
        setKeywordExplanation("");
        setKeywordStreamError(null);
        setIsKeywordTyping(false);

        try {
            keywordControllerRef.current = await QuizService.getStreamedExplanation(
                `keywords/stream/${keywordUuid}/`,
                (completeText) => {
                    // Received complete text
                    setKeywordExplanation(completeText);
                    setIsKeywordStreaming(false);
                    queryClient.setQueryData<QuestionKeyword>(
                        ["keywordDetails", keywordUuid],
                        (oldData) => {
                            if (oldData) {
                                return {
                                    ...oldData,
                                    explanation: completeText,
                                };
                            }
                            return oldData;
                        }
                    );
                    setIsKeywordTyping(false);
                },
                (chunk) => {
                    setKeywordExplanation(prev => prev + chunk);
                    setIsKeywordStreaming(true);
                    setIsKeywordTyping(true);
                },
                (error) => {
                    console.error('Stream error:', error);
                    setIsKeywordStreaming(false);
                    setIsKeywordTyping(false);
                    setKeywordStreamError('Failed to stream explanation');
                }
            );

        } catch (error) {
            console.error('Failed to start streaming:', error);
            setIsKeywordStreaming(false);
            setIsKeywordTyping(false);
            setKeywordStreamError('Failed to start streaming');
        }
    };

    const retryStreaming = () => {
        if (keywordControllerRef.current) {
            keywordControllerRef.current();
            keywordControllerRef.current = null;
        }
        startStreaming();
    };

    useEffect(() => {
        if (!keywordDetails?.explanation && !isKeywordStreaming && !isKeywordTyping && !isLoading) {
            startStreaming();
        }

        // Cleanup function to abort streaming when component unmounts
        return () => {
            if (keywordControllerRef.current) {
                keywordControllerRef.current();
            }
        };
    }, [keywordDetails?.uuid, !keywordDetails?.explanation, !isLoading])

    const handleExampleClick = async () => {
        if (keywordDetails?.example) {
            return;
        }

        try {
            setIsKeywordExampleStreaming(true);
            setKeywordExampleExplanation("");
            setKeywordExampleStreamError(null);
            setIsKeywordExampleTyping(false);

            keywordExampleControllerRef.current = await QuizService.getStreamedExplanation(
                `keywords/stream/example/${keywordUuid}/`,
                (completeText) => {
                    // Received complete text
                    setKeywordExampleExplanation(completeText);
                    setIsKeywordExampleStreaming(false);
                    queryClient.setQueryData<QuestionKeyword>(
                        ["keywordDetails", keywordUuid],
                        (oldData) => {
                            if (oldData) {
                                return {
                                    ...oldData,
                                    example: completeText,
                                };
                            }
                            return oldData;
                        }
                    );
                    setIsKeywordExampleTyping(false);
                },
                (chunk) => {
                    setKeywordExampleExplanation(prev => prev + chunk);
                    setIsKeywordExampleStreaming(true);
                    setIsKeywordExampleTyping(true);
                },
                (error) => {
                    setIsKeywordExampleStreaming(false);
                    setIsKeywordExampleTyping(false);
                    setKeywordExampleStreamError('Failed to stream explanation');
                }
            );
        } catch {
        }
    };

    return (
        <Modal isOpen={!!keywordUuid} onClose={onClose} className="max-w-[600px] max-h-[90vh] p-5 lg:p-10 overflow-y-auto">
            {isLoading && (
                <div className="p-6">
                    <div className="animate-pulse space-y-4">
                        <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
                        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-full"></div>
                        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-full"></div>
                    </div>
                </div>
            )}

            {error && (
                <div className="p-6 text-red-500">
                    Failed to load keyword details
                </div>
            )}
            {keywordStreamError && (
                <div className="mb-2">
                    <p className="text-red-500">{keywordStreamError}</p>
                    <button
                        onClick={retryStreaming}
                        className="mt-2 px-3 py-1 bg-blue-500 text-white rounded text-sm hover:bg-blue-600"
                    >
                        Retry Streaming
                    </button>
                </div>
            )}

            {keywordDetails && (
                <div className="flex flex-col min-h-0">
                    <div className="p-6 pb-0 flex-grow-0">
                        <h4 className="font-semibold text-gray-800 mb-4 text-title-sm dark:text-white/90">
                            {keywordDetails.keyword}
                        </h4>

                        {isKeywordStreaming && !isKeywordTyping && (
                            <div className="flex items-center">
                                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-500 mr-2"></div>
                                <p>Generating explanation...</p>
                            </div>
                        )}

                        <span className={`text-sm leading-6 text-gray-500 dark:text-gray-400 mb-4${isKeywordStreaming && !isKeywordTyping && !keywordDetails?.explanation ? " animate-pulse" : ""}`}>
                            {keywordDetails.explanation && <MarkdownRenderer content={keywordDetails.explanation} />}
                            {!keywordDetails.explanation && keywordExplanation && (
                                <MarkdownRenderer content={keywordExplanation} />
                            )}
                        </span>
                    </div>
                    {!isKeywordTyping && !isKeywordStreaming && (
                        <div className="px-6 py-3 flex-grow-0">
                            {
                                keywordExampleStreamError && <p className="text-red-500">{keywordExampleStreamError}</p>
                            }
                            {(keywordDetails.example || keywordExampleExplanation)
                                && !keywordExampleStreamError ? (
                                <div className="bg-gray-50 dark:bg-gray-800 p-3 rounded-lg max-h-[200px] overflow-y-auto">
                                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Example:</span>
                                    <span className="text-sm text-gray-600 dark:text-gray-400 whitespace-pre-line">
                                        {keywordDetails.example && <MarkdownRenderer content={keywordDetails.example} />}
                                        {!keywordDetails.example && keywordExampleExplanation && (
                                            <MarkdownRenderer content={keywordExampleExplanation} />
                                        )}
                                    </span>
                                </div>
                            ) : isKeywordExampleStreaming && !isKeywordExampleTyping ? (
                                <div className="flex items-center">
                                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-500 mr-2"></div>
                                    <p>Generating example...</p>
                                </div>
                            ) : (
                                <button
                                    onClick={handleExampleClick}
                                    className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200
                                hover:bg-blue-200 dark:hover:bg-blue-800 transition-colors disabled:opacity-50"
                                >
                                    {keywordExampleStreamError ? "Retry" : "See Example"}
                                </button>
                            )}
                        </div>
                    )}


                    <div className="p-6 pt-4 flex-shrink-0">
                        <div className="flex items-center justify-end w-full gap-3">
                            <Button
                                size="sm"
                                variant="outline"
                                onClick={onClose}
                                disabled={isKeywordTyping
                                    || isKeywordStreaming
                                    || isKeywordExampleStreaming
                                    || isKeywordExampleTyping}
                            >
                                Close
                            </Button>
                        </div>
                    </div>
                </div>
            )}
        </Modal>
    );
};

export default KeywordDetails;
