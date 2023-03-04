import { app, BrowserWindow, shell, ipcMain, Menu } from "electron";
import { release } from "node:os";
import { join } from "node:path";
import { initDatabase } from "../models/db/index";
import "./server";
import "./server";
import "../controllers";
process.env.DIST_ELECTRON = join(__dirname, "../");
process.env.DIST = join(process.env.DIST_ELECTRON, "../dist");
process.env.PUBLIC = process.env.VITE_DEV_SERVER_URL ? join(process.env.DIST_ELECTRON, "../public") : process.env.DIST;
// Disable GPU Acceleration for Windows 7
// if (release().startsWith("6.1")) app.disableHardwareAcceleration();
// Set application name for Windows 10+ notifications
if (process.platform === "win32") app.setAppUserModelId(app.getName());
if (!app.requestSingleInstanceLock()) {
    app.quit();
    process.exit(0);
}

initDatabase();

const preload = join(__dirname, "../preload/index.js");
const url = process.env.VITE_DEV_SERVER_URL;
const indexHtml = join(process.env.DIST, "index.html");
Menu.setApplicationMenu(null);
async function createLoginWindow() {
    const win = new BrowserWindow({
        title: "Main window",
        icon: join(process.env.PUBLIC, "favicon.ico"),
        webPreferences: {
            preload,
            // Warning: Enable nodeIntegration and disable contextIsolation is not secure in production
            // Consider using contextBridge.exposeInMainWorld
            // Read more on https://www.electronjs.org/docs/latest/tutorial/context-isolation
            nodeIntegration: true,
            contextIsolation: false,
        },
        fullscreen: true,
        autoHideMenuBar: true,
    });
    global.win = win;
    if (process.env.VITE_DEV_SERVER_URL) {
        win.loadURL(url);
        win.webContents.openDevTools();
    } else {
        win.loadFile(indexHtml);
    }

    win.webContents.on("did-finish-load", () => {
        win?.webContents.send("main-process-message", new Date().toLocaleString());
    });
    win.webContents.setWindowOpenHandler(({ url }) => {
        if (url.startsWith("https:")) shell.openExternal(url);
        return { action: "deny" };
    });
}

export async function createMainWindow() {
    const win = new BrowserWindow({
        title: "Main window",
        icon: join(process.env.PUBLIC, "favicon.ico"),
        webPreferences: {
            preload,
            nodeIntegration: true,
            contextIsolation: false,
            zoomFactor: 1.0,
        },
        autoHideMenuBar: true,
        resizable: false,
    });
    //open dev tools
    win.webContents.openDevTools();
    global.win = win;
    win.setSize(1300, 800);
    // set location center screen
    win.center();
    if (process.env.VITE_DEV_SERVER_URL) {
        win.loadURL(url + "/main/home");
    } else {
        win.loadFile(indexHtml);
    }
}
app.whenReady().then(() => {
    createLoginWindow();
});

app.on("window-all-closed", () => {
    global.win = null;
    if (process.platform !== "darwin") app.quit();
});

app.on("second-instance", () => {
    const win = global.win;
    if (win) {
        if (win.isMinimized()) win.restore();
        win.focus();
    }
});
app.on("activate", () => {
    const allWindows = BrowserWindow.getAllWindows();
    if (allWindows.length) {
        allWindows[0].focus();
    } else {
        createLoginWindow();
    }
});
app.on("ready", () => {});

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
ipcMain.handle("openLogin", () => {
    global.win?.close();
    createLoginWindow();
});
