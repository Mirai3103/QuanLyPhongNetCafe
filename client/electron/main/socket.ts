import io from "socket.io-client";
import dotenv from "dotenv";
import { ipcMain, BrowserWindow } from "electron";
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
    console.log("login");
    socket.emit("login", arg);
});
socket.on("login-success", (data) => {
    console.log("login", data);
    (global.win as BrowserWindow).title = data.account?.username || "User";
    state = {
        ...data,
    };
    global.win?.webContents.send("login", data);
});

socket.on("error", (data) => {
    global.win?.webContents.send("error", data);
});
