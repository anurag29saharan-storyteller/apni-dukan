import {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
} from "react";
import type { ReactNode } from "react";
import { fetchCart, getToken } from "../api";
type CartContextValue = {
  count: number;
  refresh: () => Promise<void>;
};

const CartContext = createContext<CartContextValue>({
  count: 0,
  refresh: async () => {},
});

export function CartProvider({ children }: { children: ReactNode }) {
  const [count, setCount] = useState(0);

  const refresh = useCallback(async () => {
    if (!getToken()) {
      setCount(0);
      return;
    }
    try {
      const cart = await fetchCart();
      setCount(cart.total_items);
    } catch {
      setCount(0);
    }
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  return (
    <CartContext.Provider value={{ count, refresh }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  return useContext(CartContext);
}