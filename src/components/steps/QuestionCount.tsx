import { ObjectType, StepProps } from "@/utils/types";
import StepLayout from "../layouts/StepLayout";
import { ArrowRight } from "@/icons";
import SelectInput from "../form/SelectInput";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/store";
import { setQuestionCount } from "@/store/reducers/stepSlice";

export default function QuestionCount({ onNextStep = () => { }, onPreviousStep }: StepProps) {
    const dispatch = useDispatch();
    const questionCount = useSelector((state: RootState) => state.steps.form.questionCount) || 5;
    const questionCountArr: Array<ObjectType> = [
        { name: "5", value: 5 },
        { name: "10", value: 10 },
        { name: "15", value: 15 },
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