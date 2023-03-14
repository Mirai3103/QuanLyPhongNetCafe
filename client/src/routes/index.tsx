import LoginPage from "@/pages/Login";
import React from "react";
import { Outlet } from "react-router";
import { createBrowserRouter } from "react-router-dom";
import Main from "@/pages/main";
import ProductPage from "@/pages/Product";
import ProductWindow from "@/pages/Product/ProductWindow";
import CartPage from "@/pages/Product/Cart";

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
            {
                path: "/test",
                element: <ProductWindow />,
                children: [
                    {
                        path: "",
                        element: <ProductPage />,
                    },
                    {
                        path: "cart",
                        element: <CartPage />,
                    },
                ],
            },
        ],
    },
]);

export default routes;
