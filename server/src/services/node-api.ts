import { ipcRenderer } from "electron";
import { AccountEvents } from "./type";

export const login = (username: string, password: string) => {
    ipcRenderer.invoke(AccountEvents.LOGIN, { username, password });
};

export const getInfo = async () => {
    return await ipcRenderer.invoke(AccountEvents.GET_INFO);
};
