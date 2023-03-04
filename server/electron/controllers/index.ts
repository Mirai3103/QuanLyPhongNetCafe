import { BrowserWindow } from "electron";
import accountController from "./AccountController";
import machineController from "./MachineController";
import ProductController from "./ProductController";
import ReceiptController from "./ReceiptController";
accountController.init();
machineController.init();
ProductController.init();
ReceiptController.init();
export {};
