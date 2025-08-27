import { Clock, PaperPlaneIcon } from "@/icons";
import StepLayout from "../layouts/StepLayout";
import { QuizResult, StepProps } from "@/utils/types";
import { useQuery } from "@tanstack/react-query";
import { QuizService } from "@/services/quizService";
import { useRouter } from "next/navigation";
import Image from "next/image";

export default function Intro({ onNextStep = () => { }, isAuthenticated }: StepProps) {
    const router = useRouter();
    const { data: onGoingQuiz } = useQuery<QuizResult>({
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
        router.push(`/quiz/${onGoingQuiz?.uuid}`);
    }
    return (
        <>
            <StepLayout
                title={"Welcome to Quizer!"}
                description={
                    isAuthenticated
                        ? "Practice your skills with our quizzes. Track your progress and improve over time."
                        : "Sign in with Google to start practicing quizzes, save your progress, and unlock personalized features."
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
                        : <Image
                            src={"https://developers.google.com/identity/images/g-logo.png"}
                            alt="Google"
                            width={20}
                            height={20}
                        />
                }
            />
        </>
    );
}