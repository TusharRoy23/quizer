import { PaperPlaneIcon } from "@/icons";
import StepLayout from "../layouts/StepLayout";
import { StepProps } from "@/types";

export default function Intro({ onNextStep }: StepProps) {
    return (
        <>
            <StepLayout
                title={"Welcome to Quizer!"}
                description={"You can practice your test here."}
                btnLabel="Let's Start"
                backBtn={false}
                onNextStep={onNextStep}
                endIcon={<PaperPlaneIcon />}
            />
        </>
    );
}