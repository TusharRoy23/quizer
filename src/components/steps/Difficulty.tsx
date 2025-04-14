import { StepProps } from "@/types";
import StepLayout from "../layouts/StepLayout";
import { ArrowRight } from "@/icons";

export default function Difficulty({ onNextStep, onPreviousStep }: StepProps) {
    return (
        <>
            <StepLayout
                title={"Select Difficulty Level"}
                description={""}
                btnLabel={"Total Questions"}
                onNextStep={onNextStep}
                onPreviousStep={onPreviousStep}
                endIcon={<ArrowRight />}
            />
        </>
    );
}