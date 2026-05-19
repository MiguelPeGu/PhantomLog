import { createContext, useContext, useState, useEffect } from 'react';
import { getCart } from '../api/cart';
import { useAuth } from './AuthContext';

const CartContext = createContext();

export function CartProvider({ children }) {
  const [cartCount, setCartCount] = useState(0);
  const { user } = useAuth();

  const fetchGlobalCart = async () => {
    try {
      const res = await getCart();
      if (res.data && res.data.items) {
        const totalItems = res.data.items.reduce((acc, item) => acc + item.quantity, 0); 
        setCartCount(totalItems);
      } else {
        setCartCount(0);
      }
    } catch (e) {
       console.error("Error al obtener el carrito global", e);
    }
  };

  useEffect(() => {
    if (user) {
      fetchGlobalCart();
    } else {
      setCartCount(0);
    }
  }, [user]);

  return (
    <CartContext.Provider value={{ cartCount, fetchGlobalCart, setCartCount }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  return useContext(CartContext);
}
