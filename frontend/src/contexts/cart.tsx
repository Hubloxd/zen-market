import { createContext, useState } from "react";

interface CartItem {
  id: number;
  name: string;
  price: number;
  image_src: string;
}

interface CartContextType {
  cart: CartItem[];
  addItemToCart: (item: CartItem) => void;
  removeItemFromCart: (item: CartItem) => void;
  resetCart: () => void;
}

export const CartContext = createContext<CartContextType>({
  cart: [],
  addItemToCart: () => {},
  removeItemFromCart: () => {},
  resetCart: () => {},
});

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [cart, setCart] = useState<CartItem[]>([]);

  const addItemToCart = (item: CartItem) => {
    if (cart.filter((cartItem) => cartItem.id === item.id).length !== 0) {
      return;
    }
    setCart([...cart, item]);
  };

  const removeItemFromCart = (item: CartItem) => {
    setCart(cart.filter((cartItem) => cartItem.id !== item.id));
  };

  const resetCart = () => {
    setCart([]);
  };

  const cartValue: CartContextType = {
    cart,
    addItemToCart,
    removeItemFromCart,
    resetCart,
  };

  return (
    <CartContext.Provider value={cartValue}>{children}</CartContext.Provider>
  );
}
