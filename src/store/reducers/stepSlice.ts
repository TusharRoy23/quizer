import { Department } from "@/types";
import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

interface IForm {
    department: Department | undefined;
}

interface IStep {
    step: string,
    form: IForm,
    departmentList?: Department[]
}

const initialState: IStep = {
    step: 'intro',
    form: {
        department: undefined
    },
    departmentList: []
}

export const stepsSlice = createSlice({
    name: "steps",
    initialState,
    reducers: {
        setStep(state, action: PayloadAction<string>) {
            state.step = action.payload;
        },
        selectDepartment(state, action: PayloadAction<Department>) {
            state.form.department = action.payload;
        },
        setDepartmentList(state, action: PayloadAction<Department[]>) {
            state.departmentList = action.payload;
        }
    }
});

export const { setStep, selectDepartment, setDepartmentList } = stepsSlice.actions;
export default stepsSlice.reducer;