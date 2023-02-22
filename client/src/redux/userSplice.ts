import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "./store";
interface IAccount {
    id: number;
    username: string;
    password: string;
    role: string;
    createdAt: Date;
    balance: number;
}

interface UserState {
    account?: IAccount | null;
    totalTime: number;
    usedTime: number;
    remainingTime: number;
    usedCost: number;
    serviceCost: number;
    balance: number;
    machinePrice: number;
}

const initialState: UserState = {
    account: null,
    totalTime: 0,
    usedTime: 0,
    remainingTime: 0,
    usedCost: 0,
    serviceCost: 0,
    balance: 0,
    machinePrice: 0,
};

export const userSlice = createSlice({
    name: "user",
    initialState,
    reducers: {
        setAccount: (state, action: PayloadAction<IAccount>) => {
            state.account = action.payload;
        },
        setAll: (state, action: PayloadAction<UserState>) => {
            state.account = action.payload.account;
            state.totalTime = action.payload.totalTime;
            state.usedTime = action.payload.usedTime;
            state.remainingTime = action.payload.remainingTime;
            state.usedCost = action.payload.usedCost;
            state.serviceCost = action.payload.serviceCost;
            state.balance = action.payload.balance;
            state.machinePrice = action.payload.machinePrice;
        },
    },
});

export const { setAccount, setAll } = userSlice.actions;

export default userSlice.reducer;

export const selectAccount = (state: RootState) => state.user.account;
export const selectUser = (state: RootState) => state.user;
