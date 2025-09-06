import { QuizService } from "@/services/quizService";
import { QuestionKeyword } from "@/utils/types";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Modal } from "../ui/modal";
import Button from "../ui/button/Button";
import { useEffect, useRef, useState } from "react";
import MarkdownRenderer from "../common/MarkdownRenderer";
import TypewriterRenderer from "../common/TypewriterRenderer";

interface KeywordDetailsProps {
    keywordUuid: string;
    onClose: () => void;
}

const KeywordDetails = ({ keywordUuid, onClose }: KeywordDetailsProps) => {
    const queryClient = useQueryClient();
    const [example, setExample] = useState<string | null>(null);
    const [isFetchingExample, setIsFetchingExample] = useState(false);

    const [fullExplanation, setFullExplanation] = useState("");
    const [isStreaming, setIsStreaming] = useState(false);
    const [isTyping, setIsTyping] = useState(false);
    const [streamError, setStreamError] = useState<string | null>(null);
    const abortControllerRef = useRef<(() => void) | null>(null);

    const { data: keywordDetails, isLoading, error } = useQuery<QuestionKeyword>({
        queryKey: ["keywordDetails", keywordUuid],
        queryFn: () => QuizService.getKeywordDetails(keywordUuid),
        enabled: !!keywordUuid,
        retry: 1
    });

    const startStreaming = async () => {
        setIsStreaming(true);
        setFullExplanation("");
        setStreamError(null);
        setIsTyping(false);

        try {
            abortControllerRef.current = await QuizService.getStreamedExplanationForQuestion(
                `keywords/stream/${keywordUuid}/`,
                (completeText) => {
                    // Received complete text
                    setFullExplanation(completeText);
                    setIsStreaming(false);
                },
                (chunk) => {
                    setFullExplanation(prev => prev + chunk);
                    // setFullExplanation(chunk);
                    setIsStreaming(true);
                    setIsTyping(true);
                },
                (error) => {
                    console.error('Stream error:', error);
                    setIsStreaming(false);
                    setIsTyping(false);
                    setStreamError('Failed to stream explanation');
                }
            );

        } catch (error) {
            console.error('Failed to start streaming:', error);
            setIsStreaming(false);
            setIsTyping(false);
            setStreamError('Failed to start streaming');
        }
    };

    const retryStreaming = () => {
        if (abortControllerRef.current) {
            abortControllerRef.current();
            abortControllerRef.current = null;
        }
        startStreaming();
    };

    useEffect(() => {
        if (!keywordDetails?.explanation && !isStreaming && !isTyping && !isLoading) {
            startStreaming();
        }

        // Cleanup function to abort streaming when component unmounts
        return () => {
            if (abortControllerRef.current) {
                abortControllerRef.current();
            }
        };
    }, [keywordDetails?.uuid, !keywordDetails?.explanation, !isLoading])

    const handleExampleClick = async () => {
        if (keywordDetails?.example) {
            setExample(keywordDetails.example);
            return;
        }

        if (isFetchingExample) return;

        try {
            setIsFetchingExample(true);
            const fetchedExample = await QuizService.getKeywordExample(keywordUuid);
            setExample(fetchedExample);
        } catch {
            setExample("Could not load example at this time.");
        } finally {
            setIsFetchingExample(false);
        }
    };

    const handleTypingComplete = () => {
        setIsTyping(false);
        queryClient.setQueryData<QuestionKeyword>(
            ["keywordDetails", keywordUuid],
            (oldData) => {
                if (oldData) {
                    return {
                        ...oldData,
                        explanation: fullExplanation
                    };
                }
                return oldData;
            }
        );
    }

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
            {streamError && (
                <div className="mb-2">
                    <p className="text-red-500">{streamError}</p>
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

                        {isStreaming && !isTyping && (
                            <div className="flex items-center">
                                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-500 mr-2"></div>
                                <p>Generating explanation...</p>
                            </div>
                        )}

                        <span className={`text-sm leading-6 text-gray-500 dark:text-gray-400 mb-4${isStreaming && !isTyping && !keywordDetails?.explanation ? " animate-pulse" : ""}`}>
                            {keywordDetails.explanation && <MarkdownRenderer content={keywordDetails.explanation} />}
                            {!keywordDetails.explanation && fullExplanation && (
                                <TypewriterRenderer
                                    text={fullExplanation}
                                    speed={5}
                                    onComplete={handleTypingComplete}
                                />
                            )}
                        </span>
                    </div>
                    {!isTyping && !isStreaming && (
                        <div className="px-6 py-3 flex-grow-0">
                            {example ? (
                                <div className="bg-gray-50 dark:bg-gray-800 p-3 rounded-lg max-h-[200px] overflow-y-auto">
                                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Example:</span>
                                    <span className="text-sm text-gray-600 dark:text-gray-400 whitespace-pre-line">
                                        <MarkdownRenderer content={example} />
                                    </span>
                                </div>
                            ) : (
                                <button
                                    onClick={handleExampleClick}
                                    disabled={isFetchingExample}
                                    className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200
                                hover:bg-blue-200 dark:hover:bg-blue-800 transition-colors disabled:opacity-50"
                                >
                                    {isFetchingExample ? 'Loading...' : 'See Example'}
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
                                disabled={isTyping || isStreaming}
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
