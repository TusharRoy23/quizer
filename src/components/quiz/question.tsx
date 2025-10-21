import { Quiz } from "@/utils/types";
import ComponentCard from "../common/ComponentCard";
import Radio from "../form/Radio";
import Checkbox from "../form/Checkbox";
import MarkdownRenderer from "../common/MarkdownRenderer";
import { QuizService } from "@/services/quizService";
import { useState, useEffect, useRef } from "react";
import DiscussQuestion from "./DiscussQuestion";

interface QuestionProps {
    quiz: Quiz;
    onSelect: (selectedIdx: number | number[]) => void,
    canSelect?: boolean;
    onReturn?: (quiz: Quiz) => void
}

export default function Question({ quiz, onSelect, canSelect, onReturn }: QuestionProps) {
    const [fullExplanation, setFullExplanation] = useState("");
    const [isStreaming, setIsStreaming] = useState(false);
    const [isTyping, setIsTyping] = useState(false);
    const [streamError, setStreamError] = useState<string | null>(null);
    const [isChatOpen, setIsChatOpen] = useState(false);
    const abortControllerRef = useRef<(() => void) | null>(null);

    // Start streaming when component mounts and conditions are met
    useEffect(() => {
        if (!canSelect && !isStreaming && !isTyping && !quiz.explanation) {
            startStreaming();
        }

        // Cleanup function to abort streaming when component unmounts
        return () => {
            if (abortControllerRef.current) {
                abortControllerRef.current();
            }
        };
    }, [quiz.explanation, !canSelect]);

    const startStreaming = async () => {
        setIsStreaming(true);
        setFullExplanation("");
        setStreamError(null);

        try {
            abortControllerRef.current = await QuizService.getStreamedExplanation(
                `stream/${quiz.uuid}/`,
                (completeText) => {
                    // Received complete text
                    setFullExplanation(completeText);
                    setIsStreaming(false);
                    quiz.explanation = completeText;
                    setIsTyping(false);
                    if (onReturn) {
                        onReturn(quiz);
                    }
                },
                (chunk) => {
                    setFullExplanation(prev => prev + chunk);
                    setIsStreaming(true);
                    setIsTyping(true);
                },
                () => {
                    setIsStreaming(false);
                    setIsTyping(false);
                    setStreamError('Failed to stream explanation');
                }
            );

        } catch {
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

    return (
        <>
            <ComponentCard title={quiz.question} hasCode={true} className="max-h-[600px] min-h-[200px] max-w-[600px] min-w-[300px] overflow-y-auto">
                <div className="space-y-6 ">
                    {quiz.options.map((option, index) => {
                        if (quiz.question_type === "CHOICE") {
                            return canSelect ? (
                                <Radio
                                    key={index}
                                    id={`radio${index}`}
                                    name={`quiz-option-${quiz.uuid}`}
                                    value={option}
                                    checked={quiz?.selected_index === index}
                                    onChange={() => onSelect(index)}
                                    label={option}
                                />
                            ) : (
                                <span key={index} className="flex items-start gap-1">
                                    <span className="font-semibold">{index + 1}.</span>
                                    <span className={`inline-flex items-center border-l-4 pl-1 
                                        ${quiz.answer?.join(',') === index.toString() ? 'border-green-500' : ''} 
                                        ${quiz.selected_answer?.join(',') === index.toString()
                                            && quiz.selected_answer?.join(',') !== quiz.answer?.join(',') ? 'border-red-500' : ''}`}
                                    >
                                        {option && <MarkdownRenderer content={option} />}
                                    </span>
                                </span>
                            )
                        } else if (quiz.question_type === "MULTIPLE_CHOICE") {
                            return canSelect ? (
                                <Checkbox
                                    key={index}
                                    id={`checkbox${index}`}
                                    label={option}
                                    checked={Array.isArray(quiz.selected_index) && quiz.selected_index.includes(index)}
                                    onChange={(checked) => {
                                        let newSelected: number[] = Array.isArray(quiz.selected_index) ? [...quiz.selected_index] : [];
                                        if (checked) {
                                            if (!newSelected.includes(index)) {
                                                newSelected.push(index);
                                            }
                                        } else {
                                            newSelected = newSelected.filter(i => i !== index);
                                        }
                                        onSelect(newSelected);
                                    }}
                                    className="w-full"
                                />
                            ) :
                                (
                                    <span key={index} className="flex items-start gap-1">
                                        <span className="font-semibold">{index + 1}.</span>
                                        <span className={`inline-flex items-center border-l-4 pl-1 ${quiz.answer?.includes(index) ? 'border-green-500' : ''} ${quiz.selected_answer?.includes(index) && !quiz.answer?.includes(index) ? 'border-red-500' : ''}`}>
                                            {option && <MarkdownRenderer content={option} />}
                                        </span>
                                    </span>
                                );
                        }
                    })}

                    {/* Explanation section */}
                    {(isStreaming || quiz.explanation || fullExplanation || streamError) && (
                        <div className={`mt-4 p-4 bg-gray-100 dark:bg-gray-800 rounded-md${isStreaming && !isTyping ? " animate-pulse" : ""}`}>
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
                            {isStreaming && !isTyping && (
                                <div className="flex items-center">
                                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-500 mr-2"></div>
                                    <p>Generating explanation...</p>
                                </div>
                            )}

                            {(quiz.explanation || fullExplanation) && (
                                <>
                                    <h3 className="font-semibold text-lg mb-2">Explanation:</h3>
                                    {quiz.explanation && <MarkdownRenderer content={quiz.explanation} />}

                                    {/* Typewriter effect for streaming explanation */}
                                    {fullExplanation && !quiz.explanation && (
                                        <MarkdownRenderer content={fullExplanation} />
                                    )}
                                </>
                            )}
                        </div>
                    )}

                    {/* Chat Button */}
                    {
                        !canSelect && (quiz.explanation || fullExplanation) && <div className="mt-4 flex justify-end">
                            <button
                                onClick={() => setIsChatOpen(true)}
                                className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors"
                            >
                                <span>💬</span>
                                <span>{"Let's Discuss"}</span>
                            </button>
                        </div>
                    }

                </div>
            </ComponentCard>

            {/* Chat Box */}
            {
                !canSelect && (quiz.explanation || fullExplanation) && <DiscussQuestion
                    quiz={quiz}
                    isOpen={isChatOpen}
                    onClose={() => setIsChatOpen(false)}
                />
            }
        </>
    )
}