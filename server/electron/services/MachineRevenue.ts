import { AppDataSource } from "../models/db";
import Account, { Role } from "../models/Account";
import Machine, { MachineType, Status } from "../models/Machine";
import MachineRevenue, { PaymentType } from "../models/MachineRevenue";
import { BrowserWindow, ipcMain } from "electron";

export default class MachineService {
    async getMachineRevenueList() {
        const machineRevenues = await AppDataSource.getRepository(MachineRevenue).find({
            relations: ["machine", "account"],
        });
        return machineRevenues;
    }
    async getMachineRevenueById(id: number) {
        const machineRevenue = await AppDataSource.getRepository(MachineRevenue).findOne({
            where: {
                id,
            },
            relations: ["machine", "account"],
        });
        return machineRevenue;
    }
    async startSession(
        machineId: number,
        accountId: number | null,
        paymentType: PaymentType | null,
        initialBalance: number | null
    ) {
        const machineRevenue = new MachineRevenue();
        const machine = await AppDataSource.getRepository(Machine).findOne({
            where: {
                id: machineId,
            },
        });
        if (!machine) {
            return {
                status: false,
                message: "Máy không tồn tại",
            };
        }
        machineRevenue.machine = machine;

        if (accountId) {
            const account = await AppDataSource.getRepository(Account).findOne({
                where: {
                    id: accountId,
                },
            });

            if (account) {
                if (account.role === Role.Employee || account.role === Role.Admin || account.role === Role.Manager) {
                    machineRevenue.isEmployeeUsing = true;
                    machineRevenue.startAt = new Date();
                    machineRevenue.endAt = null;
                    await AppDataSource.getRepository(MachineRevenue).save(machineRevenue);
                    return {
                        status: true,
                        message: "",
                        machineRevenue,
                    };
                }
                if (account.balance <= 0) {
                    return {
                        status: false,
                        message: "Tài khoản không đủ tiền",
                    };
                }

                machineRevenue.account = account;
            } else {
                return {
                    status: false,
                    message: "Tài khoản không tồn tại",
                };
            }

            machineRevenue.startAt = new Date();
            const totalTime = account.balance / machine.price; // per hour
            const totalSeconds = totalTime * 60 * 60;
            machineRevenue.endAt = new Date(new Date().getTime() + totalSeconds * 1000);
            // save to db
            await AppDataSource.getRepository(MachineRevenue).save(machineRevenue);
            return {
                status: true,
                message: "",
                machineRevenue,
            };
        }
        if (!paymentType) {
            return {
                status: false,
                message: "Chưa chọn loại thanh toán",
            };
        }
        machineRevenue.paymentType = paymentType;
        if (paymentType === PaymentType.PrePayment) {
            if (!initialBalance) {
                return {
                    status: false,
                    message: "Chưa nhập số tiền cọc",
                };
            }
            const totalTime = initialBalance / machine.price; // per hour
            const totalSeconds = totalTime * 60 * 60;
            machineRevenue.endAt = new Date(new Date().getTime() + totalSeconds * 1000);
            await AppDataSource.getRepository(MachineRevenue).save(machineRevenue);
            return {
                status: true,
                message: "",
                machineRevenue,
            };
        } else {
            machineRevenue.startAt = new Date();
            machineRevenue.endAt = null;
            // save to db
            await AppDataSource.getRepository(MachineRevenue).save(machineRevenue);
            return {
                status: true,
                message: "",
                machineRevenue,
            };
        }
    }
    async endSession(machineRevenueId: number) {
        const machineRevenue = await AppDataSource.getRepository(MachineRevenue).findOne({
            where: {
                id: machineRevenueId,
            },
            relations: ["machine", "account"],
        });
        if (!machineRevenue) {
            return {
                status: false,
                message: "Phiên không tồn tại",
            };
        }
        if (machineRevenue.endAt) {
            return {
                status: false,
                message: "Phiên đã kết thúc",
            };
        }
        machineRevenue.endAt = new Date();
        await AppDataSource.getRepository(MachineRevenue).save(machineRevenue);
        if (machineRevenue.paymentType === PaymentType.PostPayment) {
            const time = machineRevenue.endAt.getTime() - machineRevenue.startAt.getTime();
            const totalTime = time / 1000 / 60 / 60;
            const totalMoney = machineRevenue.machine.price * totalTime;
            return {
                status: true,
                message: "",
                machineRevenue,
                totalMoney,
            };
        }
        return {
            status: true,
            message: "",
            machineRevenue,
        };
    }
    async recharge(machineRevenueId: number, money: number) {
        const machineRevenue = await AppDataSource.getRepository(MachineRevenue).findOne({
            where: {
                id: machineRevenueId,
            },
            relations: ["machine"],
        });
        if (!machineRevenue) {
            return {
                status: false,
                message: "Phiên không tồn tại",
            };
        }
        if (machineRevenue.endAt) {
            return {
                status: false,
                message: "Phiên đã kết thúc",
            };
        }
        if (machineRevenue.paymentType !== PaymentType.PostPayment) {
            return {
                status: false,
                message: "Phiên không phải thanh toán sau",
            };
        }
        const time = (money / machineRevenue.machine.price) * 60 * 60 * 1000;
        machineRevenue.endAt = new Date(new Date().getTime() + time);
        await AppDataSource.getRepository(MachineRevenue).save(machineRevenue);
        return {
            status: true,
            message: "",
            machineRevenue,
        };
    }
}
