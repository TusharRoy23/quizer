"use client"
import Department from "@/components/steps/Department";
import Intro from "@/components/steps/Intro";
import QuestionCount from "@/components/steps/QuestionCount";
import Summary from "@/components/steps/Summary";
import Timer from "@/components/steps/Timer";
import Topics from "@/components/steps/Topics";
import { RootState } from "@/store";
import { setStep } from "@/store/reducers/stepSlice";
import { useDispatch, useSelector } from "react-redux";
import { Bot, File } from "@/icons";
import { useRouter } from "next/navigation";
import { env } from "@/lib/env";
import { STEPS } from "@/utils/enum";
import { motion, AnimatePresence } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import { QuizService } from "@/services/quizService";
import { useState } from "react";
import AgenticQuizGeneration from "@/components/quiz/AgenticQuizGeneration";

export default function Home() {
  const step = useSelector((state: RootState) => state.steps.step);
  const isAuthenticated = useSelector((state: RootState) => state.auth.isAuthenticated);
  const dispatch = useDispatch();
  const router = useRouter();
  const [isChatOpen, setIsChatOpen] = useState(false);

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
                onNextStep={() => stepHandler(STEPS.Timer)}
                onPreviousStep={() => stepHandler(STEPS.Department)}
              />
            )}
            {String(step) === STEPS.QuestionCount && (
              <QuestionCount
                onNextStep={() => stepHandler(STEPS.Timer)}
                onPreviousStep={() => stepHandler(STEPS.Department)}
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

            {isAuthenticated && String(step) === STEPS.Intro && (hasParticipatedInQuiz || true) && (
              <motion.div
                key={'quiz-action-buttons'}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.5, delay: 0.4 }}
                className="mt-6"
              >
                <div className="flex flex-col sm:flex-row gap-4 justify-center items-stretch max-w-md mx-auto">
                  {/* AI Quiz Agent Button - Left Side */}
                  <div className="flex-1 min-w-0">
                    <div
                      className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 border-2 border-green-200 dark:border-green-700 rounded-xl p-4 shadow-sm hover:shadow-md hover:border-green-300 dark:hover:border-green-600 transition-all duration-300 cursor-pointer h-full group"
                      onClick={() => setIsChatOpen(true)}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <div className="flex items-center text-green-700 dark:text-green-300 mb-1">
                            <Bot className="w-4 h-4 mr-2" />
                            <span className="font-semibold">AI Quiz Agent</span>
                          </div>
                          <p className="text-xs text-green-600/70 dark:text-green-400/70">
                            Generate new quiz
                          </p>
                        </div>
                        <div className="text-green-500 group-hover:scale-110 transition-transform">
                          <span className="text-lg">🤖</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  {/* Previous Quizzes Button - Left Side */}
                  {hasParticipatedInQuiz && (
                    <div className="flex-1 min-w-0">
                      <div
                        className="bg-gradient-to-br from-purple-50 to-blue-50 dark:from-purple-900/20 dark:to-blue-900/20 border-2 border-purple-200 dark:border-purple-700 rounded-xl p-4 shadow-sm hover:shadow-md hover:border-purple-300 dark:hover:border-purple-600 transition-all duration-300 cursor-pointer h-full group"
                        onClick={() => router.push("/generated")}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex-1">
                            <div className="flex items-center text-purple-700 dark:text-purple-300 mb-1">
                              <File className="w-4 h-4 mr-2" />
                              <span className="font-semibold">Previous Quizzes</span>
                            </div>
                            <p className="text-xs text-purple-600/70 dark:text-purple-400/70">
                              Review your history
                            </p>
                          </div>
                          <div className="text-purple-500 group-hover:scale-110 transition-transform">
                            <span className="text-lg">📊</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </motion.div>
            )}
          </motion.div>
        </AnimatePresence>
        <AgenticQuizGeneration
          isOpen={isChatOpen}
          onClose={() => setIsChatOpen(false)}
        ></AgenticQuizGeneration>
      </main>
    </div>
  );
}
