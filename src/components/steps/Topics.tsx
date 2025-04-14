import { StepProps } from "@/types";
import StepLayout from "../layouts/StepLayout";
import { ArrowRight } from "@/icons";

export default function Topics({ onNextStep, onPreviousStep }: StepProps) {
    return (
        <>
            <StepLayout
                title={"Choose your Topics"}
                description={""}
                btnLabel={"Set your Difficulty"}
                endIcon={<ArrowRight />}
                onPreviousStep={onPreviousStep}
                onNextStep={onNextStep}
            />
        </>
    );
}