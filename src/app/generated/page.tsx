"use client";
import ErrorDisplay from "@/components/error/errorDisplay";
import Button from "@/components/ui/button/Button";
import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table";
import { TableRowSkeleton } from "@/components/ui/table/TableRowSkeleton";
import { ArrowRight, Grid } from "@/icons";
import { QuizService } from "@/services/quizService";
import { PaginatedResponse, QuizResult } from "@/utils/types";
import { QueryFunctionContext, useInfiniteQuery } from "@tanstack/react-query";
import { useRouter } from "next/navigation";

const LIMIT = 10;

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

    return (
        <div className="rounded-2xl border border-gray-200 bg-white px-4 py-6 dark:border-gray-800 dark:bg-white/[0.03] sm:px-6 sm:py-8 lg:px-8 lg:py-10">
            <div className="w-full max-w-[630px] text-center mx-auto">
                <h3 className="mb-4 font-semibold text-gray-800 text-theme-xl dark:text-white/90 sm:text-2xl">
                    Quizzes
                </h3>
            </div>

            {/* Desktop Table */}
            <div className="hidden md:block overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">
                <div className="max-w-full">
                    <Table>
                        <TableBody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
                            <TableRow>
                                <TableCell className="px-4 py-3 sm:px-5 text-start">
                                    <div className="text-sm font-medium text-gray-900 dark:text-white">
                                        Date
                                    </div>
                                </TableCell>
                                <TableCell className="px-4 py-3 sm:px-5 text-start">
                                    <div className="text-sm font-medium text-gray-900 dark:text-white">
                                        Difficulty
                                    </div>
                                </TableCell>
                                <TableCell className="px-4 py-3 sm:px-5 text-start">
                                    <div className="text-sm font-medium text-gray-900 dark:text-white">
                                        Questions
                                    </div>
                                </TableCell>
                                <TableCell className="px-4 py-3 sm:px-5 text-start">
                                    <div className="text-sm font-medium text-gray-900 dark:text-white">
                                        Answers
                                    </div>
                                </TableCell>
                                <TableCell className="px-4 py-3 sm:px-5 text-start">
                                    <div className="text-sm font-medium text-gray-900 dark:text-white">
                                        Correct
                                    </div>
                                </TableCell>
                                <TableCell className="px-4 py-3 sm:px-5 text-start">
                                    <div className="text-sm font-medium text-gray-900 dark:text-white">
                                        Timer
                                    </div>
                                </TableCell>
                                <TableCell className="px-4 py-3 sm:px-5 text-start">
                                    <div className="text-sm font-medium text-gray-900 dark:text-white">
                                        Score
                                    </div>
                                </TableCell>
                                <TableCell className="px-4 py-3 sm:px-5 text-start">
                                    <div className="text-sm font-medium text-gray-900 dark:text-white">
                                        #
                                    </div>
                                </TableCell>
                            </TableRow>

                            {/* Loading State */}
                            {isLoading && allLogs.length === 0 && (
                                <>
                                    {Array(5).fill(0).map((_, i) => (
                                        <TableRowSkeleton arrLen={8} key={`skeleton-${i}`} />
                                    ))}
                                </>
                            )}

                            {/* Data Rows */}
                            {allLogs?.map((log) => (
                                <TableRow key={log.uuid} className="fade-in">
                                    <TableCell className="px-4 py-3 sm:px-5 text-start">
                                        <div className="text-sm text-gray-500 dark:text-gray-400">
                                            {log.created_at ? new Date(log.created_at).toLocaleDateString() : '-'}
                                        </div>
                                    </TableCell>
                                    <TableCell className="px-4 py-3 sm:px-5 text-start">
                                        <div className="text-sm text-gray-500 dark:text-gray-400">
                                            {log.difficulty}
                                        </div>
                                    </TableCell>
                                    <TableCell className="px-4 py-3 sm:px-5 text-start">
                                        <div className="text-sm text-gray-500 dark:text-gray-400">
                                            {log.question_count}
                                        </div>
                                    </TableCell>
                                    <TableCell className="px-4 py-3 sm:px-5 text-start">
                                        <div className="text-sm text-gray-500 dark:text-gray-400">
                                            {log.total_answers}
                                        </div>
                                    </TableCell>
                                    <TableCell className="px-4 py-3 sm:px-5 text-start">
                                        <div className="text-sm text-gray-500 dark:text-gray-400">
                                            {log.total_correct}
                                        </div>
                                    </TableCell>
                                    <TableCell className="px-4 py-3 sm:px-5 text-start">
                                        <div className="text-sm text-gray-500 dark:text-gray-400">
                                            {log.timer}
                                        </div>
                                    </TableCell>
                                    <TableCell className="px-4 py-3 sm:px-5 text-start">
                                        <div className="text-sm text-gray-500 dark:text-gray-400">
                                            {log.score ? `${log.score}%` : '-'}
                                        </div>
                                    </TableCell>
                                    <TableCell className="px-4 py-3 sm:px-5 text-start">
                                        <Button size="sm" variant="outline" endIcon={<ArrowRight />} onClick={() => handleNavigation(log.uuid)}>
                                            Review
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))}

                            {/* Load More */}
                            <TableRow>
                                <TableCell colSpan={8} className="text-center py-4">
                                    {isFetchingNextPage ? (
                                        <div className="flex justify-center">
                                            <div className="h-8 w-8 border-4 border-gray-300 border-t-primary rounded-full animate-spin"></div>
                                        </div>
                                    ) : hasNextPage ? (
                                        <Button
                                            startIcon={<Grid />}
                                            onClick={() => fetchNextPage()}
                                            variant="outline"
                                            size="sm"
                                        >
                                            Load More
                                        </Button>
                                    ) : null}
                                </TableCell>
                            </TableRow>
                        </TableBody>
                    </Table>
                </div>
            </div>

            {/* Mobile Cards */}
            <div className="md:hidden">
                {/* Loading State */}
                {isLoading && allLogs.length === 0 && (
                    <div className="grid grid-cols-2 gap-4">
                        {Array(6).fill(0).map((_, i) => (
                            <div key={`mobile-skeleton-${i}`} className="rounded-lg border border-gray-200 dark:border-gray-700 p-4 animate-pulse">
                                <div className="space-y-3">
                                    <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded"></div>
                                    <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
                                    <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {/* Data Cards */}
                <div className="grid grid-cols-2 gap-4">
                    {allLogs?.map((log) => (
                        <div key={log.uuid} className="rounded-lg border border-gray-200 dark:border-gray-700 p-4 bg-white dark:bg-white/[0.03] fade-in">
                            <div className="grid grid-cols-2 gap-4 mb-3">
                                <div>
                                    <p className="text-xs font-medium text-gray-500 dark:text-gray-400">Date</p>
                                    <p className="text-sm text-gray-900 dark:text-white">
                                        {log.created_at ? new Date(log.created_at).toLocaleDateString() : '-'}
                                    </p>
                                </div>
                                <div>
                                    <p className="text-xs font-medium text-gray-500 dark:text-gray-400">Difficulty</p>
                                    <p className="text-sm text-gray-900 dark:text-white">{log.difficulty}</p>
                                </div>
                                <div>
                                    <p className="text-xs font-medium text-gray-500 dark:text-gray-400">Questions</p>
                                    <p className="text-sm text-gray-900 dark:text-white">{log.question_count}</p>
                                </div>
                                <div>
                                    <p className="text-xs font-medium text-gray-500 dark:text-gray-400">Score</p>
                                    <p className="text-sm text-gray-900 dark:text-white">
                                        {log.score ? `${log.score}%` : '-'}
                                    </p>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4 mb-4">
                                <div>
                                    <p className="text-xs font-medium text-gray-500 dark:text-gray-400">Correct</p>
                                    <p className="text-sm text-gray-900 dark:text-white">
                                        {log.total_correct}/{log.total_answers}
                                    </p>
                                </div>
                                <div>
                                    <p className="text-xs font-medium text-gray-500 dark:text-gray-400">Timer</p>
                                    <p className="text-sm text-gray-900 dark:text-white">{log.timer}m</p>
                                </div>
                            </div>

                            <div className="flex justify-center">
                                <Button
                                    size="sm"
                                    variant="outline"
                                    endIcon={<ArrowRight />}
                                    onClick={() => handleNavigation(log.uuid)}
                                    className="w-full justify-center"
                                >
                                    Review
                                </Button>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Load More for Mobile */}
                {hasNextPage && (
                    <div className="text-center pt-4">
                        {isFetchingNextPage ? (
                            <div className="flex justify-center">
                                <div className="h-8 w-8 border-4 border-gray-300 border-t-primary rounded-full animate-spin"></div>
                            </div>
                        ) : (
                            <Button
                                startIcon={<Grid />}
                                onClick={() => fetchNextPage()}
                                variant="outline"
                                size="sm"
                                className="w-full justify-center"
                            >
                                Load More
                            </Button>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}