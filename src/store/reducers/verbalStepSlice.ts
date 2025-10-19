import { STEPS } from "@/utils/enum";
import { Department, Difficulty, IStep, Topic } from "@/utils/types";
import { createSlice } from "@reduxjs/toolkit";

const initialState: IStep = {
    step: STEPS.Department,
    form: {
        department: undefined,
        topics: [],
        difficulty: undefined
    },
    departmentList: [],
    topicList: []
}

export const verbalStepsSlice = createSlice({
    name: "verbal-steps",
    initialState,
    reducers: {
        setStep(state, action: { payload: string }) {
            state.step = action.payload;
        },
        setDepartment(state, action: { payload: Department }) {
            state.form.department = action.payload;
        },
        setDepartmentList(state, action: { payload: Department[] }) {
            state.departmentList = action.payload;
        },
        setTopics(state, action: { payload: Topic[] }) {
            state.form.topics = action.payload;
        },
        setTopicList(state, action: { payload: Topic[] }) {
            state.topicList = action.payload;
        },
        setDifficulty(state, action: { payload: Difficulty }) {
            state.form.difficulty = action.payload;
        }
    }
});

export const {
    setStep,
    setDepartment,
    setDepartmentList,
    setTopics,
    setTopicList,
    setDifficulty
} = verbalStepsSlice.actions;

export default verbalStepsSlice.reducer;