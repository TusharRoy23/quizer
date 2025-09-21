import { ArrowRight, Calendar, Grid } from "@/icons";
import { QuizService } from "@/services/quizService";
import { PaginatedResponse, QuizResult } from "@/utils/types";
import { QueryFunctionContext, useInfiniteQuery } from "@tanstack/react-query";
import Button from "../ui/button/Button";
import ErrorDisplay from "../error/errorDisplay";
import { useRouter } from "next/navigation";
import { useDispatch } from "react-redux";
import { setActiveTab } from "@/store/reducers/tabSlice";

const LIMIT = 12;

export default function VerbalLogs() {
    const router = useRouter();
    const dispatch = useDispatch();

    const {
        data,
        isError,
        isFetchingNextPage,
        fetchNextPage,
        hasNextPage,
        error,
        isLoading,
    } = useInfiniteQuery<PaginatedResponse<QuizResult>>({
        queryKey: ["verbalQuizLogs"],
        initialPageParam: 1,
        queryFn: async ({ pageParam = 1 }: QueryFunctionContext) => {
            const page = (pageParam as number) || 1;
            return QuizService.getVerbalQuizLogs({ page, limit: LIMIT });
        },
        getNextPageParam: (lastPage) => {
            if (lastPage.meta.hasNextPage) {
                return lastPage.meta.page + 1;
            }
            return undefined;
        },
        retry: 1,
    });

    const allLogs = data?.pages.flatMap(page => page.data) || [];

    if (isError) {
        return <ErrorDisplay
            title="Error"
            message={error?.message}
            onReturn={() => router.push("/")}
        />
    }

    const handleNavigation = async (uuid: string) => {
        try {
            router.push(`/verbal/${uuid}/feedback`);
        } catch (error) {
            console.error('Navigation error:', error);
        }
    };

    // Function to get difficulty color
    const getDifficultyColor = (difficulty: string) => {
        switch (difficulty?.toLowerCase()) {
            case 'easy': return 'text-green-600 bg-green-100 dark:bg-green-900/30';
            case 'medium': return 'text-yellow-600 bg-yellow-100 dark:bg-yellow-900/30';
            case 'hard': return 'text-red-600 bg-red-100 dark:bg-red-900/30';
            default: return 'text-gray-600 bg-gray-100 dark:bg-gray-800';
        }
    };

    return (
        <div className="min-h-[400px]">
            <div className="rounded-2xl border border-gray-200 bg-white px-4 py-6 dark:border-gray-800 dark:bg-white/[0.03] sm:px-6 sm:py-8 lg:px-8 lg:py-10">
                <div className="w-full max-w-[630px] text-center mx-auto mb-8">
                    <h3 className="mb-2 font-semibold text-gray-800 text-theme-xl dark:text-white/90 sm:text-2xl">
                        Verbal Quiz History
                    </h3>
                    <p className="text-gray-500 dark:text-gray-400">
                        Review your past quiz attempts and track your progress
                    </p>
                </div>

                {/* Desktop Grid Layout */}
                <div className="hidden md:block">
                    {/* Loading State */}
                    {isLoading && allLogs.length === 0 && (
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                            {Array(6).fill(0).map((_, i) => (
                                <div key={`desktop-skeleton-${i}`} className="rounded-xl border border-gray-200 dark:border-gray-700 p-5 animate-pulse bg-white dark:bg-white/[0.03]">
                                    <div className="space-y-4">
                                        <div className="grid grid-cols-2 justify-between items-start mb-4">
                                            <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-16"></div>
                                            <div className="h-5 bg-gray-200 dark:bg-gray-700 rounded w-2/5"></div>
                                        </div>
                                        <div className="grid gap-3 mb-4">
                                            {Array(1).fill(0).map((_, j) => (
                                                <div key={j} className="h-4 bg-gray-200 dark:bg-gray-700 rounded"></div>
                                            ))}
                                        </div>
                                        <div className="h-9 bg-gray-200 dark:bg-gray-700 rounded"></div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}

                    {/* Data Cards */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        {allLogs?.map((log) => (
                            <div key={log.uuid} className="rounded-xl border border-gray-200 dark:border-gray-700 p-5 bg-white dark:bg-white/[0.03] hover:shadow-lg transition-all duration-300 group cursor-pointer"
                            >

                                {/* Header */}
                                <div className="grid grid-cols-2 justify-between items-start mb-4">
                                    <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                                        <Calendar className="w-4 h-4 mr-1" />
                                        {log.created_at ? new Date(log.created_at).toLocaleDateString() : '-'}
                                    </div>
                                    <div className="flex flex-col items-end gap-1">
                                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getDifficultyColor(log.difficulty)}`}>
                                            {log.difficulty || 'Unknown'}
                                        </span>
                                    </div>
                                </div>

                                {/* Action Buttons */}
                                <div className="flex gap-2">
                                    <Button
                                        size="sm"
                                        variant="primary"
                                        endIcon={<ArrowRight />}
                                        onClick={() => {
                                            handleNavigation(log.uuid);
                                        }}
                                        className="flex-1 group-hover:bg-gradient-to-r group-hover:from-blue-600 group-hover:to-purple-600 transition-all"
                                    >
                                        Review
                                    </Button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Mobile Layout */}
                <div className="md:hidden space-y-4">
                    {allLogs?.map((log) => (
                        <div key={log.uuid} className="rounded-xl border border-gray-200 dark:border-gray-700 p-4 bg-white dark:bg-white/[0.03]">
                            <div className="flex justify-between items-start mb-3">
                                <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                                    <Calendar className="w-4 h-4 mr-1" />
                                    {log.created_at ? new Date(log.created_at).toLocaleDateString() : '-'}
                                </div>
                                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getDifficultyColor(log.difficulty)}`}>
                                    {log.difficulty}
                                </span>
                            </div>

                            <Button
                                size="sm"
                                variant="primary"
                                endIcon={<ArrowRight />}
                                onClick={() => handleNavigation(log.uuid)}
                                className="w-full"
                            >
                                View Details
                            </Button>
                        </div>
                    ))}
                </div>

                {/* Load More */}
                {hasNextPage && (
                    <div className="text-center pt-8">
                        {isFetchingNextPage ? (
                            <div className="flex justify-center">
                                <div className="h-10 w-10 border-4 border-gray-300 border-t-blue-500 rounded-full animate-spin"></div>
                            </div>
                        ) : (
                            <Button
                                startIcon={<Grid />}
                                onClick={() => fetchNextPage()}
                                variant="outline"
                                size="md"
                                className="px-8"
                            >
                                Load More Quizzes
                            </Button>
                        )}
                    </div>
                )}

                {/* Empty State */}
                {!isLoading && allLogs.length === 0 && (
                    <div className="text-center py-12">
                        <div className="text-gray-400 text-6xl mb-4">🎤</div>
                        <h3 className="text-lg font-semibold text-gray-600 dark:text-gray-300 mb-2">
                            No Verbal Quizzes Yet
                        </h3>
                        <p className="text-gray-500 dark:text-gray-400 mb-6">
                            Start your first verbal quiz to see your history here!
                        </p>
                        <Button
                            onClick={() => {
                                dispatch(setActiveTab('create'));
                                router.push('/verbal');
                            }}
                            variant="primary"
                            size="md"
                        >
                            Start Your First Quiz
                        </Button>
                    </div>
                )}
            </div>
        </div>
    );
}