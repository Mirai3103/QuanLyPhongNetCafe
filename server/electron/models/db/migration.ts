import { AppDataSource } from ".";
import Account, { Role } from "../Account";
import Employee from "../Employee";
import Machine, { MachineType, Status } from "../Machine";
import fs from "fs";
import Product, { Type } from "../Product";
import { In, LessThan, MoreThan, Not } from "typeorm";

import MachineUsages, { PaymentType } from "../MachineUsages";
import Bill, { BillStatus, BillType } from "../Bill";
import BillDetail from "../BillDetail";
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
        const rawsql = fs.readFileSync(file, "utf-8").trim();
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

async function receiptMigrate() {
    const listProducts = await AppDataSource.getRepository(Product).find({
        where: {
            stock: Not(-1),
        },
        select: {
            id: true,
            price: true,
            stock: true,
        },
    });
    const randomProduct = () => {
        const index = Math.floor(Math.random() * listProducts.length);
        return listProducts[index];
    };
    const listEmployees = await AppDataSource.getRepository(Employee).find({
        where: {
            account: {
                role: In([Role.Manager, Role.Employee]),
            },
        },
    });
    for (let i = 0; i < 20; i++) {
        let receipt = new Bill();
        receipt.account = null;
        receipt.machine = null;
        receipt.type = BillType.Import;
        const numberOfProduct = Math.floor(Math.random() * 5);
        const products: Product[] = [];

        for (let j = 0; j < numberOfProduct; j++) {
            const product = randomProduct();
            if (products.filter((p) => p.id === product.id).length != 0) {
                continue;
            }
            products.push(product);
        }

        if (products.length === 0) {
            continue;
        }

        const employee = listEmployees[Math.floor(Math.random() * listEmployees.length)];
        receipt.employee = employee;
        receipt.createdAt = randomDate(new Date(2021, 0, 1), new Date());

        receipt = await AppDataSource.getRepository(Bill).save(receipt);

        for await (const product of products) {
            //nhập hàng
            const receiptDetail = new BillDetail();
            receiptDetail.productId = product.id;
            receiptDetail.quantity = (Math.floor(Math.random() * 100) % 20) + 5;
            // price lower random than product price
            receiptDetail.price = Math.floor((product.price - Math.floor(Math.random() * 1000)) / 1000) * 1000;
            receiptDetail.billId = receipt.id;
            await AppDataSource.getRepository(BillDetail).save(receiptDetail);
            product.stock += receiptDetail.quantity;
            await AppDataSource.getRepository(Product).save(product);
        }
        const listNewReceiptDetail = await AppDataSource.getRepository(BillDetail).find({
            where: {
                billId: receipt.id,
            },
        });
        receipt.total = listNewReceiptDetail.reduce((total, receiptDetail) => {
            return total + receiptDetail.price * receiptDetail.quantity;
        }, 0);

        await AppDataSource.getRepository(Bill).save(receipt);
    }
}
async function MachineUsageUseAccountMigration() {
    const listMachines = await AppDataSource.getRepository(Machine).find();
    const listEmployees = await AppDataSource.getRepository(Employee).find({
        where: {
            account: {
                role: In([Role.Manager, Role.Employee]),
            },
        },
        relations: ["account"],
    });
    const listAccounts = await AppDataSource.getRepository(Account).find({
        where: {
            role: Role.User,
        },
    });
    for (let i = 0; i < 100; i++) {
        const machineUsage = new MachineUsages();
        machineUsage.startAt = randomDate(new Date(2021, 0, 1), new Date());
        const usageInMinutes = randomInt(30, 360);
        machineUsage.endAt = new Date(machineUsage.startAt.getTime() + usageInMinutes * 60 * 1000);
        machineUsage.machine = listMachines[Math.floor(Math.random() * listMachines.length)];
        machineUsage.machineId = machineUsage.machine.id;
        machineUsage.usedByAccountId = listAccounts[Math.floor(Math.random() * listAccounts.length)].id;
        while (!(await checkValidUsageAccount(machineUsage.startAt, machineUsage.endAt, machineUsage.machineId))) {
            machineUsage.startAt = randomDate(new Date(2021, 0, 1), new Date());
            const usageInMinutes = randomInt(30, 360);
            machineUsage.endAt = new Date(machineUsage.startAt.getTime() + usageInMinutes * 60 * 1000);
        }
        while (!(await checkValidUsageMachine(machineUsage.startAt, machineUsage.endAt, machineUsage.machineId))) {
            machineUsage.startAt = randomDate(new Date(2021, 0, 1), new Date());
            const usageInMinutes = randomInt(30, 360);
            machineUsage.endAt = new Date(machineUsage.startAt.getTime() + usageInMinutes * 60 * 1000);
        }
        machineUsage.paymentType = PaymentType.FromBalance;
        machineUsage.calculateTotal();
        await AppDataSource.getRepository(MachineUsages).save(machineUsage);
    }
}
async function MachineUsagePrepaymentMigation() {
    const listMachines = await AppDataSource.getRepository(Machine).find();
    for (let i = 0; i < 100; i++) {
        const machineUsage = new MachineUsages();
        machineUsage.paymentType = PaymentType.PrePayment;
        const money = Math.floor(randomInt(5000, 26000) / 1000) * 1000;
        const machine = listMachines[Math.floor(Math.random() * listMachines.length)];
        machineUsage.total = money;
        machineUsage.startAt = randomDate(new Date(2021, 0, 1), new Date());
        const usageInMiliSeconds = Math.floor((money / machine.price) * 60 * 60 * 1000);
        machineUsage.endAt = new Date(machineUsage.startAt.getTime() + usageInMiliSeconds);
        machineUsage.machine = machine;
        while (!(await checkValidUsageMachine(machineUsage.startAt, machineUsage.endAt, machineUsage.machineId))) {
            machineUsage.startAt = randomDate(new Date(2021, 0, 1), new Date());
            machineUsage.endAt = new Date(machineUsage.startAt.getTime() + usageInMiliSeconds);
        }
        machineUsage.machineId = machineUsage.machine.id;
        machineUsage.usedByAccountId = null;
        await AppDataSource.getRepository(MachineUsages).save(machineUsage);
    }
}

async function MachineUsagePostPaymentMigration() {
    const listMachines = await AppDataSource.getRepository(Machine).find();
    for (let i = 0; i < 100; i++) {
        const machineUsage = new MachineUsages();
        machineUsage.paymentType = PaymentType.PostPayment;
        const money = Math.floor(randomInt(5000, 26000) / 1000) * 1000;
        const machine = listMachines[Math.floor(Math.random() * listMachines.length)];
        machineUsage.total = money;
        machineUsage.startAt = randomDate(new Date(2021, 0, 1), new Date());
        const usageInMiliSeconds = Math.floor((money / machine.price) * 60 * 60 * 1000);
        machineUsage.endAt = new Date(machineUsage.startAt.getTime() + usageInMiliSeconds);
        machineUsage.machine = machine;
        while (!(await checkValidUsageMachine(machineUsage.startAt, machineUsage.endAt, machineUsage.machineId))) {
            machineUsage.startAt = randomDate(new Date(2021, 0, 1), new Date());
            machineUsage.endAt = new Date(machineUsage.startAt.getTime() + usageInMiliSeconds);
        }
        machineUsage.machineId = machineUsage.machine.id;
        machineUsage.usedByAccountId = null;
        await AppDataSource.getRepository(MachineUsages).save(machineUsage);
    }
}

const checkValidUsageMachine = async (startAt: Date, endAt: Date, machineId: number) => {
    const machineUsage = await AppDataSource.getRepository(MachineUsages).findOne({
        where: {
            machineId,
            startAt: LessThan(endAt),
            endAt: MoreThan(startAt),
        },
        select: {
            id: true,
        },
    });
    return machineUsage == null;
};

const checkValidUsageAccount = async (startAt: Date, endAt: Date, accountId: number) => {
    const machineUsage = await AppDataSource.getRepository(MachineUsages).findOne({
        where: {
            usedByAccountId: accountId,
            startAt: LessThan(endAt),
            endAt: MoreThan(startAt),
        },
        select: {
            id: true,
        },
    });
    return machineUsage == null;
};
const randomInt = (min: number, max: number) => {
    return Math.floor(Math.random() * (max - min + 1) + min);
};

const randomBill = async (MachineUsage: MachineUsages) => {
    const listFood = await AppDataSource.getRepository(Product).find({
        where: {
            type: Type.Food,
        },
    });
    const listEmployee = await AppDataSource.getRepository(Employee).find({
        where: {
            account: {
                role: Role.Employee,
            },
        },
    });

    const listDrink = await AppDataSource.getRepository(Product).find({
        where: {
            type: Type.Drink,
        },
    });
    const listCard = await AppDataSource.getRepository(Product).find({
        where: {
            type: Type.Card,
        },
    });
    let bill = new Bill();
    bill.type = BillType.Export;
    bill.isPaid = true;
    bill.account = MachineUsage.account;
    bill.employee = listEmployee[randomInt(0, listEmployee.length - 1)];
    bill.createdAt = randomDate(MachineUsage.startAt, MachineUsage.endAt);
    bill.status = BillStatus.Accepted;
    bill.machine = MachineUsage.machine;
    bill = await AppDataSource.getRepository(Bill).save(bill);

    let count = 0;
    if (randomInt(0, 100) % 2 === 0) {
        const dinkBill = new BillDetail();
        const drink = listDrink[randomInt(0, listDrink.length - 1)];
        dinkBill.productId = drink.id;
        dinkBill.quantity = randomInt(1, 2);
        dinkBill.billId = bill.id;
        await AppDataSource.getRepository(BillDetail).save(dinkBill);
        count++;
        if (randomInt(0, 100) % 3 === 0) {
            const foodBill = new BillDetail();
            const food = listFood[randomInt(0, listFood.length - 1)];
            foodBill.productId = food.id;
            foodBill.quantity = randomInt(1, 2);
            foodBill.billId = bill.id;
            await AppDataSource.getRepository(BillDetail).save(foodBill);
            count++;
        }
    }
    if (randomInt(0, 100) % 4 === 0) {
        const cardBill = new BillDetail();
        const card = listCard[randomInt(0, listCard.length - 1)];
        cardBill.productId = card.id;
        cardBill.quantity = randomInt(1, 2);
        cardBill.billId = bill.id;
        await AppDataSource.getRepository(BillDetail).save(cardBill);
        count++;
    }
    if (count === 0) {
        const dinkBill = new BillDetail();
        const drink = listDrink[randomInt(0, listDrink.length - 1)];
        dinkBill.productId = drink.id;
        dinkBill.quantity = 1;
        dinkBill.billId = bill.id;
        await AppDataSource.getRepository(BillDetail).save(dinkBill);
    }
    return bill;
};
async function fix() {
    const listBillDetail = await AppDataSource.getRepository(BillDetail).find({
        where: {
            price: 0,
        },
    });
    for await (const billDetail of listBillDetail) {
        const product = await AppDataSource.getRepository(Product).findOne({
            where: {
                id: billDetail.productId,
            },
        });
        billDetail.price = product.price;
        await AppDataSource.getRepository(BillDetail).save(billDetail);
    }
}
async function caculateTotalBill() {
    const listBill = await AppDataSource.getRepository(Bill).find({});
    for await (const bill of listBill) {
        const listBillDetail = await AppDataSource.getRepository(BillDetail).find({
            where: {
                billId: bill.id,
            },
        });
        let total = 0;
        for await (const billDetail of listBillDetail) {
            total += billDetail.price * billDetail.quantity;
        }
        bill.total = total;
        await AppDataSource.getRepository(Bill).save(bill);
    }
}

const migrateBill = async () => {
    const listMachineUsage = await AppDataSource.getRepository(MachineUsages).find({
        relations: {
            machine: true,
            account: true,
        },
    });
    for await (const machineUsage of listMachineUsage) {
        const isHasBill = randomInt(0, 100) % 5 === 0;
        if (!isHasBill) {
            continue;
        }
        await randomBill(machineUsage);
    }
};

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
    await receiptMigrate();
    await MachineUsageUseAccountMigration();
    await MachineUsagePrepaymentMigation();
    await MachineUsagePostPaymentMigration();
    await migrateBill();
    await fix();
    await caculateTotalBill();
}
