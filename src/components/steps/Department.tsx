import { Department, StepProps } from "@/utils/types";
import StepLayout from "../layouts/StepLayout";
import { ArrowRight } from "@/icons";
import SelectInput from "../form/SelectInput";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/store";
import { selectDepartment, selectTopics } from "@/store/reducers/stepSlice";
import { fetchDepartments } from "@/services/departmentService";
import { useQuery } from "@tanstack/react-query";

export default function DepartmentStep({ onNextStep = () => { }, onPreviousStep }: StepProps) {
    const dispatch = useDispatch();

    const { data: departmentList = [] } = useQuery<Department[]>({
        queryKey: ["departments"],
        queryFn: fetchDepartments,
        retry: 1,
    });

    const department = useSelector((state: RootState) => state.steps.form.department);

    const onSelectDept = (dept: Department) => {
        dispatch(selectDepartment(dept));
        dispatch(selectTopics([]));
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