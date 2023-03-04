import LoginPage from "@/pages/Login";
import React from "react";
import { Outlet } from "react-router";
import { createBrowserRouter } from "react-router-dom";
import MainLayout from "@/components/layout";
import Main from "../pages/main/index";
import AccountManager from "../pages/main/AccountManager/index";
import MachineManager from "@/pages/main/MachineManager";
import EditAccount from "@/pages/main/AccountManager/Edit";
import CreateAccount from "@/pages/main/AccountManager/Create";
import ProductManager from "@/pages/main/ProductManager";
import CreateProduct from "@/pages/main/ProductManager/Create";
import EditProduct from "@/pages/main/ProductManager/Edit";
import InvoiceManager from "@/pages/main/InvoiceManager";
import InvoiceDetail from "@/pages/main/InvoiceManager/Detail";
import InvoiceEdit from "@/pages/main/InvoiceManager/Edit";

const routes = createBrowserRouter([
    {
        element: (
            <div className="w-screen h-full">
                <Outlet />
            </div>
        ),
        errorElement: <div>404</div>,
        children: [
            {
                path: "/",
                element: <LoginPage />,
            },
            {
                path: "/main",
                element: <MainLayout />,
                children: [
                    {
                        path: "",
                        element: <Main />,
                    },
                    {
                        path: "home",
                        element: <Main />,
                    },
                    {
                        path: "account-manager",
                        element: <AccountManager />,
                    },
                    {
                        path: "machine-manager",
                        element: <MachineManager />,
                    },
                    {
                        path: "account-manager/edit/:id",
                        element: <EditAccount />,
                    },
                    {
                        path: "account-manager/create",
                        element: <CreateAccount />,
                    },
                    {
                        path: "product-manager",
                        element: <ProductManager />,
                    },
                    {
                        path: "product-manager/create",
                        element: <CreateProduct />,
                    },
                    {
                        path: "product-manager/edit/:id",
                        element: <EditProduct />,
                    },
                    {
                        path: "invoice-manager",
                        element: <InvoiceManager />,
                    },
                    {
                        path: "invoice-manager/detail/:id",
                        element: <InvoiceDetail />,
                    },
                    {
                        path: "invoice-manager/edit/:id",
                        element: <InvoiceEdit type="edit" />,
                    },
                    {
                        path: "invoice-manager/create",
                        element: <InvoiceEdit type="create" />,
                    },
                ],
            },
        ],
    },
]);

export default routes;
