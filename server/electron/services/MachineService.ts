import { AppDataSource } from "../models/db";
import Account from "../models/Account";
import Machine, { MachineType, Status } from "../models/Machine";
import { BrowserWindow } from "electron";
import SessionService from "./SessionService";
import { IMachine } from "../models/Machine";

class MachineService {
    async getMachineList() {
        const machines = await AppDataSource.getRepository(Machine).find();
        return machines;
    }
    async getMachineListWithStatus() {
        const listConnectMachineId: number[] = [];
        global.io.of("/").sockets.forEach((socket) => {
            listConnectMachineId.push((socket as any).machineId);
        });
        const listSession = await SessionService.getAllSession();
        const machines = await AppDataSource.getRepository(Machine).find();
        const machineList: IMachine[] = machines.map((machine) => {
            const session = listSession.find((session) => session.machine.id === machine.id);
            if (session) {
                machine.status = Status.Using;
                (machine as any).account = session.account;
            } else if (listConnectMachineId.find((id) => id === machine.id)) {
                machine.status = Status.Locked;
            } else {
                machine.status = Status.Off;
            }
            return {
                ...machine,
            };
        });
        return machineList;
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
export default new MachineService();
