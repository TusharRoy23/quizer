// Loading skeleton component
const QuizSkeleton = () => {
    return (
        <div className="max-w-4xl mx-auto px-2 sm:px-4 py-4 sm:py-6">
            <div className="flex justify-center mb-6">
                <div className="w-48 h-12 bg-gray-200 dark:bg-gray-700 rounded-lg animate-pulse"></div>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 sm:p-6 mb-4 sm:mb-6 overflow-x-auto">
                <div className="min-w-0 animate-pulse">
                    <div className="h-7 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-6"></div>

                    <div className="space-y-3">
                        {[1, 2, 3, 4].map((i) => (
                            <div key={i} className="h-14 bg-gray-200 dark:bg-gray-700 rounded-lg"></div>
                        ))}
                    </div>
                </div>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row sm:justify-between sm:items-center sm:gap-4 mt-4 sm:mt-6">
                <div className="flex items-center gap-2 w-full sm:w-auto">
                    <div className="h-9 bg-gray-200 dark:bg-gray-700 rounded-md w-24 flex-1 sm:flex-none"></div>
                    <div className="h-9 bg-gray-200 dark:bg-gray-700 rounded-md w-24 flex-1 sm:flex-none"></div>
                </div>
                <div className="h-9 bg-gray-200 dark:bg-gray-700 rounded-md w-32 w-full sm:w-auto"></div>
            </div>
        </div>
    );
};

export default QuizSkeleton;