import Employee from "../models/Employee";
import { AppDataSource } from "../models/db";
import { BrowserWindow } from "electron";
import Account, { Role } from "../models/Account";
class EmployeeService {
    async getEmployeeList() {
        const employees = await AppDataSource.getRepository(Employee).find();
        return employees;
    }
    async getEmployeeById(id: number) {
        const employee = await AppDataSource.getRepository(Employee).findOne({
            where: {
                id,
            },
        });
        return employee;
    }
    async getEmployeeByAccountId(accountId: number) {
        const employee = await AppDataSource.getRepository(Employee).findOne({
            where: {
                accountId,
            },
            relations: ["account"],
        });
        return employee;
    }
    async createEmployee(name: string) {
        const employee = new Employee();
        employee.name = name;
        await AppDataSource.getRepository(Employee).save(employee);
        const account = new Account();
        account.username = "employee" + employee.id;
        account.password = "employee" + employee.id;
        account.role = Role.Employee;
        account.employee = employee;
        await AppDataSource.getRepository(Account).save(account);
        return employee;
    }
    async updateEmployee(employee: Employee) {
        const e = await AppDataSource.getRepository(Employee).find({
            where: {
                id: employee.id,
            },
        });
        if (e) {
            await AppDataSource.getRepository(Employee).save(employee);
            return true;
        }
        return false;
    }
    async deleteEmployee(id: number) {
        const e = await AppDataSource.getRepository(Employee).find({
            where: {
                id,
            },
        });
        if (e) {
            await AppDataSource.getRepository(Employee).delete(id);
            return true;
        }
        return false;
    }
}

export default new EmployeeService();
