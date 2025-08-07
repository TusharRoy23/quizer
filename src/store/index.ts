import { persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";
import stepsSlice from "./reducers/stepSlice";
import authSlice from "./reducers/authSlice";
import { combineReducers, configureStore } from "@reduxjs/toolkit";
import { persistStore } from "redux-persist";

const persistConfigStep = { key: "step", storage };
const persistConfigAuth = { key: "auth", storage };

const persistedStepReducer = persistReducer(persistConfigStep, stepsSlice);
const persistedAuthReducer = persistReducer(persistConfigAuth, authSlice);

const rootReducer = combineReducers({
    steps: persistedStepReducer,
    auth: persistedAuthReducer,
});

export const store = configureStore({
    reducer: rootReducer,
    middleware: (getDefaultMiddleware) => getDefaultMiddleware({
        serializableCheck: false // Disable serializable check for redux-persist
    }),
});

// Types
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

// Persistor
export const persistor = persistStore(store);