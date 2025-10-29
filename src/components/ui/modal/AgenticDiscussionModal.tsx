interface ChatBoxProps {
    isStreaming: boolean;
    isLoading: boolean;
    isTextareaDisabled?: boolean;
    onClose: () => void;
    handleKeyPress: (e: React.KeyboardEvent) => void;
    inputRef: React.RefObject<HTMLTextAreaElement | null>;
    modalHeader: string;
    children: React.ReactNode;
}
export default function AgenticDiscussionModal({
    isStreaming, isLoading, modalHeader, isTextareaDisabled = false, inputRef, children, handleKeyPress, onClose
}: ChatBoxProps) {
    return (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            {/* Glass morphism chat container */}
            <div className="bg-white/90 dark:bg-gray-900/90 backdrop-blur-xl rounded-2xl shadow-2xl w-full max-w-2xl h-[600px] flex flex-col border border-white/20 dark:border-gray-700/50">
                {/* Header with gradient */}
                <div className="flex justify-between items-center p-6 border-b border-white/30 dark:border-gray-700/50 bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-t-2xl">
                    <div className="flex items-center space-x-3">
                        <div className={`w-3 h-3 rounded-full animate-pulse ${isStreaming ? 'bg-yellow-400' : 'bg-green-400'}`}></div>
                        <h3 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                            {modalHeader}
                        </h3>
                    </div>
                    <button
                        onClick={onClose}
                        className="w-8 h-8 flex items-center justify-center rounded-full bg-white/50 dark:bg-gray-800/50 hover:bg-white/80 dark:hover:bg-gray-700/50 transition-all duration-200 group"
                        disabled={isStreaming}
                    >
                        <span className="text-gray-500 dark:text-gray-400 group-hover:text-gray-700 dark:group-hover:text-gray-200 transition-colors text-lg">
                            ×
                        </span>
                    </button>
                </div>

                {/* MODAL BODY SECTION */}
                {children}
                {/* Input area */}
                <div className="p-6 border-t border-white/30 dark:border-gray-700/50 bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm rounded-b-2xl">
                    <div className="flex space-x-3">
                        <div className="flex-1 relative">
                            <textarea
                                ref={inputRef}
                                onKeyUp={handleKeyPress}
                                placeholder={isStreaming ? "Quizer is responding..." : "Type your message... (Press Enter to send)"}
                                className="w-full border border-gray-300/50 dark:border-gray-600/50 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-transparent bg-white/80 dark:bg-gray-700/80 backdrop-blur-sm resize-none transition-all duration-200 placeholder-gray-500 dark:placeholder-gray-400 pr-12 disabled:opacity-50"
                                rows={2}
                                disabled={isStreaming || isLoading || isTextareaDisabled}
                            />
                            <div className="absolute right-3 bottom-3 text-xs text-gray-400">
                                ↵ Enter
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}