import React, { createContext, useContext, useState, ReactNode } from "react";
import { CartItem, AddOn, Item, Cart } from "./Types";

interface CartContextType {
  cart: Cart;
  handleRemoveItem: (cartItemId: string, itemTotal: number) => void;
  handleAddToCart: (
    item: Item,
    quantity: number,
    selectedAddOns: AddOn[],
    spiciness: number
  ) => void;
}

const generateCartId = () => {
  // Replace this with your own method to generate a unique add-on ID
  return Math.floor(Math.random() * 1000);
};

const CartContext = createContext<CartContextType>({
  cart: {
    id: generateCartId(), // Initialize with an ID
    items: [],
    cartTotal: 0,
  },
  handleRemoveItem: () => {
    throw new Error("handleRemoveItem function not provided");
  },
  handleAddToCart: () => {
    throw new Error("handleAddToCart function not provided");
  },
});

export const useCartContext = () => {
  return useContext(CartContext);
};

interface CartProviderProps {
  children: ReactNode;
}

export const CartProvider: React.FC<CartProviderProps> = ({ children }) => {

  const savedCart = localStorage.getItem("cart");
  const initialCart: Cart = savedCart ? JSON.parse(savedCart) : {
    id: generateCartId(),
    items: [],
    cartTotal: 0,
  };

  const [cart, setCart] = useState<Cart>(initialCart);
  const [cartItems, setCartItems] = useState<CartItem[]>(initialCart.items);
  const [cartTotal, setCartTotal] = useState<number>(initialCart.cartTotal);

  const handleRemoveItem = (cartItemId: string, itemTotal: number) => {
    setCart((prevCart) => {
      const updatedItems = prevCart.items.filter(
        (item) => item.cartItemId !== cartItemId
      );
      const updatedCartTotal = prevCart.cartTotal - itemTotal;
      
      const updatedCart: Cart = {
        ...prevCart,
        items: updatedItems,
        cartTotal: updatedCartTotal,
      };

      setCartItems(updatedItems);
      setCartTotal(updatedCartTotal);

      localStorage.setItem("cart", JSON.stringify(updatedCart));

      return updatedCart;
    });
  };

  const handleAddToCart = (
    item: Item,
    quantity: number,
    selectedAddOns: AddOn[],
    spiciness: number
  ) => {
    if (quantity <= 0) {
      return;
    }
    const cartItemId = `${item.id}-${Date.now()}`;

    const newCartItem: CartItem = {
      ...item,
      quantity,
      addOns: selectedAddOns,
      spiciness,
      itemTotal: 0,
      cartItemId,
    };

    const newItemTotal = getItemTotalPrice(newCartItem);
    newCartItem.itemTotal = newItemTotal

    const newTotal = cartTotal + newItemTotal;
    setCartTotal(newTotal);

    const updatedCart = [...cartItems, newCartItem];
    setCartItems(updatedCart);

    const updateCart: Cart = {
      id: cart.id,
      items: [...updatedCart],
      cartTotal: newTotal,
    };

    setCart(updateCart);
    localStorage.setItem("cart", JSON.stringify(updateCart));
  };

  const getItemTotalPrice = (item: CartItem) => {
    return (
      (item.price +
        item.addOns.reduce(
          (addOnTotal, addOn) => addOnTotal + addOn.price,
          0
        )) *
      item.quantity
    );
  };

  return (
    <CartContext.Provider value={{ cart, handleRemoveItem, handleAddToCart }}>
      {children}
    </CartContext.Provider>
  );
};
