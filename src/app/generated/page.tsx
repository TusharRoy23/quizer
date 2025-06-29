"use client";
import Button from "@/components/ui/button/Button";
import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table";
import { ArrowRight } from "@/icons";
import { QuizService } from "@/services/quizService";
import { QuizLog } from "@/types";
import { useEffect, useState } from "react";

export default function GeneratedPage() {
    const [logs, setLogs] = useState<QuizLog[]>([]);
    const getQuizLogList = async () => {
        try {
            const logs = await QuizService.getQuizLogList();
            console.log('logs: ', logs);
            setLogs(logs);
        } catch (error) {

        }
    }
    useEffect(() => {
        getQuizLogList();
    }, []);
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
                                        <Button size="sm" variant="outline" endIcon={<ArrowRight />} onClick={() => {
                                            // router.push('/generated');
                                        }}>
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