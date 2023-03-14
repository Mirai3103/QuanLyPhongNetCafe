import accountService from "../services/AccountService";
import sessionService from "../services/SessionService";
import { BrowserWindow, ipcMain } from "electron";
import { IAccount, Role } from "../models/Account";
import employeeService from "../services/EmployeeService";
import { createMainWindow } from "../main";
import { getUser, setUser } from "../utils/constant";

export enum AccountEvents {
    LOGIN = "account:login",
    REGISTER = "account:register",
    RECHARGE = "account:recharge",
    DEDUCTION = "account:deduction",
    GET_INFO = "account:getInfo",
    RESET_PASSWORD = "account:resetPassword",
    GET_ALL = "account:getAll",
    GET_A_USER_DETAIL = "account:getAUserDetail",
    DELETE_ACCOUNT = "account:deleteAccount",
    UPDATE_ACCOUNT = "account:updateAccount",
}

class AccountController {
    init() {
        ipcMain.handle(AccountEvents.LOGIN, this.login);
        ipcMain.handle(AccountEvents.REGISTER, this.register);
        ipcMain.handle(AccountEvents.RECHARGE, this.recharge);
        ipcMain.handle(AccountEvents.GET_ALL, this.getAll);
        ipcMain.handle(AccountEvents.GET_INFO, this.getInfo);
        ipcMain.handle(AccountEvents.GET_A_USER_DETAIL, this.getAUserDetail);
        ipcMain.handle(AccountEvents.DELETE_ACCOUNT, this.deleteAccount);
        ipcMain.handle(AccountEvents.UPDATE_ACCOUNT, this.updateAccountevent);
    }

    async updateAccountevent(event: Electron.IpcMainInvokeEvent, account: IAccount) {
        const isSuccess = await accountService.updateAccount(account);
        const win = global.win as BrowserWindow;

        if (!isSuccess) {
            win.webContents.send("error", `Trùng tên tài khoản ${account.username}`);
            return false;
        }

        win.webContents.send("success", ` Cập nhật tài khoản ${account.username} thành công`);
        return true;
    }
    async deleteAccount(event: Electron.IpcMainInvokeEvent, arg: any) {
        const win = global.win as BrowserWindow;
        const account = await accountService.deleteAccount(arg.id);
        if (account) {
            win.webContents.send("success", "Xóa tài khoản thành công");
            return account;
        }
        win.webContents.send("error", "Xóa tài khoản thất bại");
        return false;
    }
    async login(event: Electron.IpcMainInvokeEvent, arg: any) {
        const win = global.win as BrowserWindow;
        const account = await accountService.login(arg.username, arg.password);
        if (!account) {
            win.webContents.send("error", "Tên đăng nhập hoặc mật khẩu không đúng");
            return null;
        }
        if (account.role === Role.Admin || account.role === Role.Manager || account.role === Role.Employee) {
            win.webContents.send("success", "Đăng nhập thành công");
            const em = await employeeService.getEmployeeByAccountId(account.id);
            setUser(em);
            win.close();
            createMainWindow();
            return account;
        }
        win.webContents.send("error", "Tài khoản không có quyền truy cập");
    }
    async register(event: Electron.IpcMainInvokeEvent, arg: any) {
        const win = global.win as BrowserWindow;
        const account = await accountService.register(arg.username, arg.password, arg.role, arg.initialBalance);
        if (!account) {
            win.webContents.send("error", "Tên đăng nhập đã tồn tại");
            return null;
        }
        win.webContents.send("success", "Đăng ký thành công");
        return account;
    }
    async recharge(event: Electron.IpcMainInvokeEvent, arg: any) {
        const win = global.win as BrowserWindow;
        const result = await accountService.recharge(arg.id, arg.money);
        if (!result) {
            win.webContents.send("error", "Tài khoản không tồn tại");
            return false;
        }
        await sessionService.renewData(arg.id);

        return result;
    }
    async getAll(event: Electron.IpcMainInvokeEvent, arg: any) {
        const accounts = await accountService.getAllAccounts();
        return accounts;
    }
    async getInfo(event: Electron.IpcMainInvokeEvent, arg: any) {
        return getUser();
    }
    async getAUserDetail(event: Electron.IpcMainInvokeEvent, arg: any) {
        const account = await accountService.getAccountInfo(arg.id);
        return account;
    }
}
export default new AccountController();
