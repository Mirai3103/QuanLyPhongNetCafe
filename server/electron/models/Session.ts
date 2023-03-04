import { Entity, OneToOne, PrimaryGeneratedColumn, Column, JoinColumn } from "typeorm";
import Account from "./Account";
import Machine from "./Machine";
import MachineRevenue, { PaymentType } from "./MachineRevenue";

@Entity()
export default class Session {
    @PrimaryGeneratedColumn()
    id: number;
    @Column({
        nullable: true,
        type: "int",
    })
    accountId?: number;
    @OneToOne((type) => Account, (account) => account.session, {
        cascade: true,
    })
    @JoinColumn({ name: "accountId" })
    account?: Account;
    @Column({
        nullable: true,
        type: "int",
    })
    totalTime?: number;
    @Column({
        type: "int",
    })
    usedTime: number;
    @Column({
        type: "int",
    })
    usedCost: number;
    @Column({
        type: "int",
    })
    serviceCost: number;
    @Column({
        type: "int",
    })
    machineId: number;

    @OneToOne((type) => Machine, (machine) => machine.session)
    @JoinColumn({ name: "machineId" })
    machine: Machine;
    @Column({
        type: "datetime",
    })
    expectedEndTime: Date;
    @Column({
        type: "datetime",
    })
    startTime: Date = new Date();
    @Column({
        nullable: true,
        type: "int",
    })
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

export type ISession = {
    [key in keyof Session]: Session[key] extends Function ? never : Session[key];
};
