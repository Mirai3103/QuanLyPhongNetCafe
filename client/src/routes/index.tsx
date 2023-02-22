import LoginPage from "@/pages/Login";
import React from "react";
import { Outlet } from "react-router";
import { createBrowserRouter } from "react-router-dom";
import Main from "@/pages/main";

const routes = createBrowserRouter([
    {
        element: (
            <div className="w-screen h-screen ">
                <Outlet />
            </div>
        ),
        errorElement: <div>404</div>,
        children: [
            {
                path: "/login",
                element: <LoginPage />,
            },
            {
                path: "/main",
                element: <Main />,
            },
        ],
    },
]);

export default routes;
