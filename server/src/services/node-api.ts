import { ipcRenderer } from "electron";
import { AccountEvents } from "./type";

ipcRenderer.on("main-process-message", (_event, ...args) => {
    console.log("[Receive Main-process message]:", ...args);
});
ipcRenderer.on("message", (_event, ...args) => {
    console.log("[Receive message]:", ...args);
});
export const login = (username: string, password: string) => {
    ipcRenderer.invoke(AccountEvents.LOGIN, { username, password });
};

export const getInfo = async () => {
    return await ipcRenderer.invoke(AccountEvents.GET_INFO);
};
