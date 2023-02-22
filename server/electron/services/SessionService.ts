import Account from "../models/Account";
import MachineRevenue from "../models/MachineRevenue";
import { AppDataSource } from "../models/db/index";

export class Session {
    public account: Account;
    public totalTime: number;
    public usedTime: number;
    public remainingTime: number;
    public usedCost: number;
    public serviceCost: number;
    public balance: number;
    public machinePrice: number;
    public startTime: Date;
    public expectedEndTime: Date;
    public machineRevenue: MachineRevenue;
}

class SessionService {
    private sessions: Session[] = [];
    public addSession(session: Session) {
        this.sessions.push(session);
    }
    public getSession(accountId: number) {
        return this.sessions.find((session) => session.account.id === accountId);
    }
    public async endSession(accountId: number) {
        const session = this.getSession(accountId);
        this.sessions = this.sessions.filter((session) => session.account.id !== accountId);
        //toDo: save to database
        await AppDataSource.getMongoRepository(MachineRevenue).save(session.machineRevenue);
    }

    public updateSession(accountId: number, session: Session) {
        const index = this.sessions.findIndex((session) => session.account.id === accountId);
        this.sessions[index] = session;
    }
}

export default new SessionService();
