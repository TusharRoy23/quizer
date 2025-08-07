// components/error/ErrorDisplay.tsx
"use client";

import Button from "@/components/ui/button/Button";
import Alert from "@/icons/alert.svg";

export default function ErrorDisplay({
    title = "Error",
    message = "An unexpected error occurred",
    onRetry,
    onReturn
}: {
    title?: string;
    message?: string;
    onRetry?: () => void;
    onReturn?: () => void;
}) {
    return (
        <div className="max-w-md mx-auto mt-10 p-6 rounded-lg bg-white dark:bg-gray-800 shadow-lg">
            <div className="text-center">
                <h3 className="flex items-center justify-center gap-2 text-xl font-semibold text-red-500 dark:text-red-400 mb-2">
                    <Alert />
                    {title}
                </h3>
                <p className="text-gray-600 dark:text-gray-300 mb-6">{message}</p>
                <div className="flex justify-center gap-4">
                    <Button
                        size="sm"
                        variant="outline"
                        onClick={() => window.location.reload()}
                    >
                        Refresh
                    </Button>
                    <Button
                        size="sm"
                        variant="primary"
                        onClick={() => (onRetry ? onRetry() : onReturn ? onReturn() : window.location.href = "/")}
                    >
                        {onRetry ? "Try Again" : "Return Home"}
                    </Button>
                </div>
            </div>
        </div>
    );
}