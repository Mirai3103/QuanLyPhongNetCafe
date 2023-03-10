import {
    Entity,
    Column,
    PrimaryGeneratedColumn,
    CreateDateColumn,
    DeleteDateColumn,
    UpdateDateColumn,
    OneToMany,
    OneToOne,
    BeforeUpdate,
    BeforeInsert,
} from "typeorm";
import MachineUsage from "./MachineUsages";
import Employee from "./Employee";
import Session from "./Session";
import Bill from "./Bill";
export enum Role {
    Admin = "admin",
    Manager = "manager",
    Employee = "employee",
    User = "user",
}
@Entity()
export default class Account {
    // id
    @PrimaryGeneratedColumn()
    id: number;
    @Column({
        type: "varchar",
        length: 100,
        unique: true,
    })
    username: string;

    @Column({
        type: "varchar",
        length: 100,
    })
    password: string;

    @Column({
        type: "varchar",
        length: 20,
    })
    role: Role;
    @CreateDateColumn()
    createdAt: Date;
    @DeleteDateColumn()
    deletedAt: Date;
    @UpdateDateColumn()
    updatedAt: Date;
    @OneToMany(() => MachineUsage, (machineRevenue) => machineRevenue.account)
    machineRevenues: MachineUsage[];
    @OneToOne(() => Employee, (employee) => employee.account)
    employee?: Employee;
    @Column({
        type: "float",
        default: 0,
    })
    balance: number;
    @OneToOne(() => Session, (session) => session.account)
    session?: Session;
    @OneToMany(() => Bill, (bill) => bill.account)
    bills: Bill[];
    @BeforeUpdate()
    @BeforeInsert()
    checkBalance() {
        if (this.balance < 0) {
            this.balance = 0;
        }
    }
}

export type IAccount = {
    [key in keyof Account]: Account[key] extends Function ? never : Account[key];
};
