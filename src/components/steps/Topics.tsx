import { StepProps, Topic } from "@/types";
import StepLayout from "../layouts/StepLayout";
import { ArrowRight } from "@/icons";
import { useEffect, useState } from "react";
import { fetchTopics } from "@/services/topicService";
import { RootState } from "@/store";
import { useDispatch, useSelector } from "react-redux";
import MultiSelect from "../form/MultiSelectInput";
import { selectTopics } from "@/store/reducers/stepSlice";

export default function Topics({ onNextStep = () => { }, onPreviousStep }: StepProps) {
    const dispatch = useDispatch();
    const [topics, setTopics] = useState<Topic[]>([]);
    const selectedTopics = useSelector((state: RootState) => state.steps.form.topics) || [];
    const cachedTopics = useSelector((state: RootState) => state.steps.topicList) || [];
    const selectedDepartment = useSelector((state: RootState) => state.steps.form.department);

    useEffect(() => {
        if (selectedDepartment) {
            if (!cachedTopics.length) {
                const loadTopics = async () => {
                    const topics = await fetchTopics(selectedDepartment);
                    setTopics(topics);
                }
                loadTopics();
            } else {
                setTopics(cachedTopics);
            }
        }
    }, []);

    const onSelectTopics = (topics: Topic[]) => {
        dispatch(selectTopics(topics));
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
                    />
                }
                btnLabel={"Set your Difficulty"}
                endIcon={<ArrowRight />}
                onPreviousStep={onPreviousStep}
                onNextStep={onNextStep}
                nextBtnDisabled={selectedTopics.length ? false : true}
            />
        </>
    );
}