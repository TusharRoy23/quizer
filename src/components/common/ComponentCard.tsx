import React from "react";
import MarkdownRenderer from "./MarkdownRenderer";

interface ComponentCardProps {
    title?: string;
    children: React.ReactNode;
    className?: string; // Additional custom classes for styling
    desc?: string; // Description text,
    hasCode?: boolean; // Whether the card contains code snippets
}

const ComponentCard: React.FC<ComponentCardProps> = ({
    title,
    children,
    className = "",
    desc = "",
    hasCode = false,
}) => {
    return (
        <div
            className={`rounded-2xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03] ${className} w-full max-w-full`}
        >
            {/* Card Header */}
            {title && <div className="px-4 py-4 sm:px-6 sm:py-5 max-w-full overflow-hidden">
                <h3 className="text-base font-medium text-gray-800 dark:text-white/90 break-words max-w-full">
                    {!hasCode && title}
                    {
                        hasCode && (
                            <div className="max-w-full overflow-x-auto">
                                <MarkdownRenderer content={title} />
                            </div>
                        )
                    }
                </h3>
                {desc && (
                    <p className="mt-1 text-sm text-gray-500 dark:text-gray-400 break-words max-w-full">
                        {desc}
                    </p>
                )}
            </div>}


            {/* Card Body */}
            <div className="p-3 border-t border-gray-100 dark:border-gray-800 sm:p-6 w-full overflow-hidden">
                <div className="max-w-full">{children}</div>
            </div>
        </div>
    );
};

export default ComponentCard;