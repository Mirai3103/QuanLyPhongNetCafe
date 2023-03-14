import { BrowserWindow, ipcMain } from "electron";
import productService from "../services/ProductService";

export enum ProductEvents {
    CREATE_PRODUCT = "product:create",
    UPDATE_PRODUCT = "product:update",
    DELETE_PRODUCT = "product:delete",
    GET_ALL_PRODUCT = "product:getAll",
    GET_PRODUCT_BY_ID = "product:getById",
    GET_ALL_PRODUCT_TYPE = "product:getAllType",
    GET_ALL_FOR_SELECT = "product:getAllForSelect",
}

class ProductController {
    public init() {
        ipcMain.handle(ProductEvents.CREATE_PRODUCT, this.createNew);
        ipcMain.handle(ProductEvents.UPDATE_PRODUCT, this.update);
        ipcMain.handle(ProductEvents.DELETE_PRODUCT, this.delete);
        ipcMain.handle(ProductEvents.GET_ALL_PRODUCT, this.getAll);
        ipcMain.handle(ProductEvents.GET_PRODUCT_BY_ID, this.getById);
        ipcMain.handle(ProductEvents.GET_ALL_PRODUCT_TYPE, this.getAllType);
        ipcMain.handle(ProductEvents.GET_ALL_FOR_SELECT, this.getAllForSelect);
    }
    async getAll(event: Electron.IpcMainInvokeEvent, arg: any) {
        const win: BrowserWindow = global.win;
        const products = await productService.getAllProduct();
        if (!products) {
            win.webContents.send("error", "Không có dữ liệu");
            return null;
        }
        return products;
    }
    async getById(event: Electron.IpcMainInvokeEvent, arg: any) {
        const win: BrowserWindow = global.win;
        const product = await productService.getProductById(arg.id);
        if (!product) {
            win.webContents.send("error", "Không có dữ liệu");
            return null;
        }
        return product;
    }
    async createNew(event: Electron.IpcMainInvokeEvent, arg: any) {
        const win: BrowserWindow = global.win;
        const product = await productService.createProduct(
            arg.name,
            arg.price,
            arg.type,
            arg.description,
            arg.imageBase64,
            arg.initialStock
        );
        if (!product) {
            win.webContents.send("error", "Lỗi khi tạo sản phẩm");
            return null;
        }
        win.webContents.send("success", "Tạo sản phẩm thành công");
        return product;
    }
    async update(event: Electron.IpcMainInvokeEvent, arg: any) {
        const win: BrowserWindow = global.win;
        const product = await productService.updateProduct(arg);
        if (!product) {
            win.webContents.send("error", "Không có dữ liệu");
            return null;
        }
        win.webContents.send("success", "Cập nhật sản phẩm thành công");
        return product;
    }
    async delete(event: Electron.IpcMainInvokeEvent, arg: any) {
        const win: BrowserWindow = global.win;
        const product = await productService.deleteProduct(arg.id);
        if (!product) {
            win.webContents.send("error", "Không có dữ liệu");
            return null;
        }
        win.webContents.send("success", "Xóa sản phẩm thành công");
        return product;
    }
    async getAllType(event: Electron.IpcMainInvokeEvent, arg: any) {
        const win: BrowserWindow = global.win;
        const productTypes = await productService.getProductCategories();
        if (!productTypes) {
            win.webContents.send("error", "Không có dữ liệu");
            return null;
        }
        return productTypes;
    }
    async getAllForSelect(event: Electron.IpcMainInvokeEvent, arg: any) {
        const win: BrowserWindow = global.win;
        const products = await productService.getAllForSelect();
        if (!products) {
            win.webContents.send("error", "Không có dữ liệu");
            return null;
        }
        return products;
    }
}

export default new ProductController();
