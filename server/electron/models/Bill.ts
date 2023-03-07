import {
    Entity,
    Column,
    PrimaryGeneratedColumn,
    CreateDateColumn,
    DeleteDateColumn,
    UpdateDateColumn,
    OneToMany,
    ManyToOne,
    JoinColumn,
} from "typeorm";
import Employee from "./Employee";
import BillDetail from "./BillDetail";
import Account from "./Account";
import Machine from "./Machine";
export enum BillStatus {
    Accepted = "Chấp nhận",
    Pending = "Đang chờ",
    Rejected = "Từ chối",
}
export enum BillType {
    Import = "Hoá đơn nhập",
    Export = "Hoá đơn bán",
}
@Entity()
export default class Bill {
    @PrimaryGeneratedColumn()
    id: number;
    @Column({
        type: "int",
        default: 0,
        unsigned: true,
    })
    total: number;
    @CreateDateColumn()
    createdAt: Date;
    @DeleteDateColumn()
    deletedAt: Date;
    @UpdateDateColumn()
    updatedAt: Date;
    @Column({
        type: "int",
        nullable: false,
    })
    createdBy: number;
    @Column({
        type: "varchar",
        length: 20,
        default: BillStatus.Pending,
        nullable: true,
    })
    status: BillStatus = BillStatus.Pending;
    @Column({
        type: "boolean",
        default: false,
    })
    isPaid: boolean = false;
    @ManyToOne(() => Employee, (employee) => employee.bills)
    @JoinColumn({ name: "createdBy" })
    employee: Employee;
    @OneToMany(() => BillDetail, (billDetail) => billDetail.bill)
    billDetails: BillDetail[];
    @ManyToOne(() => Account, (account) => account.bills)
    account: Account;
    @ManyToOne(() => Machine, (machine) => machine.bills)
    machine: Machine;
    @Column({
        type: "varchar",
        length: 50,
        nullable: false,
        default: BillType.Export,
    })
    type: BillType;
}

export type IBill = {
    [key in keyof Bill]: Bill[key] extends Function ? never : Bill[key];
};
