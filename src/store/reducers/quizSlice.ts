import { createSlice } from "@reduxjs/toolkit";

interface QuizSlicerState {
    pageNumber: number;
    generatedPageNumber: number;
}

const initialState: QuizSlicerState = {
    pageNumber: 0,
    generatedPageNumber: 0,
};

export const quizSlice = createSlice({
    name: "quiz",
    initialState: initialState,
    reducers: {
        setPageNumber(state, action) {
            state.pageNumber = action.payload.pageNumber;
        },
        resetPageNumber(state) {
            state.pageNumber = 0;
        },
        setGeneratedPageNumber(state, action) {
            state.generatedPageNumber = action.payload.pageNumber;
        },
        resetGeneratedPageNumber(state) {
            state.generatedPageNumber = 0;
        }
    },
});

export const {
    setPageNumber,
    resetPageNumber,
    setGeneratedPageNumber,
    resetGeneratedPageNumber
} = quizSlice.actions;
export default quizSlice.reducer;