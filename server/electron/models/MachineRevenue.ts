import {
    Entity,
    Column,
    PrimaryGeneratedColumn,
    CreateDateColumn,
    DeleteDateColumn,
    UpdateDateColumn,
    ManyToOne,
    PrimaryColumn,
    JoinColumn,
} from "typeorm";

import Account from "./Account";
import Machine from "./Machine";

export enum PaymentType {
    PrePayment = "prePayment",
    PostPayment = "postPayment",
    FromBalance = "fromBalance",
}

@Entity()
export default class MachineRevenue {
    @PrimaryGeneratedColumn()
    id: number;

    //is Employee using this machine?
    @Column({
        type: "boolean",
        default: false,
    })
    isEmployeeUsing: boolean;
    @CreateDateColumn()
    startAt: Date;
    @UpdateDateColumn()
    updatedAt: Date;
    @DeleteDateColumn()
    deletedAt: Date;
    @Column({
        type: "datetime",
        nullable: true,
    })
    endAt?: Date | null;
    @ManyToOne(() => Account, (account) => account.machineRevenues)
    account?: Account;
    @ManyToOne(() => Machine, (machine) => machine.machineRevenues)
    machine: Machine;
    @Column({
        type: "varchar",
        length: 20,
        enum: PaymentType,
        default: PaymentType.PrePayment,
    })
    paymentType: PaymentType;
}
