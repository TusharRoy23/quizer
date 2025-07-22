import { PaperPlaneIcon } from "@/icons";
import StepLayout from "../layouts/StepLayout";
import { StepProps } from "@/types";

export default function Intro({ onNextStep = () => { }, isAuthenticated }: StepProps) {
    return (
        <>
            <StepLayout
                title={"Welcome to Quizer!"}
                description={"You can practice your test here."}
                btnLabel={isAuthenticated ? "Take a quiz" : "Sign in with google"}
                backBtn={false}
                onNextStep={onNextStep}
                endIcon={isAuthenticated ? <PaperPlaneIcon /> : null}
                startIcon={isAuthenticated ? null : <img
                    src="https://developers.google.com/identity/images/g-logo.png"
                    alt="Google"
                    style={{ width: 20, height: 20 }}
                />
                }
            />
        </>
    );
}