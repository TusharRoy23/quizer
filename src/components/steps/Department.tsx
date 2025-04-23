import { Department, StepProps } from "@/types";
import StepLayout from "../layouts/StepLayout";
import { ArrowRight } from "@/icons";
import SelectInput from "../form/SelectInput";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/store";
import { selectDepartment, selectTopics, setDepartmentList, setTopicList } from "@/store/reducers/stepSlice";
import { useEffect } from "react";
import { fetchDepartments } from "@/services/departmentService";

export default function DepartmentStep({ onNextStep, onPreviousStep }: StepProps) {
    const dispatch = useDispatch();
    const departmentList: Department[] = useSelector((state: RootState) => state.steps.departmentList) || [];

    useEffect(() => {
        const loadDepartments = async () => {
            const departments = await fetchDepartments();
            dispatch(setDepartmentList(departments));
        };
        loadDepartments();
    }, []);
    const department = useSelector((state: RootState) => state.steps.form.department);

    const onSelectDept = (dept: Department) => {
        dispatch(selectDepartment(dept));
        dispatch(selectTopics([]));
        dispatch(setTopicList([]));
    }

    return (
        <>
            <StepLayout
                title={"Select your department"}
                description={
                    <SelectInput
                        label="Select your department"
                        placeholder="--Select--"
                        options={departmentList}
                        getOptionValue={(dept) => dept.uuid}
                        getOptionLabel={(dept) => dept.name}
                        onChange={onSelectDept}
                        value={department}
                    />
                }
                btnLabel={"Move to Topics"}
                onNextStep={onNextStep}
                onPreviousStep={onPreviousStep}
                nextBtnDisabled={department ? false : true}
                endIcon={<ArrowRight />}
            />
        </>
    );
}