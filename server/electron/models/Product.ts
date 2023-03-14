import {
    Entity,
    Column,
    PrimaryGeneratedColumn,
    CreateDateColumn,
    DeleteDateColumn,
    UpdateDateColumn,
    OneToMany,
} from "typeorm";
import BillDetail from "./BillDetail";

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
        type: "longtext",
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
    })
    stock: number;
    @CreateDateColumn()
    createdAt: Date;
    @DeleteDateColumn()
    deletedAt: Date;
    @OneToMany(() => BillDetail, (billDetail) => billDetail.product)
    billDetails: BillDetail[];
}

//only fields
export type IProduct = {
    [key in keyof Product]: Product[key] extends Function ? never : Product[key];
};

const fakeData: IProduct = {
    id: 1,
    name: "Coca",
    price: 10000,
    type: Type.Drink,
    imageBase64: "https://th.bing.com/th/id/OIP.gOSWD16OMZ6vAMmKT8ltUwHaHa?pid=ImgDet&rs=1",
    description: "Coca",
    stock: 100,
    createdAt: new Date("2022-02-12 00:00:00"),
    deletedAt: null,
    billDetails: null,
};
