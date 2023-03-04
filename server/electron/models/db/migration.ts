import { AppDataSource } from ".";
import Account, { Role } from "../Account";
import Employee from "../Employee";
import Machine, { MachineType, Status } from "../Machine";
import fs from "fs";
import Product, { Type } from "../Product";
import { In } from "typeorm";
import Receipt from "../Receipt";
import ReceiptDetail from "../ReceiptDetail";
async function accountMigration() {
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
    // 5 employee
    for (let i = 0; i < 5; i++) {
        const employee = new Employee();
        employee.name = `Nhân viên ${i + 1}`;
        employee.otherInfomation = `Nhân viên ${i + 1}`;
        await AppDataSource.getRepository(Employee).save(employee);
        const account = new Account();
        account.role = Role.Employee;
        account.username = `employee${i + 1}`;
        account.password = `employee${i + 1}`;
        account.employee = employee;
        await AppDataSource.getRepository(Account).save(account);
    }
}
async function machineMigration() {
    // 20 máy
    for (let i = 0; i < 20; i++) {
        const machine = new Machine();
        machine.name = `Máy ${i + 1}`;
        machine.price = 5000;
        machine.status = Status.Normal;
        machine.type = Math.random() > 0.5 ? MachineType.Vip : MachineType.Normal;
        machine.price = machine.type === MachineType.Vip ? 10000 : 5000;
        await AppDataSource.getRepository(Machine).save(machine);
    }
}
async function fromSqlFileMigration() {
    const path = "E:\\DoAnKi2Nam2\\server\\electron\\models\\db";
    const files = fs.readdirSync(path).flatMap((file) => {
        if (file.includes(".sql")) {
            return [`${path}\\${file}`];
        }
        return [];
    });
    for (const file of files) {
        const rawsql = fs.readFileSync(file, "utf-8");
        await AppDataSource.manager.query(rawsql);
    }
}

interface IRawProduct {
    name: string;
    price: number;
    type: Type;
    image: string;
    description: string;
    stock: number;
    createdAt: Date;
}
async function imageToBase64(path: string) {
    const image = fs.readFileSync(path);
    return Buffer.from(image).toString("base64");
}

async function productMigration() {
    const products: IRawProduct[] = JSON.parse(
        fs.readFileSync("E:\\DoAnKi2Nam2\\server\\electron\\models\\db\\products.json", "utf-8")
    );
    for (const product of products) {
        const newProduct = new Product();
        newProduct.name = product.name;
        newProduct.price = product.price;
        newProduct.type = product.type;
        newProduct.imageBase64 = await imageToBase64(product.image);
        newProduct.description = product.description;
        newProduct.stock = product.stock == -1 ? -1 : 0;
        newProduct.createdAt = product.createdAt;
        await AppDataSource.getRepository(Product).save(newProduct);
    }
}
const randomDate = (start: Date, end: Date) => {
    return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
};

// async function receiptMigrate() {
//     const listProducts = await AppDataSource.getRepository(Product).find();
//     const randomProduct = () => {
//         const index = Math.floor(Math.random() * listProducts.length);
//         return listProducts[index];
//     };
//     const listEmployees = await AppDataSource.getRepository(Employee).find({
//         where: {
//             account: {
//                 role: In([Role.Manager, Role.Employee]),
//             },
//         },
//     });
//     for (let i = 0; i < 10; i++) {
//         const receipt = new Receipt();
//         const numberOfProduct = Math.floor(Math.random() * 5);
//         const products = [];
//         for (let j = 0; j < numberOfProduct; j++) {
//             const product = randomProduct();
//             if (product.stock >= 0) {
//                 products.push(product);
//             }
//         }
//         if (products.length === 0) {
//             continue;
//         }
//         for (const product of products) {
//             const receiptDetail = new ReceiptDetail();
//             receiptDetail.product = product;
//             receiptDetail.quantity = Math.floor(Math.random() * 5);
//             // price lower random than product price
//             receiptDetail.price = product.price - Math.floor(Math.random() * 1000);
//             receiptDetail.
//         }
//     }
// }
export default async function migrate() {
    const adminAccount = await AppDataSource.getRepository(Account).findOne({
        where: {
            role: Role.Admin,
        },
    });
    if (adminAccount) {
        return;
    }
    await accountMigration();
    await machineMigration();
    await fromSqlFileMigration();
    await productMigration();
}
