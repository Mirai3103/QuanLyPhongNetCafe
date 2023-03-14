import Account from "../models/Account";
import MachineUsage from "../models/MachineUsages";
import { AppDataSource } from "../models/db/index";
import Session from "../models/Session";
import Machine from "../models/Machine";
import { Server, Socket } from "socket.io";
import { DefaultEventsMap } from "socket.io/dist/typed-events";
class SessionService {
    async getSessionByMachineId(machineId: number) {
        return await AppDataSource.getRepository(Session).findOne({
            where: {
                machine: { id: machineId },
            },
            relations: ["account", "machine"],
        });
    }
    public addSession(session: Session) {
        AppDataSource.getRepository(Session).insert(session);
    }
    public async getSession(machineId: number) {
        return await AppDataSource.getRepository(Session).findOne({
            where: {
                machine: { id: machineId },
            },
            relations: ["account", "machine"],
        });
    }
    public async getAllSession() {
        return await AppDataSource.getRepository(Session).find({
            relations: ["account", "machine"],
        });
    }
    public async endSession(machineId: number) {
        const session = await AppDataSource.getRepository(Session).findOne({
            where: {
                machine: { id: machineId },
            },
            relations: ["account", "machine"],
        });
        if (!session) {
            return;
        }
        const machineRevenue = session.createRevenue();
        await AppDataSource.getRepository(MachineUsage).save(machineRevenue);
        await AppDataSource.getRepository(Session).delete(session.id);
    }
    public async renewData(accountId: number) {
        const oldSession = await this.getSessionByAccountId(accountId);

        if (!oldSession) {
            return;
        }
        const account = oldSession.account;
        const machine = oldSession.machine;
        const totalTime = (account.balance / machine.price) * 60 * 60;
        oldSession.expectedEndTime = new Date(oldSession.startTime.getTime() + totalTime * 60 * 1000);
        oldSession.totalTime = totalTime;
        await AppDataSource.getRepository(Session).save(oldSession);
        (global.io as Server<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap, any>)
            .of("/")
            .sockets.forEach((socket: Socket) => {
                if ((socket as any).machineId === oldSession.machineId) {
                    socket.emit("recharge", JSON.parse(JSON.stringify(oldSession)));
                }
            });
    }

    public async updateSession(sessionId: number, session: Session) {
        await AppDataSource.getRepository(Session).update({ id: sessionId }, session);
    }
    public async rechangeSession(machineId: number, amount: number) {
        const session = await this.getSession(machineId);
        if (!session) {
            global.win?.webContents.send("error", "Không tìm thấy phiên");
            return;
        }
        if (session.account) {
            session.account.balance += amount;
            await AppDataSource.getRepository(Account).save(session.account);
            return;
        }
        if (!session.totalTime) {
            global.win?.webContents.send("error", "Không thể nạp tiền vào phiên trả sau");
            return;
        }
        const amountTime = (amount / session.machine.price) * 60 * 60;
        session.totalTime += amountTime;
        session.PrepaidAmount += amount;
        await AppDataSource.getRepository(Session).save(session);
    }
    public async getSessionByAccountId(accountId: number) {
        return await AppDataSource.getRepository(Session).findOne({
            where: {
                account: { id: accountId },
            },
            relations: ["account", "machine"],
        });
    }
    public async createPrepaymentSession(machineId: number, amount: number) {
        const existingSession = await this.getSessionByMachineId(machineId);
        if (existingSession) {
            global.win?.webContents.send("error", "Máy đang được sử dụng");
            return;
        }
        const machine = await AppDataSource.getRepository(Machine).findOne({
            where: {
                id: machineId,
            },
        });
        if (!machine) {
            global.win?.webContents.send("error", "Không tìm thấy máy");
            return;
        }
        const session = new Session();
        session.machine = machine;
        session.PrepaidAmount = amount;
        session.totalTime = (amount / machine.price) * 60 * 60; //seconds
        session.startTime = new Date();
        session.expectedEndTime = new Date(new Date().getTime() + session.totalTime * 1000);
        await AppDataSource.getRepository(Session).save(session);
    }
    async createPostPaymentSession(machineId: number) {
        const existingSession = await this.getSessionByMachineId(machineId);
        if (existingSession) {
            global.win?.webContents.send("error", "Máy đang được sử dụng");
            return;
        }
        const machine = await AppDataSource.getRepository(Machine).findOne({
            where: {
                id: machineId,
            },
        });
        if (!machine) {
            global.win?.webContents.send("error", "Không tìm thấy máy");
            return;
        }
        const session = new Session();
        session.machine = machine;
        session.startTime = new Date();
        session.PrepaidAmount = null;
        session.totalTime = null;
        session.account = null;
        await AppDataSource.getRepository(Session).save(session);
    }
}

export default new SessionService();
