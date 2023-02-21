import React from "react";
import { Outlet } from "react-router";
import { createBrowserRouter } from "react-router-dom";

const routes = createBrowserRouter([
    {
        element: (
            <div>
                <div>main</div>
                <Outlet />
            </div>
        ),
        errorElement: <div>404</div>,
        children: [
            {
                path: "/",
                element: <div>home</div>,
            },
            {
                path: "/about",
                element: <div>about</div>,
            },
        ],
    },
]);

export default routes;
