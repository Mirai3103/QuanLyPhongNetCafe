import { BrowserWindow } from "electron";
import ReceiptService from "../services/ReceiptService";

export enum ReceiptEvents {
    CREATE_RECEIPT = "receipt:create",
    UPDATE_RECEIPT = "receipt:update",
    DELETE_RECEIPT = "receipt:delete",
    GET_ALL_RECEIPT = "receipt:getAll",
    GET_RECEIPT_BY_ID = "receipt:getById",
}
class ReceiptController {
    public init() {}
    async getAll() {
        return await ReceiptService.getAllReceipt();
    }
    async getById(event: Electron.IpcMainInvokeEvent, arg: any) {
        const receipt = await ReceiptService.getReceiptById(arg.id);
        if (!receipt) {
            return null;
        }
        return receipt;
    }
    async createNew(event: Electron.IpcMainInvokeEvent, arg: any) {
        const receipt = await ReceiptService.createReceipt(arg.customerId, arg.receiptDetails);
        if (!receipt) {
            return null;
        }
        return receipt;
    }
}

export default new ReceiptController();
