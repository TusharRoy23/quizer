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
    <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
            code: (({ inline, className, children, ...props }: CodeProps) => {
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
            }) as React.ComponentType<CodeProps>,
        }}
    >
        {content}
    </ReactMarkdown>
);

export default MarkdownRenderer;