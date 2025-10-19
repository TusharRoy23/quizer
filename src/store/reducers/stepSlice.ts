import { Department, Difficulty, IStep, ObjectType, Topic } from "@/utils/types";
import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

const initialState: IStep = {
    step: 'intro',
    form: {
        department: undefined,
        topics: [],
        difficulty: undefined,
        questionCount: { name: "5", value: 5 },
        timer: 1
    },
    departmentList: [],
    topicList: []
}

export const stepsSlice = createSlice({
    name: "steps",
    initialState,
    reducers: {
        setStep(state, action: PayloadAction<string>) {
            state.step = action.payload;
        },
        setDepartment(state, action: PayloadAction<Department>) {
            state.form.department = action.payload;
        },
        setDepartmentList(state, action: PayloadAction<Department[]>) {
            state.departmentList = action.payload;
        },
        setTopics(state, action: PayloadAction<Topic[]>) {
            state.form.topics = action.payload;
        },
        setTopicList(state, action: PayloadAction<Topic[]>) {
            state.topicList = action.payload;
        },
        setDifficulty(state, action: PayloadAction<Difficulty>) {
            state.form.difficulty = action.payload;
        },
        setQuestionCount(state, action: PayloadAction<ObjectType>) {
            state.form.questionCount = action.payload;
        },
        setTimer(state, action: PayloadAction<number>) {
            state.form.timer = action.payload;
        }
    }
});

export const {
    setStep,
    setDepartment,
    setDepartmentList,
    setTopics,
    setTopicList,
    setDifficulty,
    setQuestionCount,
    setTimer
} = stepsSlice.actions;
export default stepsSlice.reducer;