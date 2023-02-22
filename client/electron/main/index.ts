import { app, BrowserWindow, shell, ipcMain } from "electron";
import { join } from "node:path";
import dotenv from "dotenv";

dotenv.config({
    path: "E:/DoAnKi2Nam2/client/.env",
});
import "./socket";

process.env.DIST_ELECTRON = join(__dirname, "../");
process.env.DIST = join(process.env.DIST_ELECTRON, "../dist");
process.env.PUBLIC = process.env.VITE_DEV_SERVER_URL ? join(process.env.DIST_ELECTRON, "../public") : process.env.DIST;
// if (release().startsWith("6.1")) app.disableHardwareAcceleration();
if (process.platform === "win32") app.setAppUserModelId(app.getName());
// if (!app.requestSingleInstanceLock()) {
//     console.log("Another instance is running, quitting...");
//     app.quit();
//     process.exit(0);
// }

global.win = null;
const preload = join(__dirname, "../preload/index.js");
const url = process.env.VITE_DEV_SERVER_URL;
console.log(url);
const indexHtml = join(process.env.DIST, "index.html");
async function createWindow() {
    global.win = new BrowserWindow({
        title: "Main window",
        icon: join(process.env.PUBLIC, "favicon.ico"),
        webPreferences: {
            preload,
            nodeIntegration: true,
            contextIsolation: false,
        },
        fullscreen: true,
        autoHideMenuBar: true,
    });
    if (process.env.VITE_DEV_SERVER_URL) {
        global.win.loadURL(url + "/login");
        global.win.webContents.openDevTools();
    } else {
        global.win.loadFile(indexHtml);
    }
    global.win.webContents.on("did-finish-load", () => {
        global.win?.webContents.send("main-process-message", new Date().toLocaleString());
    });
    global.win.webContents.setWindowOpenHandler(({ url }) => {
        if (url.startsWith("https:")) shell.openExternal(url);
        return { action: "deny" };
    });
}

async function createMainWindow() {
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
    if (process.env.VITE_DEV_SERVER_URL) {
        global.win.loadURL(url + "/main");
        global.win.webContents.openDevTools();
    } else {
        global.win.loadFile(indexHtml);
    }
    global.win.webContents.on("did-finish-load", () => {
        global.win?.webContents.send("main-process-message", new Date().toLocaleString());
    });
    global.win.webContents.setWindowOpenHandler(({ url }) => {
        if (url.startsWith("https:")) shell.openExternal(url);
        return { action: "deny" };
    });
}

app.whenReady().then(createMainWindow);

app.on("window-all-closed", () => {
    global.win = null;
    if (process.platform !== "darwin") app.quit();
});

app.on("second-instance", () => {
    if (global.win) {
        if (global.win.isMinimized()) global.win.restore();
        global.win.focus();
    }
});
app.on("activate", () => {
    const allWindows = BrowserWindow.getAllWindows();
    if (allWindows.length) {
        allWindows[0].focus();
    } else {
        createMainWindow();
    }
});
// New window example arg: new windows url
ipcMain.handle("open-win", (_, arg) => {
    const childWindow = new BrowserWindow({
        webPreferences: {
            preload,
            nodeIntegration: true,
            contextIsolation: false,
        },
    });

    if (process.env.VITE_DEV_SERVER_URL) {
        childWindow.loadURL(`${url}#${arg}`);
    } else {
        childWindow.loadFile(indexHtml, { hash: arg });
    }
});
