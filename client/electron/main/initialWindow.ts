import { BrowserWindow, shell } from "electron";
import { join } from "node:path";
export async function createMainWindow() {
    global.win = new BrowserWindow({
        title: "Main window",
        icon: join(process.env.PUBLIC, "favicon.ico"),
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false,
        },
        fullscreen: false,
        autoHideMenuBar: true,
        resizable: false,
        width: 300,
        height: 670,
        titleBarStyle: "hidden",
    });
    // location to top right
    const screenWidth = global.win.getBounds().width;
    const { width } = require("electron").screen.getPrimaryDisplay().workAreaSize;
    global.win.setPosition(width - screenWidth, 0);

    global.win.loadURL(process.env.MAIN_WINDOW_URL as string);
    global.win.webContents.openDevTools();

    global.win.webContents.on("did-finish-load", () => {
        global.win?.webContents.send("main-process-message", new Date().toLocaleString());
    });
    global.win.webContents.setWindowOpenHandler(({ url }) => {
        if (url.startsWith("https:")) shell.openExternal(url);
        return { action: "deny" };
    });
}
