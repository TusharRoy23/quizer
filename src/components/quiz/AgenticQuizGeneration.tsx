import { useEffect, useMemo, useRef, useState } from "react";
import AgenticDiscussionModal from "../ui/modal/AgenticDiscussionModal";
import Button from "../ui/button/Button";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { QuizService } from "@/services/quizService";
import MessageBubble from "./MessageBubble";
import StreamingBubble from "./StreamingBubble";
import { QuestionDiscussionMessage, QuizRequest } from "@/utils/types";
import { AgenticNextStep, AgenticRole } from "@/utils/enum";
import { useDispatch } from "react-redux";
import { setSearchEnable } from "@/store/reducers/searchSlice";
import FullScreenLoader from "../common/FullScreenLoader";

export default function AgenticQuizGeneration({ isOpen, onClose }: { isOpen: boolean, onClose: () => void }) {
    const [isStreaming, setIsStreaming] = useState(false);
    const [isGenerating, setIsGenerating] = useState(false);
    const [streamingMessage, setStreamingMessage] = useState("");
    const [messages, setMessages] = useState<QuestionDiscussionMessage[]>([]);
    const [showBackdrop, setShowBackdrop] = useState<boolean>(false);
    const abortControllerRef = useRef<(() => void) | null>(null);
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const [hasInitialScroll, setHasInitialScroll] = useState(false);
    const inputRef = useRef<HTMLTextAreaElement>(null);
    const queryClient = useQueryClient();
    const dispatch = useDispatch();

    const mutation = useMutation<QuestionDiscussionMessage[]>({
        mutationFn: async () => {
            setIsStreaming(true);
            const messages: QuestionDiscussionMessage[] = [];

            abortControllerRef.current = await QuizService.getStreamedAgenticQuizGeneration(
                (completeText) => {
                    setMessages([{ role: AgenticRole.ASSISTANT, message: completeText }]); // update state directly
                    setIsStreaming(false);
                    setStreamingMessage("");
                },
                (chunk) => {
                    setStreamingMessage(prev => prev + chunk);
                },
                (error) => {
                    setIsStreaming(false);
                    setStreamingMessage("");
                }
            );

            return messages;
        },
    });

    // Auto-scroll to bottom when messages change or streaming updates
    useEffect(() => {
        const handle = setTimeout(() => {
            messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
        }, 100);
        return () => clearTimeout(handle);
    }, [messages, streamingMessage]);

    // focus on textarea when streamng is done
    useEffect(() => {
        if (!isStreaming) {
            inputRef.current?.focus();
        }
    }, [isStreaming]);

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

    const renderedMessages = useMemo(() => (
        <>
            {messages.map((message, index) => (
                <MessageBubble key={index} message={message} />
            ))}
            {isStreaming && streamingMessage && <StreamingBubble message={streamingMessage} />}
        </>
    ), [messages, streamingMessage, isStreaming]);

    // Cancel streaming when component unmounts or chat closes
    useEffect(() => {
        return () => {
            if (abortControllerRef.current) {
                abortControllerRef.current();
            }
        };
    }, []);

    const submitUserReply = async () => {
        const reply = inputRef.current?.value.trim();
        if (!reply || isStreaming || reply.length > 120) return;

        setMessages((old = []) => [...old, { role: AgenticRole.USER, message: reply }])

        setIsStreaming(true);
        setStreamingMessage("");
        if (inputRef.current) {
            inputRef.current.value = "";
        }

        try {
            const data = await QuizService.submitAgenticQuizGenerationReply({ message: reply });
            if (data.next_step === AgenticNextStep.QUIZ && typeof data.content === "object" && data.content !== null) {
                generateQuiz({
                    department: data.content.department,
                    topics: data.content.topics,
                    timer: data.content.timer,
                    question_count: data.content.question_count
                } as QuizRequest);
            } else {
                if (typeof data.content === "string") {
                    setMessages((old = []) => [...old, { role: data.role, message: data?.content as string || '' }])
                }

                setTimeout(() => {
                    if (data.next_step === AgenticNextStep.END) {
                        setShowBackdrop(true);
                    }
                }, 1300);
            }
        } catch (error) {
            const errorMessage: QuestionDiscussionMessage = {
                role: AgenticRole.ASSISTANT,
                message: "Sorry, I encountered an error while processing your message. Please try again.",
            };

            queryClient.setQueryData<QuestionDiscussionMessage[]>(
                ["agenticQuizGeneration"],
                (old = []) => [...old, errorMessage]
            );
        } finally {
            setIsStreaming(false);
            setStreamingMessage("");
        }
    }

    const generateQuiz = async (payload: QuizRequest) => {
        setIsGenerating(true);
        dispatch(setSearchEnable(false));
        try {
            const quizUuid = await QuizService.generateQuiz(payload);
            if (quizUuid) {
                onModalClose();
                window.location.href = `/quiz/${quizUuid}`;
            }
        } catch (error) {
            if (error instanceof Error) {
                // Need Proper error validation
            }
        } finally {
            setIsGenerating(false);
            setSearchEnable(true);
        }
    }

    if (isGenerating) {
        return <FullScreenLoader isGenerating />;
    }

    const clearMessages = () => {
        setMessages([]);
    }

    const startNewChat = () => {
        clearMessages();
        setShowBackdrop(false);
        mutation.mutate();
    }

    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            submitUserReply();
        }
    }

    const onModalClose = () => {
        if (abortControllerRef.current) {
            abortControllerRef.current();
        }
        onClose();
        setShowBackdrop(false);
    }

    if (!isOpen) return <></>;
    return (
        <AgenticDiscussionModal
            inputRef={inputRef}
            isLoading={false}
            isStreaming={isStreaming}
            isTextareaDisabled={showBackdrop || messages.length === 0}
            modalHeader="Chat & Take a Quiz"
            onClose={onModalClose}
            handleKeyPress={handleKeyPress}
        >
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
                            <Button
                                size="md"
                                variant="outline"
                                className="border-2 border-gray-300 text-gray-700 dark:text-gray-300 dark:border-gray-600 font-semibold hover:bg-gray-50 dark:hover:bg-gray-800/30 hover:animate-none w-full max-w-xs"
                                onClick={() => mutation.mutate()}
                            >
                                Let's Start
                            </Button>
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
                {/* --- Overlay for END state --- */}
                {
                    showBackdrop && !isStreaming &&
                    !streamingMessage && (
                        <div className="absolute inset-0 z-10 flex flex-col items-center justify-center gap-4 bg-gray-100/10 backdrop-blur-sm animate-fade-in">
                            <Button
                                size="md"
                                variant="primary"
                                className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-8 py-2 rounded-lg shadow-md hover:shadow-lg transition-all duration-200 w-full max-w-xs"
                                onClick={startNewChat}
                            >
                                Start New Chat
                            </Button>

                            <Button
                                size="md"
                                variant="outline"
                                className="border-2 border-gray-400 text-gray-700 dark:text-gray-300 dark:border-gray-500 font-semibold hover:bg-gray-100 dark:hover:bg-gray-800/50 transition-all duration-200 w-full max-w-xs"
                                onClick={() => {
                                    clearMessages();
                                    onModalClose();
                                }}
                            >
                                Close
                            </Button>
                        </div>
                    )}
                {messages.length > 0 && <div ref={messagesEndRef} />}
            </div>
        </AgenticDiscussionModal>
    );
}