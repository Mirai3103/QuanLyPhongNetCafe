import {
    Entity,
    Column,
    PrimaryGeneratedColumn,
    CreateDateColumn,
    DeleteDateColumn,
    UpdateDateColumn,
    OneToMany,
    ManyToOne,
} from "typeorm";
import Employee from "./Employee";
import BillDetail from "./BillDetail";
import Account from "./Account";
import Machine from "./Machine";
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
    @ManyToOne(() => Employee, (employee) => employee.receipts)
    employee: Employee;
    @OneToMany(() => BillDetail, (billDetail) => billDetail.bill)
    billDetails: BillDetail[];
    @ManyToOne(() => Account, (account) => account.bills)
    account: Account;
    @ManyToOne(() => Machine, (machine) => machine.bills)
    machine: Machine;
}
