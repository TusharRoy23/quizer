import { Department, Difficulty, ObjectType, Topic } from "@/types";
import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

interface IForm {
    department: Department | undefined;
    topics: Topic[];
    difficulty: Difficulty | undefined;
    questionCount: ObjectType;
    timer: number
}

interface IStep {
    step: string,
    form: IForm,
    departmentList: Department[],
    topicList: Topic[],
}

const initialState: IStep = {
    step: 'intro',
    form: {
        department: undefined,
        topics: [],
        difficulty: undefined,
        questionCount: { name: "10", value: 10 },
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
        selectDepartment(state, action: PayloadAction<Department>) {
            state.form.department = action.payload;
        },
        setDepartmentList(state, action: PayloadAction<Department[]>) {
            state.departmentList = action.payload;
        },
        selectTopics(state, action: PayloadAction<Topic[]>) {
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
    selectDepartment,
    setDepartmentList,
    selectTopics,
    setTopicList,
    setDifficulty,
    setQuestionCount,
    setTimer
} = stepsSlice.actions;
export default stepsSlice.reducer;