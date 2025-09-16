"use client";
import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Table, TableBody, TableRow, TableCell } from "../ui/table";
import { QuizRequest, StepProps, Topic } from "@/utils/types";
import StepLayout from "../layouts/StepLayout";
import { ArrowRight } from "@/icons";
import { useRouter } from "next/navigation";
import { RootState } from "@/store";
import { QuizService } from "@/services/quizService";
import { setSearchEnable } from "@/store/reducers/searchSlice";

const SummaryData = () => {
    const selector = useSelector((state: RootState) => state.steps);
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
                                        {topics?.map((topic: Topic) => topic.name).join(", ")}
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

export default function Summary({ onPreviousStep }: StepProps) {
    const router = useRouter();
    const dispatch = useDispatch();
    const selector = useSelector((state: RootState) => state.steps);
    const [isGenerating, setIsGenerating] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const generateQuiz = async () => {
        const { form } = selector;
        setIsGenerating(true);
        setError(null);

        if (!form.department || !form.topics || !form.difficulty || !form.questionCount) {
            console.error("Please fill all the required fields before generating the quiz.");
            setIsGenerating(false);
            return;
        }

        dispatch(setSearchEnable(false));

        try {
            const { department, topics, difficulty, questionCount, timer } = form;
            const payload: QuizRequest = {
                department: department?.uuid,
                topics: topics?.map((topic: Topic) => topic.uuid),
                difficulty: difficulty?.value,
                question_count: +questionCount?.value,
                timer: timer,
            };
            const quizUuid = await QuizService.generateQuiz(payload);

            if (quizUuid) {
                router.push(`/quiz/${quizUuid}`);
            }
        } catch (error) {
            if (error instanceof Error) {
                setError(error.message);
            }
            setIsGenerating(false);
            setSearchEnable(true);
        }
    };

    return (
        <div className="relative">
            <StepLayout
                title="Summary"
                description={<SummaryData />}
                btnLabel={isGenerating ? "Starting..." : "Let's Start"}
                onNextStep={generateQuiz}
                onPreviousStep={onPreviousStep}
                endIcon={<ArrowRight />}
                errorMessage={error}
                nextBtnDisabled={isGenerating}
                prevBtnDisabled={isGenerating}
            />

            {/* Fullscreen Loader */}
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
        </div>
    );
}