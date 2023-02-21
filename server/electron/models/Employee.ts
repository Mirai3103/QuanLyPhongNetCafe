import {
    Entity,
    Column,
    PrimaryGeneratedColumn,
    CreateDateColumn,
    DeleteDateColumn,
    UpdateDateColumn,
    OneToMany,
    OneToOne,
    JoinColumn,
    AfterInsert,
    BeforeInsert,
} from "typeorm";
import Account, { Role } from "./Account";
import Receipt from "./Receipt";
import { DataSource } from "typeorm";

@Entity()
export default class Employee {
    @PrimaryGeneratedColumn()
    id: number;
    @Column({
        type: "nvarchar",
        length: 100,
    })
    name: string;
    @Column({
        type: "text",
    })
    @Column({
        type: "int",
        nullable: true,
    })
    accountId?: number | null;
    otherInfomation: string; //toDo: add more columns
    @CreateDateColumn()
    createdAt: Date;
    @DeleteDateColumn()
    deletedAt: Date;
    @UpdateDateColumn()
    updatedAt: Date;
    @OneToOne(() => Account, (account) => account.employee)
    @JoinColumn({ name: "accountId" })
    account: Account;
    @OneToMany(() => Receipt, (receipt) => receipt.employee)
    receipts: Receipt[];
}

export type IEmployee = Employee;
