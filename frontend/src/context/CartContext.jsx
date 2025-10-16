import React, { createContext, useState, useEffect, useCallback } from 'react'; 


// 1. Crear el Contexto
export const CartContext = createContext();

// 2. Crear el Proveedor del Contexto (el que tiene la lógica)
export const CartProvider = ({ children }) => {
  // 3. Estado del carrito. Lo inicializamos desde localStorage para persistencia
  const [cartItems, setCartItems] = useState(() => {
    try {
      const localData = localStorage.getItem('cartItems');
      return localData ? JSON.parse(localData) : [];
    } catch (error) {
      return [];
    }
  });

  // 4. Efecto para guardar en localStorage cada vez que el carrito cambie
  useEffect(() => {
    localStorage.setItem('cartItems', JSON.stringify(cartItems));
  }, [cartItems]);

  // 5. Funciones para manipular el carrito
   const addToCart = useCallback((product, quantity) => {
    setCartItems(prevItems => {
      const itemExists = prevItems.find(item => item.id === product.id);
      if (itemExists) {
        return prevItems.map(item =>
          item.id === product.id ? { ...item, quantity: item.quantity + quantity } : item
        );
      } else {
        return [...prevItems, { ...product, quantity }];
      }
    });
  }, []);

  const removeFromCart = (productId) => {
    setCartItems(prevItems => prevItems.filter(item => item.id !== productId));
  };

  const updateQuantity = useCallback((productId, newQuantity) => {
    if (newQuantity <= 0) {
      removeFromCart(productId);
    } else {
      setCartItems(prevItems =>
        prevItems.map(item =>
          item.id === productId ? { ...item, quantity: newQuantity } : item
        )
      );
    }
  }, [removeFromCart]); // removeFromCart es una dependencia aquí

  const clearCart = useCallback(() => {
    setCartItems([]);
  }, []);

  const value = {
    cartItems,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart 
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};