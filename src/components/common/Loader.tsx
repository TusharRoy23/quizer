import { LOADER_FOR } from "@/utils/enum";


export default function Loader({ loaderFor }: { loaderFor: LOADER_FOR }) {
    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br dark:from-gray-900 dark:to-gray-800 py-8 px-4">
            <div className="flex flex-col items-center">
                <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
                <p className="mt-6 text-lg font-semibold text-gray-700 dark:text-gray-200">
                    {loaderFor === LOADER_FOR.DEFAULT && "Loading..."}
                    {loaderFor === LOADER_FOR.GenerateQuiz && "Generating Quiz..."}
                    {loaderFor === LOADER_FOR.QuizResult && "Fetching Quiz Results..."}
                    {loaderFor === LOADER_FOR.QuizReview && "Loading Quiz Review..."}
                </p>
            </div>
        </div>
    )
}