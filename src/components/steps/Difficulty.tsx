import { Difficulty, StepProps } from "@/utils/types";
import StepLayout from "../layouts/StepLayout";
import { ArrowRight } from "@/icons";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/store";
import SelectInput from "../form/SelectInput";
import { setDifficulty } from "@/store/reducers/stepSlice";
import { setDifficulty as setVerbalDifficulty } from "@/store/reducers/verbalStepSlice";

export default function DifficultyLevel({ onNextStep = () => { }, onPreviousStep, isVerbal = false }: StepProps) {
    const dispatch = useDispatch();
    const difficulty: Difficulty[] = [
        { name: "Easy", value: "easy" },
        { name: "Medium", value: "medium" },
        { name: "Hard", value: "hard" },
    ];
    const selectedDifficulty = useSelector((state: RootState) => state[isVerbal ? 'verbalSteps' : 'steps'].form.difficulty);
    const onSelect = (difficulty: Difficulty) => {
        dispatch(isVerbal ? setVerbalDifficulty(difficulty) : setDifficulty(difficulty));
    }

    return (
        <>
            <StepLayout
                title={"Select Difficulty Level"}
                description={
                    <SelectInput
                        label="Level"
                        placeholder="--Select--"
                        options={difficulty}
                        getOptionValue={(dept) => dept.value}
                        getOptionLabel={(dept) => dept.name}
                        onChange={onSelect}
                        value={selectedDifficulty}
                    />
                }
                btnLabel={"Next"}
                onNextStep={onNextStep}
                onPreviousStep={onPreviousStep}
                endIcon={<ArrowRight />}
                nextBtnDisabled={selectedDifficulty ? false : true}
            />
        </>
    );
}