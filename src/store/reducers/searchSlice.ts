import { createSlice, PayloadAction } from "@reduxjs/toolkit";

const initialState = {
    isEnabled: false,
}

export const searchSlice = createSlice({
    name: "search",
    initialState,
    reducers: {
        setSearchEnable(state, action: PayloadAction<boolean>) {
            state.isEnabled = action.payload;
        }
    },
});

export const { setSearchEnable } = searchSlice.actions;
export default searchSlice.reducer;