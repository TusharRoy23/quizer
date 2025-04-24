import React from "react";
import { useSelector } from "react-redux";
import { Table, TableBody, TableRow, TableCell } from "../ui/table";
import { StepProps } from "@/types";
import StepLayout from "../layouts/StepLayout";
import { ArrowRight } from "@/icons";

const SummaryData = () => {
    const selector = useSelector((state: any) => state.steps);
    const { department, topics, difficulty, questionCount, timer } = selector.form;

    return (
        <>
            <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">
                <div className="max-w-full">
                    {/* <div className="min-w-[1102px]"> */}
                    <Table>
                        <TableBody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
                            <TableRow>
                                <TableCell className="px-5 py-4 sm:px-6 text-start">
                                    <div className="text-sm font-medium text-gray-900 dark:text-white">
                                        Department
                                    </div>
                                </TableCell>
                                <TableCell className="px-5 py-4 text-start">
                                    <div className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                                        {department?.name}
                                    </div>
                                </TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell className="px-5 py-4 sm:px-6 text-start">
                                    <div className="text-sm font-medium text-gray-900 dark:text-white">
                                        Topic
                                    </div>
                                </TableCell>
                                <TableCell className="px-5 py-4 text-start">
                                    <div className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                                        {topics?.map((topic: any) => topic.name).join(", ")}
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
                                        {difficulty?.name}
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
                                        {questionCount?.name}
                                    </div>
                                </TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell className="px-5 py-4 sm:px-6 text-start">
                                    <div className="text-sm font-medium text-gray-900 dark:text-white">
                                        Timer
                                    </div>
                                </TableCell>
                                <TableCell className="px-5 py-4 text-start">
                                    <div className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                                        {timer} minutes
                                    </div>
                                </TableCell>
                            </TableRow>
                        </TableBody>
                    </Table>
                    {/* </div> */}
                </div>
            </div>
        </>
    );
};

export default function Summary({ onNextStep, onPreviousStep }: StepProps) {
    return (
        <StepLayout
            title={"Summary"}
            description={<SummaryData />}
            btnLabel={"Let's Start"}
            onNextStep={onNextStep}
            onPreviousStep={onPreviousStep}
            endIcon={<ArrowRight />}
        />
    );
}