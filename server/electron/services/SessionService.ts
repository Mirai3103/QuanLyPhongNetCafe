import Account from "../models/Account";
import MachineRevenue from "../models/MachineRevenue";
import { AppDataSource } from "../models/db/index";
import Session from "../models/Session";
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
        await AppDataSource.getRepository(MachineRevenue).save(machineRevenue);
        await AppDataSource.getRepository(Session).delete(session.id);
    }

    public updateSession(sessionId: number, session: Session) {
        AppDataSource.getRepository(Session).update({ id: sessionId }, session);
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
        session.prePayment += amount;
        await AppDataSource.getRepository(Session).save(session);
    }
}

export default new SessionService();
