import { UserInfo } from "@/types";
import { createSlice } from "@reduxjs/toolkit";

interface AuthState {
    isAuthenticated: boolean;
    user: UserInfo | undefined; // Replace 'any' with a more specific type if available
}

const authState: AuthState = {
    isAuthenticated: false,
    user: undefined,
}

export const authSlice = createSlice({
    name: "auth",
    initialState: authState,
    reducers: {
        setAuthentication(state, action) {
            state.isAuthenticated = action.payload.authenticated;
            state.user = action.payload.user;
        }
    }
});

export const { setAuthentication } = authSlice.actions;
export default authSlice.reducer;