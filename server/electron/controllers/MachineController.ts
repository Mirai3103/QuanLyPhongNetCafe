import { BrowserWindow, ipcMain } from "electron";
import machineService from "../services/MachineService";
import { IMachine } from "../models/Machine";
export enum MachineEvents {
    GET_ALL = "machine:getAll",
    GET_BY_ID = "machine:getById",
    Create_New = "machine:createNew",
    UPDATE = "machine:update",
    DELETE = "machine:delete",
}

class MachineController {
    init() {
        ipcMain.handle(MachineEvents.GET_ALL, this.getAll);
        ipcMain.handle(MachineEvents.GET_BY_ID, this.getById);
        ipcMain.handle(MachineEvents.Create_New, this.createNew);
        ipcMain.handle(MachineEvents.UPDATE, this.update);
        ipcMain.handle(MachineEvents.DELETE, this.delete);
    }
    destroy() {
        ipcMain.removeHandler(MachineEvents.GET_ALL);
    }
    async getAll(event: Electron.IpcMainInvokeEvent, arg: any) {
        const win: BrowserWindow = global.win;
        const machines = await machineService.getMachineListWithStatus();
        if (!machines) {
            win.webContents.send("error", "Không có dữ liệu");
            return null;
        }
        return machines;
    }
    async getById(event: Electron.IpcMainInvokeEvent, arg: any) {
        const win: BrowserWindow = global.win;
        const machine = await machineService.getMachineById(arg.id);
        if (!machine) {
            win.webContents.send("error", "Không có dữ liệu");
            return null;
        }
        return machine;
    }
    async createNew(event: Electron.IpcMainInvokeEvent, arg: any) {
        const win: BrowserWindow = global.win;
        const machine = await machineService.createMachine(arg.name, arg.type, arg.price);
        if (!machine) {
            win.webContents.send("error", "Lỗi khi tạo máy");
            return null;
        }
        win.webContents.send("success", "Tạo máy thành công");

        return machine;
    }
    async update(event: Electron.IpcMainInvokeEvent, arg: IMachine) {
        const win: BrowserWindow = global.win;
        const machine = await machineService.updateMachine(arg);
        if (!machine) {
            win.webContents.send("error", "Không có dữ liệu");
            return null;
        }
        win.webContents.send("success", "Cập nhật máy thành công");

        return machine;
    }
    async delete(event: Electron.IpcMainInvokeEvent, arg: any) {
        const win: BrowserWindow = global.win;
        const machine = await machineService.deleteMachine(arg.id);
        if (!machine) {
            win.webContents.send("error", "Không có dữ liệu");
            return null;
        }
        win.webContents.send("success", "Xóa máy thành công");
        return machine;
    }
}

export default new MachineController();
