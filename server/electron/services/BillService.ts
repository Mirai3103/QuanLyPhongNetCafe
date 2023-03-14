import { AppDataSource } from "../models/db";
import Employee from "../models/Employee";
import Bill, { BillStatus, BillType, IBill } from "../models/Bill";
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
            order: {
                createdAt: "DESC",
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
                billDetails: false,
            },
        });
        let billDetails = await AppDataSource.getRepository(BillDetail).find({
            where: {
                billId: id,
            },
            select: {
                billId: true,
                price: true,
                productId: true,
                quantity: true,
            },
        });
        billDetails = await Promise.all(
            billDetails.map(async (billDetail) => {
                const product = await AppDataSource.getRepository(Product).findOne({
                    where: {
                        id: billDetail.productId,
                    },
                    select: {
                        id: true,
                        name: true,
                        price: true,
                    },
                });
                billDetail.product = product;
                return billDetail;
            })
        );

        bill.billDetails = billDetails;

        return bill;
    }
    public async createBill(bill: IBill, billDetails: IBillDetail[]) {
        let newBill = new Bill();
        newBill.total = bill.total;
        newBill.status = bill.status;
        newBill.isPaid = bill.isPaid;
        newBill.accountId = bill.accountId;
        newBill.machineId = bill.machineId;
        newBill.createdAt = new Date();
        newBill.createdBy = bill.createdBy;
        newBill.total = bill.total;

        newBill = await AppDataSource.getRepository(Bill).save(newBill);
        for await (const billDetail of billDetails) {
            const newBillDetail = new BillDetail();
            newBillDetail.billId = newBill.id;
            newBillDetail.productId = billDetail.productId;
            newBillDetail.quantity = billDetail.quantity;
            newBillDetail.price = billDetail.price;
            await AppDataSource.getRepository(BillDetail).save(newBillDetail);
        }
        return true;
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
            total:
                bills.filter((bill) => bill.type == BillType.Export).reduce((total, bill) => total + bill.total, 0) -
                bills.filter((bill) => bill.type == BillType.Import).reduce((total, bill) => total + bill.total, 0),
        };
        const exportBill = {
            length: bills.filter((bill) => bill.type == BillType.Export).length,
            total: bills.filter((bill) => bill.type == BillType.Export).reduce((total, bill) => total + bill.total, 0),
        };
        const importBill = {
            length: bills.filter((bill) => bill.type == BillType.Import).length,
            total: bills.filter((bill) => bill.type == BillType.Import).reduce((total, bill) => total + bill.total, 0),
        };
        const pending = {
            length: bills.filter((bill) => bill.status == BillStatus.Pending).length,
            total: bills
                .filter((bill) => bill.status == BillStatus.Pending)
                .reduce((total, bill) => total + bill.total, 0),
        };
        return {
            total,
            exportBill,
            importBill,
            pending,
        };
    }
}

export default new BillService();
