import { Clock, PaperPlaneIcon } from "@/icons";
import StepLayout from "../layouts/StepLayout";
import { QuizResult, StepProps } from "@/types";
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
                description={"You can practice your test here."}
                btnLabel={isAuthenticated ? onGoingQuiz?.uuid ? "Ongoing Quiz" : "Take a quiz" : "Sign in with google"}
                backBtn={false}
                onNextStep={isAuthenticated && onGoingQuiz?.uuid ? handleOngoingQuiz : onNextStep}
                endIcon={(isAuthenticated && onGoingQuiz?.uuid) ? <Clock /> : isAuthenticated ? <PaperPlaneIcon /> : null}
                startIcon={isAuthenticated ? null : <Image
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