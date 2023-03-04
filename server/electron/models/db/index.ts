import { DataSource } from "typeorm";
import Account, { Role } from "../Account";
import Employee from "../Employee";
import Machine, { MachineType, Status } from "../Machine";
import MachineRevenue from "../MachineRevenue";
import Product from "../Product";
import Receipt from "../Receipt";
import ReceiptDetail from "../ReceiptDetail";
import Session from "../Session";
import fs from "fs";
import migrate from "./migration";
import Bill from "../Bill";
import BillDetail from "../BillDetail";
export const AppDataSource = new DataSource({
    type: "sqlite",
    database: "E:\\DoAnKi2Nam2\\server\\test.db",
    synchronize: true,
    logging: false,
    entities: [Account, Employee, Machine, MachineRevenue, Product, Receipt, ReceiptDetail, Session, Bill, BillDetail],
    // remove
});

export const initDatabase = async () => {
    await AppDataSource.initialize();
    await migrate();
};

export const getDataSource = () => AppDataSource;
