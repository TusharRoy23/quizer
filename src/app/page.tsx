"use client"
import Department from "@/components/steps/Department";
import Difficulty from "@/components/steps/Difficulty";
import Intro from "@/components/steps/Intro";
import QuestionCount from "@/components/steps/QuestionCount";
import Summary from "@/components/steps/Summary";
import Timer from "@/components/steps/Timer";
import Topics from "@/components/steps/Topics";
import Button from "@/components/ui/button/Button";
import { RootState } from "@/store";
import { setStep } from "@/store/reducers/stepSlice";
import { useDispatch, useSelector } from "react-redux";
import { File } from "@/icons";
import { useRouter } from "next/navigation";
import { env } from "@/lib/env";
import { STEPS } from "@/utils/enum";
import { motion, AnimatePresence } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import { QuizService } from "@/services/quizService";

export default function Home() {
  const step = useSelector((state: RootState) => state.steps.step);
  const isAuthenticated = useSelector((state: RootState) => state.auth.isAuthenticated);
  const dispatch = useDispatch();
  const router = useRouter();

  const { data: hasParticipatedInQuiz } = useQuery<boolean>({
    queryKey: ['hasParticipatedInQuiz'],
    queryFn: () => QuizService.checkIfParticipatedInQuiz(),
    enabled: isAuthenticated,
    staleTime: 0,
    retry: 1
  });

  const stepHandler = (step: STEPS) => {
    dispatch(setStep(step));
  };

  const handleGoogleLogin = () => {
    window.location.href = `${env.apiUrl}/user/auth/google`;
  };

  return (
    <div className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <main className="relative z-10 flex flex-col gap-6 items-center sm:items-start w-full max-w-3xl">
        {/* Step Card with Animation */}
        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.25 }}
            className="w-full rounded-2xl border border-gray-200 shadow-lg bg-white px-6 py-8 dark:border-gray-800 dark:bg-gray-900"
          >
            {String(step) === STEPS.Intro && (
              <Intro
                onNextStep={() =>
                  isAuthenticated
                    ? stepHandler(STEPS.Department)
                    : handleGoogleLogin()
                }
                isAuthenticated={isAuthenticated}
              />
            )}
            {String(step) === STEPS.Department && (
              <Department
                onNextStep={() => stepHandler(STEPS.Topics)}
                onPreviousStep={() => stepHandler(STEPS.Intro)}
              />
            )}
            {String(step) === STEPS.Topics && (
              <Topics
                onNextStep={() => stepHandler(STEPS.Difficulty)}
                onPreviousStep={() => stepHandler(STEPS.Department)}
              />
            )}
            {String(step) === STEPS.Difficulty && (
              <Difficulty
                onNextStep={() => stepHandler(STEPS.QuestionCount)}
                onPreviousStep={() => stepHandler(STEPS.Topics)}
              />
            )}
            {String(step) === STEPS.QuestionCount && (
              <QuestionCount
                onNextStep={() => stepHandler(STEPS.Timer)}
                onPreviousStep={() => stepHandler(STEPS.Difficulty)}
              />
            )}
            {String(step) === STEPS.Timer && (
              <Timer
                onNextStep={() => stepHandler(STEPS.Start)}
                onPreviousStep={() => stepHandler(STEPS.QuestionCount)}
              />
            )}
            {String(step) === STEPS.Start && (
              <Summary onPreviousStep={() => stepHandler(STEPS.Timer)} />
            )}

            {isAuthenticated && String(step) === STEPS.Intro && (
              <motion.div
                key={'verbal-quizzes-button'}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 1 }}
              >
                <div className="flex justify-center mt-4">
                  <Button
                    size="sm"
                    variant="outline"
                    endIcon={<File />}
                    onClick={() => router.push("/verbal")}
                  >
                    Verbal Quizzes
                  </Button>
                </div>
              </motion.div>
            )}

            {/* Extra Quizzes Button for Intro */}
            {isAuthenticated && hasParticipatedInQuiz && String(step) === STEPS.Intro && (
              <motion.div
                key={'extra-quizzes-button'}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 1 }}
              >
                <div className="flex justify-center mt-4">
                  <Button
                    size="sm"
                    variant="outline"
                    endIcon={<File />}
                    onClick={() => router.push("/generated")}
                  >
                    Previous Quizzes
                  </Button>
                </div>
              </motion.div>
            )}
          </motion.div>
        </AnimatePresence>
      </main>
    </div>
  );
}
