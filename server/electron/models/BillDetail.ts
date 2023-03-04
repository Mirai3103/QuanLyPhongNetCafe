import {
    Entity,
    Column,
    PrimaryGeneratedColumn,
    CreateDateColumn,
    DeleteDateColumn,
    UpdateDateColumn,
    OneToMany,
    PrimaryColumn,
    JoinColumn,
} from "typeorm";

import Bill from "./Bill";
import Product from "./Product";

@Entity()
export default class BillDetail {
    @PrimaryColumn({
        type: "int",
        nullable: false,
    })
    billId: number;
    @PrimaryColumn({
        type: "int",
        nullable: false,
    })
    productId: number;
    @Column({
        type: "int",
        default: 0,
        unsigned: true,
    })
    quantity: number;
    @CreateDateColumn()
    createdAt: Date;
    @DeleteDateColumn()
    deletedAt: Date;
    @UpdateDateColumn()
    updatedAt: Date;
    @OneToMany(() => Bill, (bill) => bill.billDetails)
    @JoinColumn({ name: "billId" })
    bill: Bill;
    @OneToMany(() => Product, (product) => product.receiptDetails)
    @JoinColumn({ name: "productId" })
    product: Product;
}
