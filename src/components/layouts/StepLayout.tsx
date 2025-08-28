"use client";
import React, { ReactNode } from "react";
import Button from "../ui/button/Button";
import { ChevronLeft } from "@/icons";
import { motion } from "framer-motion";

interface StepProps {
    title: string;
    description: string | ReactNode;
    endIcon?: ReactNode;
    startIcon?: ReactNode;
    btnLabel: string;
    backBtn?: boolean;
    errorMessage?: string | null;
    nextBtnDisabled?: boolean;
    prevBtnDisabled?: boolean;
    onNextStep: () => void;
    onPreviousStep?: () => void;
}

const StepLayout: React.FC<StepProps> = ({
    title,
    description,
    endIcon,
    startIcon,
    btnLabel,
    errorMessage,
    backBtn = true,
    nextBtnDisabled = false,
    prevBtnDisabled = false,
    onNextStep,
    onPreviousStep
}) => {
    return (
        <div className="flex flex-col items-center justify-center px-6 py-8 w-full">
            <div className="w-full max-w-md">
                {/* Title & Description */}
                <motion.div
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.35 }}
                    className="text-center mb-8"
                >
                    <h4 className="mb-4 text-xl font-bold text-gray-900 dark:text-white sm:text-xl">
                        {title}
                    </h4>
                    {typeof description === "string" ? (
                        <p className="text-gray-600 dark:text-gray-300 text-base leading-relaxed">
                            {description}
                        </p>
                    ) : (
                        <div className="text-gray-600 dark:text-gray-300 text-base leading-relaxed">
                            {description}
                        </div>
                    )}
                </motion.div>

                {/* Error Message */}
                {errorMessage && (
                    <div className="mb-6 p-3 bg-red-50 dark:bg-red-900/20 rounded-lg text-center">
                        <p className="text-red-600 dark:text-red-400 text-sm whitespace-pre-line">
                            {errorMessage}
                        </p>
                    </div>
                )}

                {/* Buttons */}
                <div className="flex flex-col sm:flex-row gap-3 mt-8">
                    <Button
                        size="md"
                        variant="primary"
                        endIcon={endIcon}
                        startIcon={startIcon}
                        onClick={onNextStep}
                        disabled={nextBtnDisabled}
                        className="flex-1 justify-center"
                    >
                        {btnLabel}
                    </Button>

                    {backBtn && (
                        <Button
                            size="md"
                            variant="outline"
                            startIcon={<ChevronLeft />}
                            onClick={onPreviousStep}
                            disabled={prevBtnDisabled}
                            className="flex-1 justify-center"
                        >
                            Back
                        </Button>
                    )}
                </div>
            </div>
        </div>
    );
};

export default StepLayout;
