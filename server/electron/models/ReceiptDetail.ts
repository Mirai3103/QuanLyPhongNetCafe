import {
    Entity,
    Column,
    PrimaryGeneratedColumn,
    CreateDateColumn,
    DeleteDateColumn,
    UpdateDateColumn,
    OneToMany,
    PrimaryColumn,
} from "typeorm";

import Receipt from "./Receipt";
import Product from "./Product";

@Entity()
export default class ReceiptDetail {
    @PrimaryColumn({
        type: "int",
        nullable: false,
    })
    receiptId: number;
    @PrimaryColumn({
        type: "int",
        nullable: false,
    })
    foodId: number;
    @Column({
        type: "int",
        default: 0,
        unsigned: true,
    })
    quantity: number;
    @Column({
        type: "int",
        default: 0,
        unsigned: true,
    })
    price: number;
    @CreateDateColumn()
    createdAt: Date;
    @DeleteDateColumn()
    deletedAt: Date;
    @UpdateDateColumn()
    updatedAt: Date;
    @OneToMany(() => Receipt, (receipt) => receipt.receiptDetails)
    receipt: Receipt;
    @OneToMany(() => Product, (product) => product.receiptDetails)
    product: Product;
}
