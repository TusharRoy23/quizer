"use client";
import Button from "@/components/ui/button/Button";
import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table";
import { ArrowRight } from "@/icons";
import { QuizService } from "@/services/quizService";
import { QuizResult } from "@/types";
import { useQuery } from "@tanstack/react-query";
import { useRouter } from "next/navigation";

export default function GeneratedPage() {
    const router = useRouter();
    const { data: logs = [], isLoading, isError } = useQuery<QuizResult[]>({
        queryKey: ["quizLogs"],
        queryFn: QuizService.getQuizLogList,
    });
    const handleNavigation = async (uuid: string) => {
        try {
            router.push(`/generated/questions/${uuid}`);
        } catch (error) {
            console.error('Navigation error:', error);
        }
    };
    return (
        <div className="rounded-2xl border border-gray-200 bg-white px-5 py-7 dark:border-gray-800 dark:bg-white/[0.03] xl:px-10 xl:py-12">
            <div className="w-full max-w-[630px] text-center">
                <h3 className="mb-4 font-semibold text-gray-800 text-theme-xl dark:text-white/90 sm:text-2xl">
                    Generated Questions
                </h3>
            </div>
            <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">
                <div className="max-w-full">
                    <Table>
                        <TableBody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
                            <TableRow>
                                <TableCell className="px-5 py-4 sm:px-6 text-start">
                                    <div className="text-sm font-medium text-gray-900 dark:text-white">
                                        Difficulty
                                    </div>
                                </TableCell>
                                <TableCell className="px-5 py-4 sm:px-6 text-start">
                                    <div className="text-sm font-medium text-gray-900 dark:text-white">
                                        Questions
                                    </div>
                                </TableCell>
                                <TableCell className="px-5 py-4 sm:px-6 text-start">
                                    <div className="text-sm font-medium text-gray-900 dark:text-white">
                                        Answers
                                    </div>
                                </TableCell>
                                <TableCell className="px-5 py-4 sm:px-6 text-start">
                                    <div className="text-sm font-medium text-gray-900 dark:text-white">
                                        Correct
                                    </div>
                                </TableCell>
                                <TableCell className="px-5 py-4 sm:px-6 text-start">
                                    <div className="text-sm font-medium text-gray-900 dark:text-white">
                                        Timer
                                    </div>
                                </TableCell>
                                <TableCell className="px-5 py-4 sm:px-6 text-start">
                                    <div className="text-sm font-medium text-gray-900 dark:text-white">
                                        Score
                                    </div>
                                </TableCell>
                                <TableCell className="px-5 py-4 sm:px-6 text-start">
                                    <div className="text-sm font-medium text-gray-900 dark:text-white">
                                        #
                                    </div>
                                </TableCell>
                            </TableRow>
                            {logs.map((log) => (
                                <TableRow key={log.uuid}>
                                    <TableCell className="px-5 py-4 sm:px-6 text-start">
                                        <div className="text-sm text-gray-500 dark:text-gray-400">
                                            {log.difficulty}
                                        </div>
                                    </TableCell>
                                    <TableCell className="px-5 py-4 sm:px-6 text-start">
                                        <div className="text-sm text-gray-500 dark:text-gray-400">
                                            {log.question_count}
                                        </div>
                                    </TableCell>
                                    <TableCell className="px-5 py-4 sm:px-6 text-start">
                                        <div className="text-sm text-gray-500 dark:text-gray-400">
                                            {log.total_answers}
                                        </div>
                                    </TableCell>
                                    <TableCell className="px-5 py-4 sm:px-6 text-start">
                                        <div className="text-sm text-gray-500 dark:text-gray-400">
                                            {log.total_correct}
                                        </div>
                                    </TableCell>
                                    <TableCell className="px-5 py-4 sm:px-6 text-start">
                                        <div className="text-sm text-gray-500 dark:text-gray-400">
                                            {log.timer}
                                        </div>
                                    </TableCell>
                                    <TableCell className="px-5 py-4 sm:px-6 text-start">
                                        <div className="text-sm text-gray-500 dark:text-gray-400">
                                            {log.score ? `${log.score}%` : '-'}
                                        </div>
                                    </TableCell>
                                    <TableCell className="px-5 py-4 sm:px-6 text-start">
                                        <Button size="sm" variant="outline" endIcon={<ArrowRight />} onClick={() => handleNavigation(log.uuid)}>
                                            Revision
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </div>
            </div>
        </div >
    );
}