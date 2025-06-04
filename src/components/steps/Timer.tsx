import { StepProps } from "@/types";
import StepLayout from "../layouts/StepLayout";
import { ArrowRight } from "@/icons";
import Input from "../form/InputField";
import { useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setTimer } from "@/store/reducers/stepSlice";
import { RootState } from "@/store";

export default function Timer({ onNextStep = () => { }, onPreviousStep }: StepProps) {
    const timeoutRef = useRef<NodeJS.Timeout | null>(null);
    const dispatch = useDispatch();
    const timer = useSelector((state: RootState) => state.steps.form.timer) || 1;

    const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        if (timeoutRef.current) {
            clearTimeout(timeoutRef.current);
        }
        timeoutRef.current = setTimeout(() => {
            const minutes = parseInt(value);
            if (isNaN(minutes) || minutes < 1 || minutes > 60) {
                return;
            }

            dispatch(setTimer(minutes));

        }, 500);
    }

    useEffect(() => {
        return () => {
            if (timeoutRef.current) {
                clearTimeout(timeoutRef.current);
            }
        };
    }, []);

    return (
        <>
            <StepLayout
                title={"Set your Timer (Min)"}
                description={
                    <Input
                        type="number"
                        min={1}
                        max={60}
                        defaultValue={timer}
                        onChange={onChange}
                        placeholder="Enter time in minutes"
                    />
                }
                btnLabel={"Show Summary"}
                onNextStep={onNextStep}
                onPreviousStep={onPreviousStep}
                endIcon={<ArrowRight />}
            />
        </>
    );
}