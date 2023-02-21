import LoginPage from "@/pages/Login";
import React from "react";
import { Outlet } from "react-router";
import { createBrowserRouter } from "react-router-dom";

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
                path: "/about",
                element: <div>about</div>,
            },
        ],
    },
]);

export default routes;
