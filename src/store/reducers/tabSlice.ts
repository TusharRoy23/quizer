import { TAB } from "@/utils/types";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface ITab {
    activeTab: TAB
}

const initialState: ITab = {
    activeTab: 'logs'
}

export const tabSlice = createSlice({
    name: "tab",
    initialState,
    reducers: {
        setActiveTab(state, action: PayloadAction<TAB>) {
            state.activeTab = action.payload;
        }
    }
});

export const { setActiveTab } = tabSlice.actions;
export default tabSlice.reducer;