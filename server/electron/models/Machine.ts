import {
    Entity,
    Column,
    PrimaryGeneratedColumn,
    CreateDateColumn,
    DeleteDateColumn,
    UpdateDateColumn,
    OneToMany,
    OneToOne,
} from "typeorm";
import MachineRevenue from "./MachineRevenue";
import Session from "./Session";
export enum MachineType {
    Vip = "vip",
    Normal = "normal",
}
export enum Status {
    Off = "off",
    Active = "active",
    On = "on",
    Maintenance = "maintenance",
}
@Entity({})
export default class Machine {
    @PrimaryGeneratedColumn()
    id: number;
    @Column({
        type: "varchar",
        length: 100,
    })
    name: string;
    @Column({
        type: "varchar",
        length: 20,
        enum: Status,
        default: Status.Off,
    })
    status: Status;
    @Column({
        type: "varchar",
        length: 20,
        enum: MachineType,
        default: MachineType.Normal,
    })
    type: MachineType;
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
    @OneToMany(() => MachineRevenue, (machineRevenue) => machineRevenue.machine)
    machineRevenues: MachineRevenue[];
    @OneToOne(() => Session, (session) => session.machine)
    session: Session;
}
