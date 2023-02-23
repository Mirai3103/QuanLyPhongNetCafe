import accountService from "../services/AccountService";
import { BrowserWindow, ipcMain } from "electron";
import { Role } from "../models/Account";
import { getWin, setUser, getUser } from "../utils/constant";
import employeeService from "../services/EmployeeService";
import { createMainWindow } from "../main";

enum AccountEvents {
    LOGIN = "account:login",
    REGISTER = "account:register",
    RECHARGE = "account:recharge",
    DEDUCTION = "account:deduction",
    GET_INFO = "account:getInfo",
    RESET_PASSWORD = "account:resetPassword",
    GET_ALL = "account:getAll",
}

class AccountController {
    init() {
        ipcMain.handle(AccountEvents.LOGIN, this.login);
        ipcMain.handle(AccountEvents.REGISTER, this.register);
        ipcMain.handle(AccountEvents.RECHARGE, this.recharge);
        ipcMain.handle(AccountEvents.GET_ALL, this.getAll);
        ipcMain.handle(AccountEvents.GET_INFO, this.getInfo);
    }
    destroy() {
        ipcMain.removeHandler(AccountEvents.LOGIN);
    }
    async login(event: Electron.IpcMainInvokeEvent, arg: any) {
        const win = getWin();
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
        const win = getWin();
        const account = await accountService.register(arg.username, arg.password, arg.balance);
        if (!account) {
            win.webContents.send("error", "Tài khoản đã tồn tại");
            return null;
        }
        win.webContents.send("success", "Đăng ký thành công");
        return account;
    }
    async recharge(event: Electron.IpcMainInvokeEvent, arg: any) {
        const win = getWin();
        const result = await accountService.recharge(arg.username, arg.amount);
        if (!result) {
            win.webContents.send("error", "Tài khoản không tồn tại");
            return null;
        }
        win.webContents.send("success", "Nạp tiền thành công");
        return result;
    }
    async getAll(event: Electron.IpcMainInvokeEvent, arg: any) {
        const accounts = await accountService.getAllAccounts();
        return accounts;
    }
    async getInfo(event: Electron.IpcMainInvokeEvent, arg: any) {
        return getUser();
    }
}
export default new AccountController();
