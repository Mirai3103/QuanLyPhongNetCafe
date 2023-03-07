import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "./store";
import { ipcRenderer } from "electron";
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
    remainingTime: 120,
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
        setAll: (state, action: PayloadAction<any>) => {
            for (const key in action.payload) {
                if (action.payload[key] === undefined) continue;
                (state as any)[key] = (action.payload as any)[key];
            }
            if (state.account) {
                state.account.balance = action.payload.account.balance;
                state.balance = action.payload.account.balance;
            }
            state.remainingTime = state.totalTime - state.usedTime;
        },
        increaseUsedTime: (state) => {
            const gapTimeInSecond = 60;
            const usedTime = state.usedTime + gapTimeInSecond;
            ipcRenderer.invoke("sync-time", {
                usedTime: usedTime,
            });
        },
    },
});

export const { setAccount, setAll, increaseUsedTime } = userSlice.actions;

export default userSlice.reducer;

export const selectAccount = (state: RootState) => state.user.account;
export const selectUser = (state: RootState) => state.user;
export const selectUsedTime = (state: RootState) => state.user.usedTime;
export const selectRemainingTime = (state: RootState) => state.user.remainingTime;
