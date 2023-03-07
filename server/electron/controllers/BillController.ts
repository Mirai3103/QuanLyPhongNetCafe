import { ipcMain } from "electron";
import { IBill } from "../models/Bill";
import BillService from "../services/BillService";

export enum BillEvents {
    CREATE_BILL = "BILL:create",
    UPDATE_BILL = "BILL:update",
    DELETE_BILL = "BILL:delete",
    GET_ALL_BILL = "BILL:getAll",
    GET_BILL_BY_ID = "BILL:getById",
    GET_OVERRALL_BILL = "BILL:getOverrall",
}

class BillController {
    public init() {
        ipcMain.handle(BillEvents.CREATE_BILL, this.createBill);
        ipcMain.handle(BillEvents.DELETE_BILL, this.deleteBill);
        ipcMain.handle(BillEvents.GET_ALL_BILL, this.getAllBill);
        ipcMain.handle(BillEvents.GET_BILL_BY_ID, this.getBillById);
        ipcMain.handle(BillEvents.GET_OVERRALL_BILL, this.getOverrallBill);
    }
    public async getAllBill(event: Electron.IpcMainInvokeEvent, arg: any) {
        const bills = await BillService.getAllBill();
        return bills;
    }
    public async getBillById(event: Electron.IpcMainInvokeEvent, arg: any) {
        const bill = await BillService.getBillById(arg.id);
        return bill;
    }
    public async createBill(event: Electron.IpcMainInvokeEvent, arg: any) {
        const bill = await BillService.createBill(arg.bill, arg.billDetails);
        if (!bill) {
            global.win.webContents.send("error", "Lỗi khi tạo hóa đơn");
            return null;
        }
        global.win.webContents.send("success", "Tạo hóa đơn thành công");
        return bill;
    }
    public async deleteBill(event: Electron.IpcMainInvokeEvent, arg: any) {
        const bill = await BillService.deleteBill(arg.id);
        if (!bill) {
            global.win.webContents.send("error", "Lỗi khi xóa hóa đơn");
            return null;
        }
        global.win.webContents.send("success", "Xóa hóa đơn thành công");

        return bill;
    }
    public async getOverrallBill(event: Electron.IpcMainInvokeEvent, arg: any) {
        const overral = await BillService.getOverallBill();
        return overral;
    }
}

export default new BillController();
