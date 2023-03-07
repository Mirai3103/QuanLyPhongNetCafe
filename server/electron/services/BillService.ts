import { AppDataSource } from "../models/db";
import Employee from "../models/Employee";
import Bill, { BillStatus, IBill } from "../models/Bill";
import BillDetail, { IBillDetail } from "../models/BillDetail";
import Product from "../models/Product";
class BillService {
    public async getAllBill() {
        const bills = await AppDataSource.getRepository(Bill).find({
            relations: {
                account: true,
                machine: true,
                employee: true,
            },
        });
        return bills;
    }
    public async getBillById(id: number) {
        const bill = await AppDataSource.getRepository(Bill).findOne({
            where: {
                id,
            },
            relations: {
                account: true,
                machine: true,
                employee: true,
            },
        });
        const billDetails = await AppDataSource.getRepository(BillDetail).find({
            where: {
                billId: id,
            },
            relations: {
                product: true,
            },
        });
        bill.billDetails = billDetails;
        return bill;
    }
    public async createBill(bill: IBill, billDetails: IBillDetail[]) {
        let newBill = new Bill();
        newBill.total = bill.total;
        newBill.status = bill.status;
        newBill.isPaid = bill.isPaid;
        newBill.account = bill.account;
        newBill.machine = bill.machine;
        newBill.createdAt = new Date();
        newBill.createdBy = bill.createdBy;
        newBill = await AppDataSource.getRepository(Bill).save(newBill);
        let total = 0;
        for await (const billDetail of billDetails) {
            billDetail.billId = newBill.id;
            const product = await AppDataSource.getRepository(Product).findOne({
                where: {
                    id: billDetail.productId,
                },
                select: {
                    price: true,
                    stock: true,
                    id: true,
                },
            });
            total += product.price * billDetail.quantity;
            await AppDataSource.getRepository(BillDetail).save(billDetail);
        }
        newBill.total = total;
        newBill = await AppDataSource.getRepository(Bill).save(newBill);
        return newBill;
    }
    public async deleteBill(id: number) {
        const bill = await AppDataSource.getRepository(Bill).findOne({
            where: {
                id,
            },
        });
        if (!bill) {
            return false;
        }
        bill.deletedAt = new Date();
        const result = await AppDataSource.getRepository(Bill).save(bill);
        return result;
    }
    public async getOverallBill() {
        const bills = await AppDataSource.getRepository(Bill).find({
            where: {
                deletedAt: null,
            },
        });
        const total = {
            length: bills.length,
            total: bills.reduce((total, bill) => total + bill.total, 0),
        };
        const paid = {
            length: bills.filter((bill) => bill.isPaid).length,
            total: bills.filter((bill) => bill.isPaid).reduce((total, bill) => total + bill.total, 0),
        };
        const unpaid = {
            length: bills.filter((bill) => !bill.isPaid).length,
            total: bills.filter((bill) => !bill.isPaid).reduce((total, bill) => total + bill.total, 0),
        };
        const rejected = {
            length: bills.filter((bill) => bill.status == BillStatus.Rejected).length,
            total: bills
                .filter((bill) => bill.status == BillStatus.Rejected)
                .reduce((total, bill) => total + bill.total, 0),
        };
        const pending = {
            length: bills.filter((bill) => bill.status == BillStatus.Pending).length,
            total: bills
                .filter((bill) => bill.status == BillStatus.Pending)
                .reduce((total, bill) => total + bill.total, 0),
        };
        const accepted = {
            length: bills.filter((bill) => bill.status == BillStatus.Accepted).length,
            total: bills
                .filter((bill) => bill.status == BillStatus.Accepted)
                .reduce((total, bill) => total + bill.total, 0),
        };
        return {
            total,
            paid,
            unpaid,
            rejected,
            pending,
            accepted,
        };
    }
}

export default new BillService();
