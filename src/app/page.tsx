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

export default function Home() {
  const step = useSelector((state: RootState) => state.steps.step);
  const isAuthenticated = useSelector((state: RootState) => state.auth.isAuthenticated);
  const dispatch = useDispatch();
  const router = useRouter();

  const stepHandler = (step: STEPS) => {
    dispatch(setStep(step))
  }

  const handleGoogleLogin = () => {
    window.location.href = `${env.apiUrl}/user/auth/google`;
  };

  return (
    <>
      <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
        <main className="flex flex-col gap-[32px] row-start-2 items-center sm:items-start">
          <div className="rounded-2xl border border-gray-200 shadow-lg bg-white px-5 py-7 dark:border-gray-800 dark:bg-white/[0.03] xl:px-10 xl:py-12">
            {String(step) === STEPS.Intro && <Intro onNextStep={() => isAuthenticated ? stepHandler(STEPS.Department) : handleGoogleLogin()} isAuthenticated={isAuthenticated} />}
            {String(step) === STEPS.Department && <Department onNextStep={() => stepHandler(STEPS.Topics)} onPreviousStep={() => stepHandler(STEPS.Intro)} />}
            {String(step) === STEPS.Topics && <Topics onNextStep={() => stepHandler(STEPS.Difficulty)} onPreviousStep={() => stepHandler(STEPS.Department)} />}
            {String(step) === STEPS.Difficulty && <Difficulty onNextStep={() => stepHandler(STEPS.QuestionCount)} onPreviousStep={() => stepHandler(STEPS.Topics)} />}
            {String(step) === STEPS.QuestionCount && <QuestionCount onNextStep={() => stepHandler(STEPS.Timer)} onPreviousStep={() => stepHandler(STEPS.Difficulty)} />}
            {String(step) === STEPS.Timer && <Timer onNextStep={() => stepHandler(STEPS.Start)} onPreviousStep={() => stepHandler(STEPS.QuestionCount)} />}
            {String(step) === STEPS.Start && <Summary onPreviousStep={() => stepHandler(STEPS.Timer)} />}
            {isAuthenticated && String(step) === STEPS.Intro && <div className="flex justify-center mt-4">
              <Button size="sm" variant="outline" endIcon={<File />} onClick={() => {
                router.push('/generated');
              }}>
                Quizzes
              </Button>
            </div>}
          </div>

        </main>
      </div>
    </>
  );
}
