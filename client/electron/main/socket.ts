import io from "socket.io-client";
import dotenv from "dotenv";
import { ipcMain, BrowserWindow } from "electron";
import { createMainWindow } from "./initialWindow";
dotenv.config({
    path: "E:/DoAnKi2Nam2/client/.env",
});
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

let state: UserState | null = null;
const socket = io("http://localhost:4444", {
    query: {
        machine_id: process.env.MACHINE_ID,
    },
});
socket.on("connect", () => {
    console.log("connected");
});

socket.on("disconnect", () => {
    console.log("disconnected");
});

ipcMain.handle("session-initial", (event, arg) => {
    return state;
});
ipcMain.handle("login", (event, arg) => {
    socket.emit("login", arg);
});
socket.on("login-success", (data) => {
    (global.win as BrowserWindow).title = data.account?.username || "User";
    state = {
        ...data,
    };
    //close all window
    BrowserWindow.getAllWindows().forEach((win) => win.close());
    createMainWindow();
});

socket.on("error", (data) => {
    global.win?.webContents.send("error", data);
});

ipcMain.handle("sync-time", (e, args) => {
    state = {
        ...args,
    };
    socket.emit("sync-time", state);
});
socket.on("sync-time-success", (data) => {
    global.win?.webContents.send("sync-time-success", data);
    const newState = {
        account: data.account
            ? {
                  ...data.account,
              }
            : undefined,
        remainingTime: data.totalTime ? data.totalTime - data.usedTime : undefined,
        usedTime: data.usedTime,
        usedCost: data.usedCost,
        totalTime: data.totalTime,
        serviceCost: data.serviceCost,
        machinePrice: undefined,
        balance: undefined,
    };
    Object.keys(newState).forEach((key) => {
        if (newState[key] !== undefined) {
            (state as any)[key] = newState[key];
        }
    });
});

// time-up
ipcMain.handle("time-up", (e, args) => {
    console.log("time-up");
    socket.emit("time-up");
    state = null;
    return true;
    // emit to main process
});
