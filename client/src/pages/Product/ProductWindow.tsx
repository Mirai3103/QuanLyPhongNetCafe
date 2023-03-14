import React from "react";
import { Outlet } from "react-router-dom";
import ProductProvider from "./CartProvider";

export default function ProductWindow() {
    return (
        <ProductProvider>
            <Outlet />
        </ProductProvider>
    );
}
