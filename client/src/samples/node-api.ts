import { ipcRenderer } from "electron";

ipcRenderer.on("main-process-message", (_event, ...args) => {
    console.log("[Receive Main-process message]:", ...args);
});
ipcRenderer.on("message", (_event, ...args) => {
    console.log("[Receive message]:", ...args);
});
export const sendMainProcessMessage = (message: string) => {
    ipcRenderer.send("message", message);
};
