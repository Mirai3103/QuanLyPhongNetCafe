import {
    Entity,
    Column,
    PrimaryGeneratedColumn,
    CreateDateColumn,
    DeleteDateColumn,
    UpdateDateColumn,
    OneToMany,
} from "typeorm";
import ReceiptDetail from "./ReceiptDetail";

enum Type {
    Drink = "Nước uống",
    Food = "Thức ăn",
    Card = "Thẻ",
}

@Entity()
export default class Product {
    @PrimaryGeneratedColumn()
    id: number;
    @Column({
        type: "varchar",
        length: 100,
    })
    name: string;
    @Column({
        type: "int",
        default: 0,
        unsigned: true,
    })
    price: number;
    @Column({
        type: "varchar",
        length: 20,
        default: Type.Food,
    })
    type: Type;
    @Column({
        type: "int",
        default: 0,
        unsigned: true,
    })
    stock: number;
    @CreateDateColumn()
    createdAt: Date;
    @DeleteDateColumn()
    deletedAt: Date;
    @OneToMany(() => ReceiptDetail, (receiptDetail) => receiptDetail.product)
    receiptDetails: ReceiptDetail[];
}
