"use client";
import Button from "@/components/ui/button/Button";
import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table";
import { CheckCircle } from "@/icons";
import { QuizService } from "@/services/quizService";
import { QuizResult } from "@/types";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function ResultPage() {
    const router = useRouter();
    const params = useParams();
    const uuid = params?.uuid as string || "";
    const [result, setResult] = useState<QuizResult>();

    const getQuizResult = async (uuid: string) => {
        const result = await QuizService.getQuizResult(uuid as string);
        if (result) {
            console.log("Quiz Result:", result);
            setResult(result);
        } else {
            console.error("Failed to fetch quiz result");
        }
    }

    useEffect(() => {
        if (uuid) {
            getQuizResult(uuid);
        }
    }, [uuid]);
    return (
        <>
            <div className="rounded-2xl border border-gray-200 bg-white px-5 py-7 dark:border-gray-800 dark:bg-white/[0.03] xl:px-10 xl:py-12">
                <div className="w-full max-w-[630px] text-center">
                    <h3 className="mb-4 font-semibold text-gray-800 text-theme-xl dark:text-white/90 sm:text-2xl">
                        Your Score 🎉
                    </h3>
                </div>
                <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">
                    <div className="max-w-full">
                        <Table>
                            <TableBody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
                                <TableRow>
                                    <TableCell className="px-5 py-4 sm:px-6 text-start">
                                        <div className="text-sm font-medium text-gray-900 dark:text-white">
                                            Time
                                        </div>
                                    </TableCell>
                                    <TableCell className="px-5 py-4 text-start">
                                        <div className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                                            {result?.timer} min
                                        </div>
                                    </TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell className="px-5 py-4 sm:px-6 text-start">
                                        <div className="text-sm font-medium text-gray-900 dark:text-white">
                                            Difficulty
                                        </div>
                                    </TableCell>
                                    <TableCell className="px-5 py-4 text-start">
                                        <div className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                                            {result?.difficulty.toLocaleUpperCase()}
                                        </div>
                                    </TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell className="px-5 py-4 sm:px-6 text-start">
                                        <div className="text-sm font-medium text-gray-900 dark:text-white">
                                            Total Questions
                                        </div>
                                    </TableCell>
                                    <TableCell className="px-5 py-4 text-start">
                                        <div className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                                            {result?.question_count}
                                        </div>
                                    </TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell className="px-5 py-4 sm:px-6 text-start">
                                        <div className="text-sm font-medium text-gray-900 dark:text-white">
                                            Total Answered
                                        </div>
                                    </TableCell>
                                    <TableCell className="px-5 py-4 text-start">
                                        <div className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                                            {result?.total_answers}
                                        </div>
                                    </TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell className="px-5 py-4 sm:px-6 text-start">
                                        <div className="text-sm font-medium text-gray-900 dark:text-white">
                                            Correct Answer
                                        </div>
                                    </TableCell>
                                    <TableCell className="px-5 py-4 text-start">
                                        <div className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                                            {result?.total_correct}
                                        </div>
                                    </TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell className="px-5 py-4 sm:px-6 text-start">
                                        <div className="text-sm font-medium text-gray-900 dark:text-white">
                                            Your Score
                                        </div>
                                    </TableCell>
                                    <TableCell className="px-5 py-4 text-start">
                                        <div className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                                            {result?.score}%
                                        </div>
                                    </TableCell>
                                </TableRow>
                            </TableBody>
                        </Table>
                    </div>
                    <div className="flex justify-center mt-4">
                        <Button size="sm" variant="primary" endIcon={<CheckCircle />} onClick={() => {
                            router.push("/");
                        }}>
                            Test Again
                        </Button>
                    </div>
                </div>
            </div>
        </>
    );
}