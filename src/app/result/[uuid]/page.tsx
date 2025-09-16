"use client";
import ErrorDisplay from "@/components/error/errorDisplay";
import Button from "@/components/ui/button/Button";
import { CheckCircle, Clock, Trophy, CheckList, Star, CheckList2, CheckCircle2 } from "@/icons";
import { QuizService } from "@/services/quizService";
import { QuizResult } from "@/utils/types";
import { useQuery } from "@tanstack/react-query";
import { useParams, useRouter } from "next/navigation";
import { File } from "@/icons";

export default function ResultPage() {
    const router = useRouter();
    const params = useParams();
    const uuid = params?.uuid as string || "";

    const { data: result, isError, error } = useQuery<QuizResult>({
        queryKey: ["quizResult", uuid],
        queryFn: () => QuizService.getQuizResult(uuid),
        enabled: !!uuid,
        retry: false
    });

    if (isError) {
        return (
            <ErrorDisplay
                title="Quiz Results Unavailable"
                message={error?.message}
                onReturn={() => router.push("/")}
            />
        );
    }

    return (
        <>
            {result && (
                <div className="flex flex-col items-center text-center rounded-2xl border border-gray-200 bg-white px-6 py-10 shadow-sm dark:border-gray-800 dark:bg-white/[0.03]">

                    {/* 🎯 Circular Score Ring */}
                    <div className="relative w-36 h-36 mb-6">
                        <svg className="w-full h-full rotate-[-90deg]" viewBox="0 0 120 120">
                            <circle
                                cx="60"
                                cy="60"
                                r="54"
                                stroke="#e5e7eb"
                                strokeWidth="12"
                                fill="none"
                            />
                            <circle
                                cx="60"
                                cy="60"
                                r="54"
                                stroke="#4ade80"
                                strokeWidth="12"
                                fill="none"
                                strokeDasharray={339.292} // 2πr
                                strokeDashoffset={339.292 - (339.292 * result.score) / 100}
                                strokeLinecap="round"
                                className="transition-all duration-1000 ease-out"
                            />
                        </svg>
                        <div className="absolute inset-0 flex items-center justify-center text-3xl font-bold text-gray-800 dark:text-white/90">
                            {result.score}%
                        </div>
                    </div>

                    <h2 className="text-2xl font-semibold text-gray-800 dark:text-white/90 mb-2">
                        Your Score 🎉
                    </h2>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">
                        Great job completing the quiz!
                    </p>

                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4 w-full max-w-xl text-sm">
                        <StatItem icon={<Clock className="w-4 h-4" />} label="Time" value={`${result.timer} min`} />
                        <StatItem icon={<Star className="w-4 h-4" />} label="Difficulty" value={result.difficulty.toLocaleUpperCase()} />
                        <StatItem icon={<CheckList className="w-4 h-4" />} label="Questions" value={result.question_count} />
                        <StatItem icon={<CheckCircle2 className="w-4 h-4" />} label="Correct" value={result.total_correct} />
                        <StatItem icon={<CheckList2 className="w-4 h-4" />} label="Answered" value={result.total_answers} />
                        <StatItem icon={<Trophy className="w-4 h-4" />} label="Final Score" value={`${result.score}%`} />
                    </div>

                    {/* CTA */}
                    <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center sm:gap-6">
                        <Button
                            size="sm"
                            variant="primary"
                            endIcon={<CheckCircle />}
                            onClick={() => router.push("/")}
                        >
                            Test Again
                        </Button>
                        <Button
                            size="sm"
                            variant="outline"
                            endIcon={<File />}
                            onClick={() => router.push(`/generated/questions/${result?.uuid}`)}
                        >
                            Review Answers
                        </Button>
                    </div>
                </div>
            )}
        </>
    );
}

function StatItem({ icon, label, value }: { icon: React.ReactNode; label: string; value: string | number }) {
    return (
        <div className="flex flex-col items-center rounded-xl border border-gray-100 bg-gray-50 p-4 dark:border-white/[0.05] dark:bg-white/[0.02]">
            <div className="mb-2 text-lg">{icon}</div>
            <p className="font-medium text-gray-700 dark:text-white/80">{label}</p>
            <p className="text-sm text-gray-500 dark:text-gray-400">{value}</p>
        </div>
    );
}
