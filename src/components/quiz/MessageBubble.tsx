import { AgenticRole } from "@/utils/enum";
import { QuestionDiscussionMessage } from "@/utils/types";
import MarkdownRenderer from "../common/MarkdownRenderer";

export default function MessageBubble({ message }: { message: QuestionDiscussionMessage }) {
    return (
        <>
            <div
                className={`flex ${message.role === AgenticRole.USER ? "justify-end" : "justify-start"}`}
            >
                <div
                    className={`max-w-[85%] rounded-2xl px-4 py-3 backdrop-blur-sm border ${message.role === AgenticRole.USER
                        ? "bg-gradient-to-br from-blue-500 to-blue-600 text-white border-blue-400/30 shadow-lg shadow-blue-500/20"
                        : "bg-white/60 dark:bg-gray-800/60 text-gray-800 dark:text-gray-200 border-white/30 dark:border-gray-600/30 shadow-lg shadow-gray-500/10 dark:shadow-gray-900/20"
                        }`}
                >
                    <div className="flex items-start space-x-2">
                        {message.role === AgenticRole.ASSISTANT && (
                            <div className="w-6 h-6 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                                <span className="text-xs text-white">Q</span>
                            </div>
                        )}
                        <div className="flex-1 min-w-0">
                            <MarkdownRenderer content={message.message} />
                        </div>
                        {message.role === AgenticRole.USER && (
                            <div className="w-6 h-6 bg-gradient-to-r from-blue-400 to-cyan-400 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                                <span className="text-xs text-white">U</span>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </>
    );
}