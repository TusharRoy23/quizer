import React, { ReactNode } from "react";
import Button from "../ui/button/Button";
import { ChevronLeft } from "@/icons";

interface StepProps {
    title: string;
    description: string | ReactNode;
    endIcon: ReactNode,
    btnLabel: string,
    backBtn?: boolean,
    nextBtnDisabled?: boolean,
    onNextStep: () => void,
    onPreviousStep?: () => void
}

const StepLayout: React.FC<StepProps> = ({
    title,
    description,
    endIcon,
    btnLabel,
    backBtn = true,
    nextBtnDisabled = false,
    onNextStep,
    onPreviousStep
}) => {
    return (
        <>
            <div className="w-full max-w-[630px] text-center">
                <h3 className="mb-4 font-semibold text-gray-800 text-theme-xl dark:text-white/90 sm:text-2xl">
                    {title}
                </h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 sm:text-base">
                    {description}
                </p>
            </div>
            <div className="flex justify-center mt-4">
                <Button size="sm" variant="outline" endIcon={endIcon} onClick={onNextStep} disabled={nextBtnDisabled}>
                    {btnLabel}
                </Button>
            </div>
            {backBtn && (
                <div className="flex justify-center mt-4">
                    <Button size="sm" variant="outline" startIcon={<ChevronLeft />} onClick={onPreviousStep}>
                        Back
                    </Button>
                </div>
            )}
        </>
    );
}

export default StepLayout;