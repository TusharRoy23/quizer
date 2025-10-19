import { Department, StepProps } from "@/utils/types";
import StepLayout from "../layouts/StepLayout";
import { ArrowRight } from "@/icons";
import SelectInput from "../form/SelectInput";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/store";
import { setDepartment, setTopics } from "@/store/reducers/stepSlice";
import {
    setDepartment as setVerbalDepartment,
    setTopics as setVerbalTopics
} from "@/store/reducers/verbalStepSlice";
import { fetchDepartments } from "@/services/departmentService";
import { useQuery } from "@tanstack/react-query";

export default function DepartmentStep({ onNextStep = () => { }, onPreviousStep, isVerbal = false }: StepProps) {
    const dispatch = useDispatch();

    const { data: departmentList = [] } = useQuery<Department[]>({
        queryKey: ["departments"],
        queryFn: fetchDepartments,
        retry: 1,
    });

    const department = useSelector((state: RootState) => state[isVerbal ? 'verbalSteps' : 'steps'].form.department);
    const onSelectDept = (dept: Department) => {
        dispatch(isVerbal ? setVerbalDepartment(dept) : setDepartment(dept));
        dispatch(isVerbal ? setVerbalTopics([]) : setTopics([]));
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
                btnLabel={"Next"}
                onNextStep={onNextStep}
                onPreviousStep={onPreviousStep}
                nextBtnDisabled={department ? false : true}
                endIcon={<ArrowRight />}
            />
        </>
    );
}