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
import MachineUsage from "./MachineUsages";
import Session from "./Session";
import Account from "./Account";
import Bill from "./Bill";
export enum MachineType {
    Vip = "vip",
    Normal = "normal",
}
export enum Status {
    Maintenance = "maintenance",
    Normal = "normal",
    Locked = "locked",
    Off = "off",
    Using = "using",
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
        // default: Status.Normal,
    })
    status: Status;
    @Column({
        type: "int",
        default: 0,
        unsigned: true,
    })
    price: number;
    @Column({
        type: "varchar",
        length: 20,
        // default: MachineType.Normal,
    })
    type: MachineType;
    @CreateDateColumn()
    createdAt: Date;
    @DeleteDateColumn()
    deletedAt: Date;
    @UpdateDateColumn()
    updatedAt: Date;
    @OneToMany(() => MachineUsage, (machineRevenue) => machineRevenue.machine)
    machineRevenues: MachineUsage[];
    @OneToOne(() => Session, (session) => session.machine)
    session: Session;
    @OneToMany(() => Bill, (bill) => bill.machine)
    bills: Bill[];
}
export type IMachine = {
    [key in keyof Machine]: Machine[key] extends Function ? never : Machine[key];
} & {
    account?: Account;
};
