"use client";

import { RootState } from "@/store";
import { useDispatch, useSelector } from "react-redux";
import { AnimatePresence, motion } from "framer-motion";
import { STEPS } from "@/utils/enum";
import Department from "../steps/Department";
import { setStep } from "@/store/reducers/verbalStepSlice";
import Topics from "../steps/Topics";
import Difficulty from "../steps/Difficulty";
import Summary from "../steps/Summary";

export default function CreateQuiz() {
    const dispatch = useDispatch();
    const step = useSelector((state: RootState) => state.verbalSteps.step);

    const stepHandler = (step: STEPS) => {
        dispatch(setStep(step));
    };

    return (
        <div className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
            <AnimatePresence mode="wait">
                <motion.div
                    key={step}
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -15 }}
                    transition={{ duration: 0.25 }}
                    className="w-full rounded-2xl border border-gray-200 shadow-lg bg-white px-6 py-8 dark:border-gray-800 dark:bg-gray-900"
                >
                    {String(step) === STEPS.Department && (
                        <Department
                            onNextStep={() => stepHandler(STEPS.Topics)}
                            isVerbal={true}
                        />
                    )}
                    {String(step) === STEPS.Topics && (
                        <Topics
                            onNextStep={() => stepHandler(STEPS.Difficulty)}
                            onPreviousStep={() => stepHandler(STEPS.Department)}
                            isVerbal={true}
                        />
                    )}
                    {String(step) === STEPS.Difficulty && (
                        <Difficulty
                            onNextStep={() => stepHandler(STEPS.Start)}
                            onPreviousStep={() => stepHandler(STEPS.Topics)}
                            isVerbal={true}
                        />
                    )}
                    {String(step) === STEPS.Start && (
                        <Summary
                            onPreviousStep={() => stepHandler(STEPS.Difficulty)}
                            isVerbal={true}
                        />
                    )}
                </motion.div>
            </AnimatePresence>
        </div>
    );
}