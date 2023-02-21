import LoginPage from "@/pages/Login";
import React from "react";
import { Outlet } from "react-router";
import { createBrowserRouter } from "react-router-dom";
import MainLayout from "@/components/layout";
import Main from "../pages/main/index";
import AccountManager from "../pages/main/AccountManager/index";

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
                ],
            },
        ],
    },
]);

export default routes;
