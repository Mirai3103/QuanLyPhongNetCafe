import { Entity, OneToOne, PrimaryGeneratedColumn, Column } from "typeorm";
import Account from "./Account";
import Machine from "./Machine";
import MachineRevenue, { PaymentType } from "./MachineRevenue";

@Entity()
export default class Session {
    @PrimaryGeneratedColumn()
    id: number;
    @OneToOne((type) => Account, (account) => account.session, {
        cascade: true,
    })
    account?: Account;
    @Column()
    totalTime?: number;
    @Column()
    usedTime: number;
    @Column()
    usedCost: number;
    @Column()
    serviceCost: number;
    @OneToOne((type) => Machine, (machine) => machine.session)
    machine: Machine;
    @Column()
    expectedEndTime: Date;
    @Column()
    startTime: Date = new Date();
    @Column()
    prePayment?: number;

    public getRemaningTime() {
        return this.totalTime - this.usedTime;
    }

    public createRevenue() {
        const machineRevenue = new MachineRevenue();
        machineRevenue.account = this.account;
        machineRevenue.endAt = new Date();
        machineRevenue.startAt = this.startTime;
        machineRevenue.isEmployeeUsing =
            this.account?.role === "employee" || this.account?.role === "manager" || this.account?.role === "admin";
        machineRevenue.machine = this.machine;
        machineRevenue.paymentType = this.account
            ? PaymentType.FromBalance
            : this.totalTime
            ? PaymentType.PrePayment
            : PaymentType.PostPayment;
        return machineRevenue;
    }
}
