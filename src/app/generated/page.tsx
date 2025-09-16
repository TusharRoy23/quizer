"use client";
import ErrorDisplay from "@/components/error/errorDisplay";
import Button from "@/components/ui/button/Button";
import { ArrowRight, Grid, Calendar, Clock, Trophy, CheckCircle2, QuestionMark } from "@/icons";
import { QuizService } from "@/services/quizService";
import { PaginatedResponse, QuizResult } from "@/utils/types";
import { QueryFunctionContext, useInfiniteQuery } from "@tanstack/react-query";
import { useRouter } from "next/navigation";

const LIMIT = 12; // Increased to be divisible by 3

export default function GeneratedPage() {
    const router = useRouter();
    const {
        data,
        isError,
        isFetchingNextPage,
        fetchNextPage,
        hasNextPage,
        error,
        isLoading,
    } = useInfiniteQuery<PaginatedResponse<QuizResult>>({
        queryKey: ["quizLogs"],
        initialPageParam: 1,
        queryFn: async ({ pageParam = 1 }: QueryFunctionContext) => {
            const page = (pageParam as number) || 1;
            return QuizService.getQuizLogList({ page, limit: LIMIT });
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
            router.push(`/generated/questions/${uuid}?page=1`);
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
        <div className="rounded-2xl border border-gray-200 bg-white px-4 py-6 dark:border-gray-800 dark:bg-white/[0.03] sm:px-6 sm:py-8 lg:px-8 lg:py-10">
            <div className="w-full max-w-[630px] text-center mx-auto mb-8">
                <h3 className="mb-2 font-semibold text-gray-800 text-theme-xl dark:text-white/90 sm:text-2xl">
                    Quiz History
                </h3>
                <p className="text-gray-500 dark:text-gray-400">
                    Review your past quiz attempts and track your progress
                </p>
            </div>

            {/* Desktop Grid Layout - 3 cards per row */}
            <div className="hidden md:block">
                {/* Loading State */}
                {isLoading && allLogs.length === 0 && (
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        {Array(6).fill(0).map((_, i) => (
                            <div key={`desktop-skeleton-${i}`} className="rounded-xl border border-gray-200 dark:border-gray-700 p-5 animate-pulse bg-white dark:bg-white/[0.03]">
                                <div className="space-y-4">
                                    <div className="flex justify-between items-start">
                                        <div className="h-5 bg-gray-200 dark:bg-gray-700 rounded w-2/5"></div>
                                        <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-16"></div>
                                    </div>
                                    <div className="grid grid-cols-2 gap-3">
                                        {Array(4).fill(0).map((_, j) => (
                                            <div key={j} className="h-4 bg-gray-200 dark:bg-gray-700 rounded"></div>
                                        ))}
                                    </div>
                                    <div className="h-9 bg-gray-200 dark:bg-gray-700 rounded"></div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {/* Data Cards - 3 columns */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {allLogs?.map((log) => (
                        <div key={log.uuid} className="rounded-xl border border-gray-200 dark:border-gray-700 p-5 bg-white dark:bg-white/[0.03] hover:shadow-md transition-shadow fade-in group">
                            {/* Header with Date and Difficulty */}
                            <div className="flex justify-between items-start mb-4">
                                <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                                    <Calendar className="w-4 h-4 mr-1" />
                                    {log.created_at ? new Date(log.created_at).toLocaleDateString() : '-'}
                                </div>
                                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getDifficultyColor(log.difficulty)}`}>
                                    {log.difficulty || 'Unknown'}
                                </span>
                            </div>

                            {/* Stats Grid - Compact for 3 columns */}
                            <div className="grid grid-cols-2 gap-3 mb-5">
                                <div className="text-center p-2 bg-gray-50 dark:bg-gray-800 rounded-lg">
                                    <div className="flex items-center justify-center mb-1">
                                        <QuestionMark className="w-3 h-3 mr-1 text-blue-500" />
                                        <span className="text-xs font-medium text-gray-600 dark:text-gray-300">Questions</span>
                                    </div>
                                    <div className="text-lg font-bold text-gray-900 dark:text-white">{log.question_count}</div>
                                </div>

                                <div className="text-center p-2 bg-gray-50 dark:bg-gray-800 rounded-lg">
                                    <div className="flex items-center justify-center mb-1">
                                        <CheckCircle2 className="w-3 h-3 mr-1 text-green-500" />
                                        <span className="text-xs font-medium text-gray-600 dark:text-gray-300">Correct</span>
                                    </div>
                                    <div className="text-lg font-bold text-gray-900 dark:text-white">
                                        {log.total_correct}/{log.total_answers}
                                    </div>
                                </div>

                                <div className="text-center p-2 bg-gray-50 dark:bg-gray-800 rounded-lg">
                                    <div className="flex items-center justify-center mb-1">
                                        <Clock className="w-3 h-3 mr-1 text-purple-500" />
                                        <span className="text-xs font-medium text-gray-600 dark:text-gray-300">Timer</span>
                                    </div>
                                    <div className="text-lg font-bold text-gray-900 dark:text-white">{log.timer}m</div>
                                </div>

                                <div className="text-center p-2 bg-gray-50 dark:bg-gray-800 rounded-lg">
                                    <div className="flex items-center justify-center mb-1">
                                        <Trophy className="w-3 h-3 mr-1 text-yellow-500" />
                                        <span className="text-xs font-medium text-gray-600 dark:text-gray-300">Score</span>
                                    </div>
                                    <div className="text-lg font-bold text-gray-900 dark:text-white">
                                        {log.score ? `${log.score}%` : '-'}
                                    </div>
                                </div>
                            </div>

                            {/* Progress Bar */}
                            {
                                <div className="mb-5">
                                    <div className="flex justify-between text-xs text-gray-600 dark:text-gray-300 mb-1">
                                        <span>Progress</span>
                                        <span>{log.score}%</span>
                                    </div>
                                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-1.5">
                                        <div
                                            className="bg-gradient-to-r from-blue-500 to-purple-600 h-1.5 rounded-full transition-all duration-300"
                                            style={{ width: `${log.score}%` }}
                                        ></div>
                                    </div>
                                </div>
                            }

                            {/* Action Button */}
                            <Button
                                size="sm"
                                variant="primary"
                                endIcon={<ArrowRight />}
                                onClick={() => handleNavigation(log.uuid)}
                                className="w-full group-hover:bg-gradient-to-r group-hover:from-blue-600 group-hover:to-purple-600 transition-all text-sm py-2"
                            >
                                Review Quiz
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
            </div>

            {/* Mobile Cards */}
            <div className="md:hidden">
                {/* Loading State */}
                {isLoading && allLogs.length === 0 && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {Array(4).fill(0).map((_, i) => (
                            <div key={`mobile-skeleton-${i}`} className="rounded-xl border border-gray-200 dark:border-gray-700 p-4 animate-pulse bg-white dark:bg-white/[0.03]">
                                <div className="space-y-4">
                                    <div className="flex justify-between items-start">
                                        <div className="h-5 bg-gray-200 dark:bg-gray-700 rounded w-1/3"></div>
                                        <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-16"></div>
                                    </div>
                                    <div className="grid grid-cols-2 gap-3">
                                        <div className="h-12 bg-gray-200 dark:bg-gray-700 rounded-lg"></div>
                                        <div className="h-12 bg-gray-200 dark:bg-gray-700 rounded-lg"></div>
                                        <div className="h-12 bg-gray-200 dark:bg-gray-700 rounded-lg"></div>
                                        <div className="h-12 bg-gray-200 dark:bg-gray-700 rounded-lg"></div>
                                    </div>
                                    <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded"></div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {/* Data Cards - 2 columns per row */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {allLogs?.map((log) => (
                        <div key={log.uuid} className="rounded-xl border border-gray-200 dark:border-gray-700 p-4 bg-white dark:bg-white/[0.03] hover:shadow-md transition-shadow fade-in">
                            {/* Header with Date and Difficulty */}
                            <div className="flex justify-between items-start mb-4">
                                <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                                    <Calendar className="w-4 h-4 mr-1" />
                                    {log.created_at ? new Date(log.created_at).toLocaleDateString() : '-'}
                                </div>
                                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getDifficultyColor(log.difficulty)}`}>
                                    {log.difficulty || 'Unknown'}
                                </span>
                            </div>

                            {/* Stats Grid - Mobile Optimized */}
                            <div className="grid grid-cols-2 gap-3 mb-4">
                                <div className="text-center p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                                    <div className="flex items-center justify-center mb-1">
                                        <QuestionMark className="w-4 h-4 mr-1 text-blue-500" />
                                        <span className="text-xs font-medium text-gray-600 dark:text-gray-300">Questions</span>
                                    </div>
                                    <div className="text-lg font-bold text-gray-900 dark:text-white">{log.question_count}</div>
                                </div>

                                <div className="text-center p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                                    <div className="flex items-center justify-center mb-1">
                                        <CheckCircle2 className="w-4 h-4 mr-1 text-green-500" />
                                        <span className="text-xs font-medium text-gray-600 dark:text-gray-300">Correct</span>
                                    </div>
                                    <div className="text-lg font-bold text-gray-900 dark:text-white">
                                        {log.total_correct}/{log.total_answers}
                                    </div>
                                </div>

                                <div className="text-center p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                                    <div className="flex items-center justify-center mb-1">
                                        <Clock className="w-4 h-4 mr-1 text-purple-500" />
                                        <span className="text-xs font-medium text-gray-600 dark:text-gray-300">Timer</span>
                                    </div>
                                    <div className="text-lg font-bold text-gray-900 dark:text-white">{log.timer}m</div>
                                </div>

                                <div className="text-center p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                                    <div className="flex items-center justify-center mb-1">
                                        <Trophy className="w-4 h-4 mr-1 text-yellow-500" />
                                        <span className="text-xs font-medium text-gray-600 dark:text-gray-300">Score</span>
                                    </div>
                                    <div className="text-lg font-bold text-gray-900 dark:text-white">
                                        {log.score ? `${log.score}%` : '-'}
                                    </div>
                                </div>
                            </div>

                            {/* Progress Bar */}
                            {
                                <div className="mb-4">
                                    <div className="flex justify-between text-xs text-gray-600 dark:text-gray-300 mb-1">
                                        <span>Progress</span>
                                        <span>{log.score}%</span>
                                    </div>
                                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                                        <div
                                            className="bg-gradient-to-r from-blue-500 to-purple-600 h-2 rounded-full transition-all duration-300"
                                            style={{ width: `${log.score}%` }}
                                        ></div>
                                    </div>
                                </div>
                            }

                            {/* Action Button */}
                            <Button
                                size="sm"
                                variant="primary"
                                endIcon={<ArrowRight />}
                                onClick={() => handleNavigation(log.uuid)}
                                className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 transition-all"
                            >
                                Review Quiz
                            </Button>
                        </div>
                    ))}
                </div>

                {/* Load More for Mobile */}
                {hasNextPage && (
                    <div className="text-center pt-6">
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
                                className="w-full justify-center"
                            >
                                Load More Quizzes
                            </Button>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}