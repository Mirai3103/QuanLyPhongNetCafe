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
    @Column({
        type: "boolean",
        default: false,
    })
    isEmployeeUsing: boolean;
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
    @BeforeInsert()
    @BeforeUpdate()
    calculateTotal() {
        if (this.endAt) {
            const hours = (this.endAt.getTime() - this.startAt.getTime()) / 1000 / 60 / 60;
            this.total = hours * this.machine.price;
        }
    }
}
