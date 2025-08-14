import { QuizService } from "@/services/quizService";
import { QuestionKeyword } from "@/types";
import { useQuery } from "@tanstack/react-query";
import { Modal } from "../ui/modal";
import Button from "../ui/button/Button";
import { useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { oneDark } from "react-syntax-highlighter/dist/esm/styles/prism";

interface KeywordDetailsProps {
    keywordUuid: string;
    onClose: () => void;
}

const MarkdownRenderer = ({ content }: { content: string }) => (
    <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
            code: (({ inline, className, children, ...props }) => {
                const match = /language-(\w+)/.exec(className || "");
                return !inline && match ? (
                    <SyntaxHighlighter
                        style={oneDark}
                        language={match[1]}
                        PreTag="div"
                        {...props}
                    >
                        {String(children).replace(/\n$/, "")}
                    </SyntaxHighlighter>
                ) : (
                    <code className="text-sm leading-6 text-gray-500 dark:text-gray-400 mb-4" {...props}>
                        {children}
                    </code>
                );
            }) as React.ComponentType<any>,
        }}
    >
        {content}
    </ReactMarkdown>
);

const KeywordDetails = ({ keywordUuid, onClose }: KeywordDetailsProps) => {
    const [example, setExample] = useState<string | null>(null);
    const [isFetchingExample, setIsFetchingExample] = useState(false);

    const { data: keywordDetails, isLoading, error } = useQuery<QuestionKeyword>({
        queryKey: ["keywordDetails", keywordUuid],
        queryFn: () => QuizService.getKeywordDetails(keywordUuid),
        enabled: !!keywordUuid,
        retry: 1
    });

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
        } catch (error) {
            setExample("Could not load example at this time.");
        } finally {
            setIsFetchingExample(false);
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

            {keywordDetails && (
                <div className="flex flex-col min-h-0">
                    <div className="p-6 pb-0 flex-grow-0">
                        <h4 className="font-semibold text-gray-800 mb-4 text-title-sm dark:text-white/90">
                            {keywordDetails.keyword}
                        </h4>

                        <p className="text-sm leading-6 text-gray-500 dark:text-gray-400 mb-4">
                            {keywordDetails.explanation && <MarkdownRenderer content={keywordDetails.explanation} />}
                        </p>
                    </div>

                    <div className="px-6 py-3 flex-grow-0">
                        {example ? (
                            <div className="bg-gray-50 dark:bg-gray-800 p-3 rounded-lg max-h-[200px] overflow-y-auto">
                                <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Example:</p>
                                <p className="text-sm text-gray-600 dark:text-gray-400 whitespace-pre-line">
                                    <MarkdownRenderer content={example} />
                                </p>
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

                    <div className="p-6 pt-4 flex-shrink-0">
                        <div className="flex items-center justify-end w-full gap-3">
                            <Button
                                size="sm"
                                variant="outline"
                                onClick={onClose}
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
