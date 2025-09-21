import { StepProps, Topic } from "@/utils/types";
import StepLayout from "../layouts/StepLayout";
import { ArrowRight } from "@/icons";
import { fetchTopics } from "@/services/topicService";
import { RootState } from "@/store";
import { useDispatch, useSelector } from "react-redux";
import MultiSelect from "../form/MultiSelectInput";
import { setTopics } from "@/store/reducers/stepSlice";
import { setTopics as setVerbalTopics } from "@/store/reducers/verbalStepSlice";
import { useQuery } from "@tanstack/react-query";

export default function Topics({ onNextStep = () => { }, onPreviousStep, isVerbal = false }: StepProps) {
    const dispatch = useDispatch();
    const selectedTopics = useSelector((state: RootState) => state[isVerbal ? 'verbalSteps' : 'steps'].form.topics) || [];
    const selectedDepartment = useSelector((state: RootState) => state[isVerbal ? 'verbalSteps' : 'steps'].form.department);

    const { data: topics = [] } = useQuery<Topic[]>({
        queryKey: ["topics", selectedDepartment],
        queryFn: async () => {
            if (selectedDepartment) {
                return await fetchTopics(selectedDepartment);
            }
            return [];
        },
        retry: 1,
    });

    const onSelectTopics = (topics: Topic[]) => {
        dispatch(isVerbal ? setVerbalTopics(topics) : setTopics(topics));
    }
    return (
        <>
            <StepLayout
                title={"Choose your Topics"}
                description={
                    <MultiSelect
                        label="Select your topics"
                        options={topics}
                        getOptionValue={(topic: Topic) => topic.uuid}
                        getOptionLabel={(topic: Topic) => topic.name}
                        onChange={onSelectTopics}
                        defaultSelected={selectedTopics}
                        maxSelection={2}
                    />
                }
                btnLabel={"Next"}
                endIcon={<ArrowRight />}
                onPreviousStep={onPreviousStep}
                onNextStep={onNextStep}
                nextBtnDisabled={selectedTopics.length ? false : true}
            />
        </>
    );
}