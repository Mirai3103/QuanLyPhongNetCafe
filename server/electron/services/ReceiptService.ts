import { AppDataSource } from "../models/db";
import Employee from "../models/Employee";
import Receipt from "../models/Receipt";
import ReceiptDetail, { IReceiptDetail } from "../models/ReceiptDetail";
class ReceiptService {
    async getAllReceipt() {
        const receipts = await AppDataSource.getRepository(Receipt).find({
            where: {
                deletedAt: null,
            },
            relations: ["Employee"],
        });
        return receipts;
    }
    async getReceiptById(id: number) {
        const receipt = await AppDataSource.getRepository(Receipt).findOne({
            where: {
                id,
                deletedAt: null,
            },
            relations: {
                employee: true,
                receiptDetails: {
                    product: true,
                },
            },
        });
        return receipt;
    }
    async createReceipt(employeeId: number, receiptDetails: IReceiptDetail[]) {
        const receipt = new Receipt();
        const employee = await AppDataSource.getRepository(Employee).findOne({
            where: {
                id: employeeId,
                deletedAt: null,
            },
        });
        if (!employee) {
            global.win.webContents.send("error", "Không tìm thấy nhân viên");
            return;
        }
        receipt.employee = employee;
        const result = await AppDataSource.getRepository(Receipt).save(receipt);
        const receiptDetailsToSave = receiptDetails.map((receiptDetail) => {
            return {
                receiptId: result.id,
                productId: receiptDetail.productId,
                quantity: receiptDetail.quantity,
                price: receiptDetail.price,
            };
        });
        await AppDataSource.getRepository(ReceiptDetail).save(receiptDetailsToSave);
        const sum = receiptDetails.reduce((acc, cur) => {
            return acc + cur.quantity * cur.price;
        }, 0);
        result.total = sum;
        await AppDataSource.getRepository(Receipt).save(result);
        return result;
    }
    async deleteReceipt(id: number) {
        const receipt = await AppDataSource.getRepository(Receipt).findOne({
            where: {
                id,
                deletedAt: null,
            },
        });
        if (!receipt) {
            return false;
        }
        receipt.deletedAt = new Date();
        const result = await AppDataSource.getRepository(Receipt).save(receipt);
        return result;
    }
    async deleteReceiptDetail(receiptId: number, productId: number) {
        const receiptDetail = await AppDataSource.getRepository(ReceiptDetail).findOne({
            where: {
                productId,
                receiptId,
                deletedAt: null,
            },
        });
        if (!receiptDetail) {
            return false;
        }
        receiptDetail.deletedAt = new Date();
        const result = await AppDataSource.getRepository(ReceiptDetail).save(receiptDetail);
        return result;
    }
    async updateReceiptDetail(receiptDetail: ReceiptDetail) {
        const result = await AppDataSource.getRepository(ReceiptDetail).save(receiptDetail);
        return result;
    }
    async createReceiptDetail(receiptDetail: ReceiptDetail) {
        const result = await AppDataSource.getRepository(ReceiptDetail).save(receiptDetail);
        return result;
    }
    async updateReceipt(receipt: Receipt, newDetails: IReceiptDetail[]) {
        const sum = receipt.receiptDetails.reduce((acc, cur) => {
            return acc + cur.quantity * cur.price;
        }, 0);
        newDetails.forEach(async (newDetail) => {
            const newDetailToSave = new ReceiptDetail();
            newDetailToSave.receiptId = receipt.id;
            newDetailToSave.productId = newDetail.productId;
            newDetailToSave.quantity = newDetail.quantity;
            newDetailToSave.price = newDetail.price;
            await this.createReceiptDetail(newDetailToSave);
        });
        const plusSum = newDetails.reduce((acc, cur) => {
            return acc + cur.quantity * cur.price;
        }, 0);
        receipt.total = sum + plusSum;
        await AppDataSource.getRepository(Receipt).save(receipt);
    }
}

export default new ReceiptService();
