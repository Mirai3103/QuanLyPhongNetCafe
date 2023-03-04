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

export enum Type {
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
        type: "text",
        nullable: true,
    })
    imageBase64: string;
    @Column({
        type: "varchar",
        length: 500,
    })
    description: string;
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

//only fields
export type IProduct = {
    [key in keyof Product]: Product[key] extends Function ? never : Product[key];
};
