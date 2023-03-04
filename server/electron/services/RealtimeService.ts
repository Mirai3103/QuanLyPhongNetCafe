import { Socket } from "socket.io";
import { AppDataSource } from "../models/db";
import Machine, { Status } from "../models/Machine";
import accountService from "./AccountService";
import MachineRevenue, { PaymentType } from "./../models/MachineRevenue";
import { IAccount, Role } from "../models/Account";
import sessionService from "./SessionService";
import Session from "../models/Session";
interface UserState {
    account?: IAccount | null;
    totalTime: number;
    usedTime: number;
    remainingTime: number;
    usedCost: number;
    serviceCost: number;
    balance: number;
    machinePrice: number;
}
class RealtimeService {
    async onConnect(socket: Socket) {
        console.log("a user connected");
        socket.on("disconnect", () => {
            console.log("user disconnected");
        });
        socket.on("login", (data) => {
            RealtimeService.emitLogin(socket, data);
        });
        socket.on("sync-time", (data) => {
            RealtimeService.onsyncTime(socket, data);
        });
        socket.on("time-up", () => {
            RealtimeService.onTimeUp(socket);
        });
    }
    static async emitLogin(socket: Socket, data: { username: string; password: string }) {
        const account = await accountService.login(data.username, data.password);
        const session = await sessionService.getSessionByAccountId(account.id);
        if (session) {
            socket.emit("error", "Tài khoản đang được sử dụng");
            return;
        }
        if (account) {
            if (account.balance === 0) {
                socket.emit("error", "Tài khoản không đủ tiền");
                return;
            }
            const machineId = (socket as any).machineId;
            const MachineRespo = AppDataSource.getRepository(Machine);
            const machine = await MachineRespo.findOne({ where: { id: machineId } })!;
            const totalTime = (account.balance / machine.price) * 60 * 60;
            const session = new Session();
            session.account = account;
            session.machine = machine;
            session.startTime = new Date();
            session.expectedEndTime = new Date(Date.now() + totalTime * 60 * 1000);
            session.serviceCost = 0;
            session.usedCost = 0;
            session.usedTime = 0;
            session.totalTime = totalTime;
            session.prePayment = undefined;

            sessionService.addSession(session);
            socket.emit("login-success", {
                account,
                totalTime,
                usedTime: session.usedTime,
                usedCost: session.usedCost,
                serviceCost: session.serviceCost,
                machinePrice: machine.price,
                balance: account.balance,
            });
        } else {
            socket.emit("error", "Sai tên đăng nhập hoặc mật khẩu");
        }
    }

    static async onsyncTime(socket: Socket, { usedTime }: any) {
        console.log("sync-time", usedTime);
        const machineId = (socket as any).machineId;
        const session = await sessionService.getSessionByMachineId(machineId)!;
        console.log(session);
        if (session.account && session.account.role === Role.User) {
            const gap = usedTime - session.usedTime;
            const machinePrice = session.machine!.price;
            const gapCost = (gap / 60 / 60) * machinePrice;
            session.account.balance -= gapCost;
            await accountService.updateAccount(session.account);
        }
        session.usedTime = usedTime;
        await sessionService.updateSession(session.id, session);
        socket.emit("sync-time-success", {
            ...session,
        });
    }
    //time-up
    static async onTimeUp(socket: Socket) {
        console.log("time-up");
        const machineId = (socket as any).machineId;
        sessionService.endSession(machineId);
    }
}

export default new RealtimeService();
