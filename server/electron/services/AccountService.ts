import { AppDataSource } from "../models/db";
import Account from "../models/Account";
import { BrowserWindow } from "electron";
class AccountService {
    async login(username: string, password: string) {
        const account = await AppDataSource.getRepository(Account).findOne({
            where: {
                username,
                password,
            },
            relations: ["employee"],
        });
        return account;
    }
    async register(username: string, password: string, initialBalance?: number) {
        const account = new Account();
        account.username = username;
        account.password = password;
        account.balance = initialBalance || 0;
        await AppDataSource.getRepository(Account).save(account);
        return account;
    }
    async recharge(username: string, amount: number) {
        const account = await AppDataSource.getRepository(Account).findOne({
            where: {
                username,
            },
        });
        if (account) {
            account.balance += amount;
            await AppDataSource.getRepository(Account).save(account);
            return true;
        }
        return false;
    }
    async deduction(username: string, amount: number) {
        const account = await AppDataSource.getRepository(Account).findOne({
            where: {
                username,
            },
        });
        if (account) {
            account.balance -= amount;
            await AppDataSource.getRepository(Account).save(account);
            return true;
        }
        return false;
    }
    async getAccountInfo(username: string) {
        const account = await AppDataSource.getRepository(Account).findOne({
            where: {
                username,
            },
            relations: ["employee"],
        });
        return account;
    }
    async resetPassword(username: string, newPassword: string) {
        const account = await AppDataSource.getRepository(Account).findOne({
            where: {
                username,
            },
        });
        if (account) {
            account.password = newPassword;
            await AppDataSource.getRepository(Account).save(account);
            return true;
        }
        return false;
    }
    async getAllAccounts() {
        const accounts = await AppDataSource.getRepository(Account).find({
            relations: ["employee"],
        });
        return accounts;
    }
    public async minusBalance(username: string, amount: number) {
        const account = await AppDataSource.getRepository(Account).findOne({
            where: {
                username,
            },
        });
        if (account) {
            account.balance -= amount;
            await AppDataSource.getRepository(Account).save(account);
            return true;
        }
        return false;
    }
}

export default new AccountService();
