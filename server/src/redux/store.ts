import { createSlice, configureStore } from "@reduxjs/toolkit";
import userSplice from "./userSplice";
const store = configureStore({
    reducer: {
        user: userSplice,
    },
    middleware: (getDefaultMiddleware) => getDefaultMiddleware(),
});

export default store;
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
