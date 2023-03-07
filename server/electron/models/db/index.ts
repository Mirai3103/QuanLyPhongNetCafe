import { DataSource } from "typeorm";
import Account, { Role } from "../Account";
import Employee from "../Employee";
import Machine, { MachineType, Status } from "../Machine";
import MachineUsage from "../MachineUsages";
import Product from "../Product";

import Session from "../Session";
import fs from "fs";
import migrate from "./migration";
import Bill from "../Bill";
import BillDetail from "../BillDetail";
// export const AppDataSource = new DataSource({
//     type: "sqlite",
//     database: "E:\\DoAnKi2Nam2\\server\\test.db",
//     synchronize: true,
//     logging: false,
//     entities: [Account, Employee, Machine, MachineUsage, Product, Receipt, ReceiptDetail, Session, Bill, BillDetail],
//     // remove
// });
export const AppDataSource = new DataSource({
    type: "mysql",
    database: "NetCF",
    host: "localhost",
    username: "root",
    password: "",
    port: 3306,
    synchronize: false,
    dropSchema: false,
    logging: true,
    entities: [Account, Employee, Machine, MachineUsage, Product, , Session, Bill, BillDetail],
});

export const initDatabase = async () => {
    await AppDataSource.initialize();
    await migrate();
};

export const getDataSource = () => AppDataSource;
