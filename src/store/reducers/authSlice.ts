import { UserInfo } from "@/utils/types";
import { createSlice } from "@reduxjs/toolkit";

interface AuthState {
    isAuthenticated: boolean;
    isLoading?: boolean;
    user: UserInfo | undefined; // Replace 'any' with a more specific type if available
}

const authState: AuthState = {
    isAuthenticated: false,
    isLoading: true,
    user: undefined,
}

export const authSlice = createSlice({
    name: "auth",
    initialState: authState,
    reducers: {
        setAuthentication(state, action) {
            state.isAuthenticated = action.payload.authenticated;
            state.user = action.payload.user;
        },
        setLoading(state, action) {
            state.isLoading = action.payload.isLoading;
        }
    }
});

export const { setAuthentication, setLoading } = authSlice.actions;
export default authSlice.reducer;