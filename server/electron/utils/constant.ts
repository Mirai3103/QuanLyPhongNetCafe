import { BrowserWindow } from "electron";
import Employee from "../models/Employee";

let win: BrowserWindow | null = null;
let user: Employee | null = null;

export const getWin = () => win;

export const setWin = (window: BrowserWindow) => {
    win = window;
};

export const getUser = () => user;
export const setUser = (employee: Employee) => {
    user = employee;
};
