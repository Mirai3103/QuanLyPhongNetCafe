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
import { DataSource } from "typeorm";
import Bill from "./Bill";

@Entity()
export default class Employee {
    @PrimaryGeneratedColumn()
    id: number;
    @Column({
        type: "varchar",
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
    @OneToMany(() => Bill, (bill) => bill.employee)
    bills: Bill[];
}

export type IEmployee = Employee;
