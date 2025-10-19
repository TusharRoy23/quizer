import { StepProps } from "@/utils/types";
import StepLayout from "../layouts/StepLayout";
import { ArrowRight } from "@/icons";
import Input from "../form/InputField";
import { useDispatch, useSelector } from "react-redux";
import { setTimer } from "@/store/reducers/stepSlice";
import { RootState } from "@/store";

export default function Timer({ onNextStep = () => { }, onPreviousStep }: StepProps) {
    const dispatch = useDispatch();
    const timer = useSelector((state: RootState) => state.steps.form.timer) || 1;

    const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        const minutes = parseInt(value);
        if (isNaN(minutes) || minutes < 1 || minutes > 60) {
            return;
        }

        dispatch(setTimer(minutes));
    }

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
                btnLabel={"Next"}
                onNextStep={onNextStep}
                onPreviousStep={onPreviousStep}
                endIcon={<ArrowRight />}
            />
        </>
    );
}