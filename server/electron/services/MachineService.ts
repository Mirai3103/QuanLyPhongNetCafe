import { AppDataSource } from "../models/db";
import Account from "../models/Account";
import Machine, { MachineType, Status } from "../models/Machine";
import { BrowserWindow } from "electron";

export default class MachineService {
    async getMachineList() {
        const machines = await AppDataSource.getRepository(Machine).find();
        return machines;
    }
    async getMachineById(id: number) {
        const machine = await AppDataSource.getRepository(Machine).findOne({
            where: {
                id,
            },
        });
        return machine;
    }
    async getMachineByCode(id: number) {
        const machine = await AppDataSource.getRepository(Machine).findOne({
            where: {
                id,
            },
        });
        return machine;
    }
    async getMachineByType(type: MachineType) {
        const machines = await AppDataSource.getRepository(Machine).find({
            where: {
                type,
            },
        });
        return machines;
    }
    async getMachineByStatus(status: Status) {
        const machines = await AppDataSource.getRepository(Machine).find({
            where: {
                status,
            },
        });
        return machines;
    }
    async createMachine(name: string, type: MachineType, price: number) {
        const machine = new Machine();
        machine.name = name;
        machine.type = type;
        machine.price = price;
        await AppDataSource.getRepository(Machine).save(machine);
        return machine;
    }
    async updateMachine(machine: Machine) {
        const m = await AppDataSource.getRepository(Machine).find({
            where: {
                id: machine.id,
            },
        });
        if (m) {
            await AppDataSource.getRepository(Machine).save(machine);
            return true;
        }
        return false;
    }
    async deleteMachine(id: number) {
        const machine = await AppDataSource.getRepository(Machine).findOne({
            where: {
                id,
            },
        });
        if (machine) {
            await AppDataSource.getRepository(Machine).remove(machine);
            return true;
        }
        return false;
    }
}
