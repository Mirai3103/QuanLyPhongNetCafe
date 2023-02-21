import { createSlice } from "@reduxjs/toolkit";
import { IEmployee } from "../../electron/models/Employee";
import { AppDispatch, RootState } from "./store";

interface IUserState {
    user: IEmployee | null;
}

const initialState: IUserState = {
    user: null,
};
const userSlice = createSlice({
    name: "user",
    initialState,
    reducers: {
        setUser: (state, action) => {
            state.user = action.payload;
        },
    },
});

export default userSlice.reducer;
export const selectUser = (state: RootState) => state.user.user;
export const { setUser } = userSlice.actions;
