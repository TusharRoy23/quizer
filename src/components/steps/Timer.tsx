import { StepProps } from "@/types";
import StepLayout from "../layouts/StepLayout";
import { ArrowRight } from "@/icons";

export default function Timer({ onNextStep, onPreviousStep }: StepProps) {
    return (
        <>
            <StepLayout
                title={"Set your Timer"}
                description={""}
                btnLabel={"Let's Start"}
                onNextStep={onNextStep}
                onPreviousStep={onPreviousStep}
                endIcon={<ArrowRight />}
            />
        </>
    );
}