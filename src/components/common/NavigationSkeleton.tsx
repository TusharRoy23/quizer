const NavigationSkeleton = () => {
    return (
        <div className="flex flex-col gap-3 sm:flex-row sm:justify-between sm:items-center sm:gap-4 mt-4 sm:mt-6">
            <div className="flex items-center gap-2 w-full sm:w-auto">
                <div className="h-9 bg-gray-200 dark:bg-gray-700 rounded-md w-24 flex-1 sm:flex-none"></div>
                <div className="h-9 bg-gray-200 dark:bg-gray-700 rounded-md w-24 flex-1 sm:flex-none"></div>
            </div>
            <div className="h-9 bg-gray-200 dark:bg-gray-700 rounded-md w-32 w-full sm:w-auto"></div>
        </div>
    );
};
export default NavigationSkeleton;