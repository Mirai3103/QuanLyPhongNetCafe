import {
    Entity,
    Column,
    PrimaryGeneratedColumn,
    CreateDateColumn,
    DeleteDateColumn,
    UpdateDateColumn,
    ManyToOne,
    BeforeInsert,
    BeforeUpdate,
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
export default class MachineUsages {
    @PrimaryGeneratedColumn()
    id: number;
    @Column({
        type: "boolean",
        default: false,
    })
    isEmployeeUsing: boolean;
    @Column({
        type: "int",
        nullable: true,
    })
    usedByAccountId?: number;
    @Column({
        type: "int",
        nullable: false,
    })
    machineId: number;

    @Column({
        type: "int",
        default: 0,
        unsigned: true,
    })
    total: number;
    @CreateDateColumn()
    startAt: Date;
    @UpdateDateColumn()
    updatedAt: Date;
    @DeleteDateColumn()
    deletedAt: Date;
    @Column({
        type: "timestamp",
        nullable: true,
    })
    endAt?: Date | null;
    @ManyToOne(() => Account, (account) => account.machineRevenues)
    @JoinColumn({ name: "usedByAccountId" })
    account?: Account;
    @ManyToOne(() => Machine, (machine) => machine.machineRevenues)
    @JoinColumn({ name: "machineId" })
    machine: Machine;
    @Column({
        type: "varchar",
        length: 20,
        default: PaymentType.PrePayment,
    })
    paymentType: PaymentType;
    @BeforeInsert()
    @BeforeUpdate()
    calculateTotal() {
        if (this.endAt) {
            const hours = (this.endAt.getTime() - this.startAt.getTime()) / 1000 / 60 / 60;
            this.total = hours * this.machine.price;
        }
    }
}
