"use client";
import Button from "@/components/ui/button/Button";
import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table";
import { CheckCircle } from "@/icons";
import { useRouter } from "next/navigation";

export default function ResultPage() {
    const router = useRouter();
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
                                            01:00
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
                                            Hard
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
                                            2
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
                                            2
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
                                            2
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
                                            100%
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