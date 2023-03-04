import { AppDataSource } from "../models/db";
import Account, { Role } from "../models/Account";
import { BrowserWindow } from "electron";
class AccountService {
    async deleteAccount(id: number) {
        const account = await AppDataSource.getRepository(Account).findOne({
            where: {
                id,
            },
        });
        if (account) {
            account.deletedAt = new Date();
            await AppDataSource.getRepository(Account).save(account);
            return true;
        }
        return false;
    }
    getAccountByUsername(username: string) {
        return AppDataSource.getRepository(Account).findOne({
            where: {
                username,
                deletedAt: null,
            },
        });
    }
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
    async register(username: string, password: string, role?: Role, initialBalance?: number) {
        const account = new Account();
        account.username = username;
        account.password = password;
        account.balance = initialBalance || 0;
        account.role = role || Role.User;
        const existedAccount = await this.getAccountByUsername(username);
        if (existedAccount) {
            return null;
        }
        await AppDataSource.getRepository(Account).save(account);
        return account;
    }
    async updateAccount(account: Account) {
        const existedAccount = await this.getAccountByUsername(account.username);
        if (existedAccount && existedAccount.id !== account.id) {
            return false;
        }
        await AppDataSource.getRepository(Account).save(account);
        return true;
    }
    async recharge(id: number, amount: number) {
        const account = await AppDataSource.getRepository(Account).findOne({
            where: {
                id,
            },
        });
        if (account) {
            account.balance += amount;
            await AppDataSource.getRepository(Account).save(account);
            return true;
        }
        return false;
    }
    async deduction(id: number, amount: number) {
        const account = await AppDataSource.getRepository(Account).findOne({
            where: {
                id,
            },
        });
        if (account) {
            account.balance -= amount;
            await AppDataSource.getRepository(Account).save(account);
            return true;
        }
        return false;
    }
    async getAccountInfo(id: number) {
        const account = await AppDataSource.getRepository(Account).findOne({
            where: {
                id,
                deletedAt: null,
            },
            relations: ["employee"],
        });
        return account;
    }
    async resetPassword(id: number, newPassword: string) {
        const account = await AppDataSource.getRepository(Account).findOne({
            where: {
                id,
                deletedAt: null,
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
            where: {
                deletedAt: null,
            },
            relations: ["employee"],
        });
        return accounts;
    }
    public async minusBalance(id: number, amount: number) {
        const account = await AppDataSource.getRepository(Account).findOne({
            where: {
                id,
                deletedAt: null,
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
