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
            for (const key in action.payload) {
                (state as any)[key] = (action.payload as any)[key];
            }
            if (state.account) {
                state.account.balance = action.payload.balance;
                state.balance = action.payload.balance;
            }
        },
        increaseUsedTime: (state) => {
            const gapTimeInSecond = 60;
            if (state.account) {
                state.account.balance = state.account.balance - (gapTimeInSecond / 60 / 60) * state.machinePrice;
            }
            state.usedTime += gapTimeInSecond;
            state.balance = state.balance - (gapTimeInSecond / 60 / 60) * state.machinePrice;
            state.remainingTime = state.totalTime - state.usedTime;
            // if (state.remainingTime <= 0) {
            //     //toDo: logout
            //     ipcRenderer.invoke("time-up", {
            //         machineId: process.env.MACHINE_ID,
            //         account: state.account,
            //     });
            // }
            // ipcRenderer.invoke("sync-time", {
            //     usedTime: state.usedTime,
            // });
        },
    },
});

export const { setAccount, setAll, increaseUsedTime } = userSlice.actions;

export default userSlice.reducer;

export const selectAccount = (state: RootState) => state.user.account;
export const selectUser = (state: RootState) => state.user;
