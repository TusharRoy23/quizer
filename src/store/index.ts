import { persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";
import stepsSlice from "./reducers/stepSlice";
import authSlice from "./reducers/authSlice";
import searchSlice from "./reducers/searchSlice";
import tabSlice from "./reducers/tabSlice";
import verbalStepsSlice from "./reducers/verbalStepSlice";
import { combineReducers, configureStore } from "@reduxjs/toolkit";
import { persistStore } from "redux-persist";

const persistConfigStep = { key: "step", storage };
const persistConfigAuth = { key: "auth", storage };
const persistConfigSearch = { key: "search", storage };
const persistConfigVerbalTab = { key: "verbal-tab", storage };
const persistConfigVerbalStep = { key: "verbal-step", storage };

const persistedStepReducer = persistReducer(persistConfigStep, stepsSlice);
const persistedAuthReducer = persistReducer(persistConfigAuth, authSlice);
const persistedSearchReducer = persistReducer(persistConfigSearch, searchSlice);
const persistedVerbalTabReducer = persistReducer(persistConfigVerbalTab, tabSlice);
const persistedVerbalStepReducer = persistReducer(persistConfigVerbalStep, verbalStepsSlice);

const rootReducer = combineReducers({
    steps: persistedStepReducer,
    auth: persistedAuthReducer,
    search: persistedSearchReducer,
    verbalTab: persistedVerbalTabReducer,
    verbalSteps: persistedVerbalStepReducer
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