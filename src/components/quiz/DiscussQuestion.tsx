import { QuestionDiscussionMessage, Quiz } from "@/utils/types";
import { useEffect, useMemo, useRef, useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { QuizService } from "@/services/quizService";
import { AgenticRole } from "@/utils/enum";
import MessageBubble from "./MessageBubble";
import StreamingBubble from "./StreamingBubble";
import AgenticDiscussionModal from "../ui/modal/AgenticDiscussionModal";

interface ChatBoxProps {
    quiz: Quiz;
    isOpen: boolean;
    onClose: () => void;
}

export default function ChatBox({ quiz, isOpen, onClose }: ChatBoxProps) {
    const [isStreaming, setIsStreaming] = useState(false);
    const [streamingMessage, setStreamingMessage] = useState("");
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const abortControllerRef = useRef<(() => void) | null>(null);
    const [hasInitialScroll, setHasInitialScroll] = useState(false);
    const inputRef = useRef<HTMLTextAreaElement>(null);
    const queryClient = useQueryClient();

    const { data: messages = [], isLoading } = useQuery<QuestionDiscussionMessage[]>({
        queryKey: ["discussionLogs", quiz.uuid],
        queryFn: () => QuizService.getQuestionDiscussions(quiz.uuid),
        enabled: !!quiz.uuid,
        retry: 1,
    });

    // Auto-scroll to bottom when messages change or streaming updates
    useEffect(() => {
        const handle = setTimeout(() => {
            messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
        }, 100);
        return () => clearTimeout(handle);
    }, [messages, streamingMessage]);

    // Force scroll to bottom on initial load when modal opens and messages are loaded
    useEffect(() => {
        if (isOpen && messages.length > 0 && !hasInitialScroll) {
            // Small delay to ensure the DOM is fully rendered
            const timer = setTimeout(() => {
                messagesEndRef.current?.scrollIntoView({ behavior: "auto" });
                setHasInitialScroll(true);
            }, 100);

            return () => clearTimeout(timer);
        }
    }, [isOpen, messages.length, hasInitialScroll]);

    useEffect(() => {
        if (!isOpen) {
            setHasInitialScroll(false);
        }
    }, [isOpen]);

    // focus on textarea when streamng is done
    useEffect(() => {
        if (!isStreaming) {
            inputRef.current?.focus();
        }
    }, [isStreaming]);

    const renderedMessages = useMemo(() => (
        <>
            {messages.map((message, index) => (
                <MessageBubble key={index} message={message} />
            ))}
            {isStreaming && streamingMessage && <StreamingBubble message={streamingMessage} />}
        </>
    ), [messages, streamingMessage, isStreaming]);

    const sendMessage = async () => {
        const userMessage = inputRef.current?.value.trim();
        if (!userMessage || isStreaming || userMessage.length > 100) return;

        setIsStreaming(true);
        setStreamingMessage("");
        if (inputRef.current) {
            inputRef.current.value = "";
        }

        // Create temporary user message
        const tempUserMessage: QuestionDiscussionMessage = {
            role: AgenticRole.USER,
            message: userMessage,
            // Add other required fields based on your type definition
        };

        queryClient.setQueryData<QuestionDiscussionMessage[]>(
            ["discussionLogs", quiz.uuid],
            (old = []) => [...old, tempUserMessage]
        );

        try {
            abortControllerRef.current = await QuizService.getStreamedDiscussionResponse(
                quiz.uuid,
                { question: userMessage },
                (completeText) => {
                    // Received complete text - create final assistant message
                    const finalAssistantMessage: QuestionDiscussionMessage = {
                        role: AgenticRole.ASSISTANT,
                        message: completeText,
                        // Add other required fields
                    };

                    // Update the cache with both user message and final assistant message
                    queryClient.setQueryData<QuestionDiscussionMessage[]>(
                        ["discussionLogs", quiz.uuid],
                        (old = []) => [...old, finalAssistantMessage]
                    );

                    setIsStreaming(false);
                    setStreamingMessage("");
                },
                (chunk) => {
                    // Accumulate chunks for streaming display
                    setStreamingMessage(prev => prev + chunk);
                },
                (error) => {
                    console.error('Error in streaming discussion response: ', error);

                    // On error, still add the user message but show error for assistant
                    const errorMessage: QuestionDiscussionMessage = {
                        role: AgenticRole.ASSISTANT,
                        message: "Sorry, I encountered an error while processing your message. Please try again.",
                    };

                    queryClient.setQueryData<QuestionDiscussionMessage[]>(
                        ["discussionLogs", quiz.uuid],
                        (old = []) => [...old, errorMessage]
                    );

                    setIsStreaming(false);
                    setStreamingMessage("");
                }
            );
        } catch (error) {
            console.error('Failed to start streaming: ', error);

            // Handle initialization error
            const errorMessage: QuestionDiscussionMessage = {
                role: AgenticRole.ASSISTANT,
                message: "Failed to start the conversation. Please check your connection and try again.",
            };

            queryClient.setQueryData<QuestionDiscussionMessage[]>(
                ["discussionLogs", quiz.uuid],
                (old = []) => [...old, tempUserMessage, errorMessage]
            );

            setIsStreaming(false);
            setStreamingMessage("");
        }
    };

    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            sendMessage();
        }
    };

    // Cancel streaming when component unmounts or chat closes
    useEffect(() => {
        return () => {
            if (abortControllerRef.current) {
                abortControllerRef.current();
            }
        };
    }, []);

    if (!isOpen) return null;

    return (
        <AgenticDiscussionModal
            inputRef={inputRef}
            isLoading={isLoading}
            isStreaming={isStreaming}
            modalHeader="Question Discussion"
            onClose={onClose}
            handleKeyPress={handleKeyPress}
        >
            {/* Question preview */}
            <div className="px-6 py-3 bg-blue-50/50 dark:bg-blue-900/20 border-b border-white/30 dark:border-gray-700/50">
                <p className="text-sm text-gray-600 dark:text-gray-300 line-clamp-2">
                    <span className="font-semibold">Q:</span> {quiz.question}
                </p>
            </div>

            {/* Messages area */}
            <div
                className="flex-1 overflow-y-auto p-6 space-y-4 bg-gradient-to-b from-transparent to-white/20 dark:to-gray-800/20">
                {messages.length === 0 && !isStreaming ? (
                    <div className="flex flex-col items-center justify-center h-full text-center space-y-4">
                        <div className="w-16 h-16 bg-gradient-to-r from-blue-400 to-purple-500 rounded-full flex items-center justify-center">
                            <span className="text-2xl">💬</span>
                        </div>
                        <div>
                            <h4 className="text-lg font-semibold text-gray-700 dark:text-gray-300 mb-2">
                                Start a Discussion
                            </h4>
                            <p className="text-gray-500 dark:text-gray-400 max-w-sm">
                                Ask questions about this problem, discuss solutions, or get clarification on concepts.
                            </p>
                        </div>
                    </div>
                ) : (
                    <>
                        {renderedMessages}
                        {/* Loading indicator when starting stream */}
                        {isStreaming && !streamingMessage && (
                            <div className="flex justify-start animate-modal-fade-in">
                                <div className="max-w-[85%] rounded-2xl px-4 py-3 bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm border border-white/30 dark:border-gray-600/30 shadow-lg">
                                    <div className="flex items-center space-x-3">
                                        <div className="w-8 h-8 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full flex items-center justify-center flex-shrink-0">
                                            <span className="text-xs text-white">Q</span>
                                        </div>
                                        <div className="flex space-x-1">
                                            <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce"></div>
                                            <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                                            <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}
                    </>
                )}
                {messages.length > 0 && <div ref={messagesEndRef} />}
            </div>
        </AgenticDiscussionModal>
    );
}