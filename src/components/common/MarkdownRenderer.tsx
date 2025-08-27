import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { oneDark } from "react-syntax-highlighter/dist/esm/styles/prism";

interface CodeProps {
    inline?: boolean;
    className?: string;
    children?: React.ReactNode;
}

const MarkdownRenderer = ({ content }: { content: string }) => (
    <div className="markdown-content w-full break-words overflow-hidden">
        <ReactMarkdown
            remarkPlugins={[remarkGfm]}
            components={{
                code: (({ inline, className, children, ...props }: CodeProps) => {
                    const match = /language-(\w+)/.exec(className || "");
                    return !inline && match ? (
                        <div className="w-full overflow-x-auto">
                            <SyntaxHighlighter
                                style={oneDark}
                                language={match[1]}
                                PreTag="div"
                                customStyle={{
                                    margin: 0,
                                    borderRadius: '0.375rem',
                                    fontSize: '0.875rem',
                                    width: 'fit-content',   // ✅ shrink to content
                                    minWidth: '100%',       // ✅ prevent block overflow
                                }}
                                codeTagProps={{
                                    style: {
                                        display: 'inline-block',
                                        whiteSpace: 'pre',     // ✅ horizontal scroll only
                                        overflowX: 'auto',
                                        padding: '1rem',
                                    },
                                }}
                                {...props}
                            >
                                {String(children).replace(/\n$/, "")}
                            </SyntaxHighlighter>
                        </div>

                    ) : (
                        <code
                            className="text-sm leading-6 text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-800 px-1 py-0.5 rounded break-words"
                            {...props}
                        >
                            {children}
                        </code>
                    );
                }) as React.ComponentType<CodeProps>
            }}
        >
            {content}
        </ReactMarkdown>
    </div>
);

export default MarkdownRenderer;