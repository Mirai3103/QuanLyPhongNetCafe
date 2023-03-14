import React from "react";
import { IBillDetail } from "../../../../server/electron/models/BillDetail";
import { IProduct } from "../../../../server/electron/models/Product";

interface ProductContextProps {
    cartItems: IBillDetail[];
    products: IProduct[] | null;
    addToCart: (product: IProduct, quantity: number) => void;
    removeFromCart: (productId: number) => void;
    setProducts: (products: IProduct[] | null) => void;
    clearCart: () => void;
}

const initialState = {
    cartItems: [],
    products: null,
    addToCart: () => {},
    removeFromCart: () => {},
    setProducts: () => {},
    clearCart: () => {},
};

export const ProductContext = React.createContext<ProductContextProps>(initialState);
export default function ProductProvider({ children }: { children: React.ReactNode }) {
    const [cartItems, setCartItems] = React.useState<IBillDetail[]>([]);
    const [products, setProducts] = React.useState<IProduct[] | null>(null);
    const addToCart = (product: IProduct, quantity: number) => {
        const exist = cartItems.find((x) => x.productId === product.id);
        if (exist) {
            setCartItems(
                cartItems.map((x) =>
                    x.productId === product.id ? { ...exist, quantity: exist.quantity + quantity } : x
                )
            );
        } else {
            setCartItems([{ productId: product.id, quantity, billId: 0 }, ...cartItems]);
        }
    };
    const removeFromCart = (productId: number) => {
        setCartItems(cartItems.filter((x) => x.productId !== productId));
    };
    const clearCart = () => {
        setCartItems([]);
    };

    return (
        <ProductContext.Provider
            value={{
                cartItems,
                products,
                addToCart,
                removeFromCart,
                setProducts,
                clearCart,
            }}
        >
            {children}
        </ProductContext.Provider>
    );
}
