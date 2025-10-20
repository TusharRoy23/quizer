import MarkdownRenderer from "../common/MarkdownRenderer";

export default function StreamingBubble({ message }: { message: string }) {
    return (
        <>
            <div className="flex justify-start animate-modal-fade-in">
                <div className="max-w-[85%] rounded-2xl px-4 py-3 bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm border border-white/30 dark:border-gray-600/30 shadow-lg shadow-gray-500/10 dark:shadow-gray-900/20">
                    <div className="flex items-start space-x-2">
                        <div className="w-6 h-6 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                            <span className="text-xs text-white">Q</span>
                        </div>
                        <div className="flex-1 min-w-0">
                            <MarkdownRenderer content={message} />
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}