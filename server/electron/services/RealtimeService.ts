import { Socket } from "socket.io";
import { AppDataSource } from "../models/db";
import Machine from "../models/Machine";
import accountService from "./AccountService";
import MachineRevenue, { PaymentType } from "./../models/MachineRevenue";
import { IAccount, Role } from "../models/Account";
import sessionService from "./SessionService";
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
        console.log(RealtimeService.emitLogin);
        socket.on("login", (data) => {
            RealtimeService.emitLogin(socket, data);
        });
    }
    static async emitLogin(socket: Socket, data: { username: string; password: string }) {
        const account = await accountService.login(data.username, data.password);
        if (account) {
            if (account.balance === 0) {
                socket.emit("error", "Tài khoản không đủ tiền");
                return;
            }
            const machineId = (socket as any).machineId;
            const MachineRespo = AppDataSource.getRepository(Machine);
            const machine = await MachineRespo.findOne({ where: { id: machineId } })!;
            const MachineRevenueRespo = AppDataSource.getRepository(MachineRevenue);
            const newMachineRevenue = new MachineRevenue();
            newMachineRevenue.machine = machine;
            newMachineRevenue.account = account;
            newMachineRevenue.isEmployeeUsing =
                account.role === Role.Employee || account.role === Role.Admin || account.role === Role.Manager;
            newMachineRevenue.paymentType = PaymentType.FromBalance;
            const totalTime = (account.balance / machine.price) * 60;
            const usedTime = 0;
            const remainingTime = totalTime;
            const usedCost = 0;
            const serviceCost = 0;
            const balance = account.balance;
            const machinePrice = machine.price;
            await MachineRevenueRespo.save(newMachineRevenue);
            console.log("login", {
                account,
                totalTime,
                usedTime,
                remainingTime,
                usedCost,
                serviceCost,
                balance,
                machinePrice,
            });

            sessionService.addSession({
                account,
                totalTime,
                usedTime,
                remainingTime,
                usedCost,
                serviceCost,
                balance,
                machinePrice,
                expectedEndTime: new Date(Date.now() + totalTime * 60 * 1000),
                machineRevenue: newMachineRevenue,
                startTime: new Date(),
            });
            socket.emit("login-success", {
                account,
                totalTime,
                usedTime,
                remainingTime,
                usedCost,
                serviceCost,
                balance,
                machinePrice,
            });
        } else {
            socket.emit("error", "Sai tên đăng nhập hoặc mật khẩu");
        }
    }
}

export default new RealtimeService();
