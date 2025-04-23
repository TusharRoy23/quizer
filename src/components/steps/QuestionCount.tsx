import { ObjectType, StepProps } from "@/types";
import StepLayout from "../layouts/StepLayout";
import { ArrowRight } from "@/icons";
import SelectInput from "../form/SelectInput";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/store";
import { setQuestionCount } from "@/store/reducers/stepSlice";

export default function QuestionCount({ onNextStep, onPreviousStep }: StepProps) {
    const dispatch = useDispatch();
    const questionCount = useSelector((state: RootState) => state.steps.form.questionCount) || 10;
    const questionCountArr: Array<ObjectType> = [
        { name: "10", value: 10 },
        { name: "20", value: 20 },
        { name: "30", value: 30 },
    ];

    const onSelect = (count: ObjectType) => {
        dispatch(setQuestionCount(count));
    }

    return (
        <>
            <StepLayout
                title={"How many questions do you want to answer?"}
                description={
                    <SelectInput
                        label=""
                        placeholder="--Select--"
                        options={questionCountArr}
                        getOptionValue={(dept) => dept.value}
                        getOptionLabel={(dept) => dept.name}
                        onChange={onSelect}
                        value={questionCount}
                    />
                }
                btnLabel={"Set your Timer"}
                onNextStep={onNextStep}
                onPreviousStep={onPreviousStep}
                endIcon={<ArrowRight />}
            />
        </>
    );
}