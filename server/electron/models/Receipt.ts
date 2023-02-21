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
import ReceiptDetail from "./ReceiptDetail";
@Entity()
export default class Receipt {
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
    @OneToMany(() => ReceiptDetail, (receiptDetail) => receiptDetail.receipt)
    receiptDetails: ReceiptDetail[];
}
