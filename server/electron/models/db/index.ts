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
export const AppDataSource = new DataSource({
    type: "sqlite",
    database: "E:\\DoAnKi2Nam2\\server\\test.db",
    synchronize: true,
    logging: true,
    entities: [Account, Employee, Machine, MachineRevenue, Product, Receipt, ReceiptDetail, Session],
    // remove
});

export const initDatabase = async () => {
    await AppDataSource.initialize();
    const adminAccount = await AppDataSource.getRepository(Account).findOne({
        where: {
            role: Role.Admin,
        },
    });
    if (adminAccount) {
        return;
    }
    let employeeAdmin = new Employee();
    employeeAdmin.name = "admin";
    employeeAdmin.otherInfomation = "admin";
    await AppDataSource.getRepository(Employee).save(employeeAdmin);
    const adminaccount = new Account();
    adminaccount.role = Role.Admin;
    adminaccount.username = "admin";
    adminaccount.password = "admin";
    adminaccount.employee = employeeAdmin;
    await AppDataSource.getRepository(Account).save(adminaccount);

    const employee = new Employee();
    employee.name = "Nguyễn Văn A";
    employee.otherInfomation = "Chủ cửa hàng";
    await AppDataSource.getRepository(Employee).save(employee);
    const managerAccount = new Account();
    managerAccount.role = Role.Manager;
    managerAccount.username = "manager";
    managerAccount.password = "manager";
    managerAccount.employee = employee;
    await AppDataSource.getRepository(Account).save(managerAccount);

    // 20 máy
    for (let i = 0; i < 20; i++) {
        const machine = new Machine();
        machine.name = `Máy ${i + 1}`;
        machine.price = 5000;
        machine.status = Status.Off;
        machine.type = Math.random() > 0.5 ? MachineType.Vip : MachineType.Normal;
        machine.price = machine.type === MachineType.Vip ? 10000 : 5000;
        await AppDataSource.getRepository(Machine).save(machine);
    }

    const files = fs.readdirSync("./").flatMap((file) => {
        if (file.endsWith(".sql")) {
            return "./" + file;
        }
    });
    for (const file of files) {
        const rawQuery = fs.readFileSync(file, "utf-8");
        await AppDataSource.manager.query(rawQuery);
    }
};

export const getDataSource = () => AppDataSource;
