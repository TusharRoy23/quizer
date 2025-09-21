import { Clock, PaperPlaneIcon } from "@/icons";
import StepLayout from "../layouts/StepLayout";
import { QuizResult, StepProps } from "@/utils/types";
import { useQuery } from "@tanstack/react-query";
import { QuizService } from "@/services/quizService";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { motion } from "framer-motion";
import { RootState } from "@/store";
import { useDispatch, useSelector } from "react-redux";
import { setSearchEnable } from "@/store/reducers/searchSlice";
import { useEffect } from "react";

// Loading skeleton component
const IntroSkeleton = () => {
    return (
        <div className="flex flex-col gap-4">
            <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-3/4 animate-pulse"></div>
            <div className="space-y-2">
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-full animate-pulse"></div>
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-5/6 animate-pulse"></div>
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-4/6 animate-pulse"></div>
            </div>
            <div className="h-12 bg-gray-200 dark:bg-gray-700 rounded-lg mt-4 animate-pulse"></div>
        </div>
    );
};

export default function Intro({ onNextStep = () => { }, isAuthenticated }: StepProps) {
    const router = useRouter();
    const dispatch = useDispatch();
    const isAuthLoading = useSelector((state: RootState) => state.auth.isLoading);
    const { data: onGoingQuiz, isError } = useQuery<QuizResult>({
        queryKey: ['latestOnGoingQuiz'],
        queryFn: () => QuizService.getLatestOnGoingQuiz(),
        enabled: isAuthenticated,
        refetchOnWindowFocus: true,
        refetchOnReconnect: true,
        staleTime: 0,
        retry: 1
    });

    const handleOngoingQuiz = () => {
        if (!onGoingQuiz?.uuid) return;
        const url = onGoingQuiz.is_oral ? 'verbal' : 'quiz';
        router.push(`/${url}/${onGoingQuiz?.uuid}`);
    }

    useEffect(() => {
        dispatch(setSearchEnable(!onGoingQuiz?.uuid));
    }, [dispatch, onGoingQuiz?.uuid]);

    // Show loading state while API is fetching
    if (isAuthLoading) {
        return (
            <StepLayout
                title={"Welcome to Quizer! 🎓"}
                description={<IntroSkeleton />}
                btnLabel={"Loading..."}
                backBtn={false}
                onNextStep={() => { }}
                nextBtnDisabled={true}
            />
        );
    }

    // Show error state if API fails
    if (isAuthenticated && isError) {
        return (
            <StepLayout
                title={"Welcome to Quizer! 🎓"}
                description={
                    <div className="flex flex-col gap-3">
                        <p>Sharpen your skills with AI-powered quizzes. Track progress and keep improving.</p>
                        <div className="mt-4 p-3 bg-red-50 dark:bg-red-900/20 rounded-lg">
                            <p className="text-red-600 dark:text-red-400 text-sm">
                                Unable to check for ongoing quizzes. Please try again.
                            </p>
                        </div>
                    </div>
                }
                btnLabel={"Take a Quiz"}
                backBtn={false}
                onNextStep={onNextStep}
                endIcon={<PaperPlaneIcon />}
            />
        );
    }

    return (
        <StepLayout
            title={"Welcome to Quizer! 🎓"}
            description={
                <div className="flex flex-col gap-3">
                    <p>
                        {isAuthenticated
                            ? "Sharpen your skills with AI-powered quizzes. Track progress and keep improving."
                            : "Sign in with Google to unlock AI-powered quizzes, instant answers, and clear explanations."}
                    </p>
                    {isAuthenticated && onGoingQuiz?.uuid && (
                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.3 }}
                            className="mt-4 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg"
                        >
                            <p className="text-blue-600 dark:text-blue-400 text-sm">
                                You have an ongoing quiz. Click below to resume where you left off.
                            </p>
                        </motion.div>
                    )}
                </div>
            }
            btnLabel={
                isAuthenticated
                    ? onGoingQuiz?.uuid
                        ? "Resume Ongoing Quiz"
                        : "Take a Quiz"
                    : "Sign in with Google"
            }
            backBtn={false}
            onNextStep={
                isAuthenticated && onGoingQuiz?.uuid
                    ? handleOngoingQuiz
                    : onNextStep
            }
            endIcon={
                isAuthenticated && onGoingQuiz?.uuid
                    ? <Clock />
                    : isAuthenticated
                        ? <PaperPlaneIcon />
                        : null
            }
            startIcon={
                isAuthenticated
                    ? null
                    : <div className="w-5 h-5 relative">
                        <Image
                            src={"https://developers.google.com/identity/images/g-logo.png"}
                            alt="Google"
                            className="object-contain"
                            height={20}
                            width={20}
                        />
                    </div>
            }
        />
    );
}