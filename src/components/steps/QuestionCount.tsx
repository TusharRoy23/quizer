import { StepProps } from "@/types";
import StepLayout from "../layouts/StepLayout";
import { ArrowRight } from "@/icons";

export default function QuestionCount({ onNextStep, onPreviousStep }: StepProps) {
    return (
        <>
            <StepLayout
                title={"How many questions do you want to answer?"}
                description={""}
                btnLabel={"Set your Timer"}
                onNextStep={onNextStep}
                onPreviousStep={onPreviousStep}
                endIcon={<ArrowRight />}
            />
        </>
    );
}