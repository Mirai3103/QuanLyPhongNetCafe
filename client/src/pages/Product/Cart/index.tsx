import React from "react";
import { ProductContext } from "../CartProvider";

export default function CartPage() {
    const { cartItems } = React.useContext(ProductContext);
    console.log(cartItems);
    return <div>CartPage</div>;
}
