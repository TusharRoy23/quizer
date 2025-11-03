export default function FullScreenLoader({ isGenerating = false }: { isGenerating: boolean }) {
    return (
        <>
            {isGenerating && (
                <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-white/80 backdrop-blur-sm dark:bg-black/70">
                    <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
                    <p className="mt-6 text-lg font-semibold text-gray-700 dark:text-gray-200">
                        Generating your quiz…
                    </p>
                    <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                        This may take a few minutes ⏳
                    </p>
                </div>
            )}
        </>
    );
}