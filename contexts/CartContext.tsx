// app/contexts/CartContext.tsx
import React, { createContext, useContext, useState, ReactNode } from 'react';

export interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image: any;
  selectedSize?: string;
  selectedColor?: string;
  selectedWidth?: string;
  brand?: string;
}

interface CartContextType {
  cartItems: CartItem[];
  addToCart: (item: Omit<CartItem, 'quantity'>) => void;
  removeFromCart: (id: string) => void;
  updateQuantity: (id: string, change: number) => void;
  clearCart: () => void;
  getCartItemsCount: () => number;
  getCartTotal: () => number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

interface CartProviderProps {
  children: ReactNode;
}

export const CartProvider: React.FC<CartProviderProps> = ({ children }) => {
  const [cartItems, setCartItems] = useState<CartItem[]>([
    // Initial items for demo purposes
    { 
      id: '1', 
      name: 'Safety Helmet', 
      price: 45.99, 
      quantity: 2, 
      image: require('../assets/icons/footwear.png'),
      selectedSize: 'M',
      selectedColor: 'Yellow'
    },
    { 
      id: '2', 
      name: 'Work Boots', 
      price: 89.99, 
      quantity: 1, 
      image: require('../assets/icons/footwear.png'),
      selectedSize: 'L',
      selectedColor: 'Brown'
    },
    { 
      id: '3', 
      name: 'Reflective Vest', 
      price: 29.99, 
      quantity: 3, 
      image: require('../assets/icons/footwear.png'),
      selectedSize: 'M',
      selectedColor: 'Orange'
    }
  ]);

  const addToCart = (newItem: Omit<CartItem, 'quantity'>) => {
    setCartItems(prev => {
      // Check if item with same id and specifications already exists
      const existingItemIndex = prev.findIndex(item => 
        item.id === newItem.id && 
        item.selectedSize === newItem.selectedSize &&
        item.selectedColor === newItem.selectedColor &&
        item.selectedWidth === newItem.selectedWidth
      );

      if (existingItemIndex >= 0) {
        // If item exists, increase quantity
        const updatedItems = [...prev];
        updatedItems[existingItemIndex].quantity += 1;
        return updatedItems;
      } else {
        // If item doesn't exist, add as new item
        return [...prev, { ...newItem, quantity: 1 }];
      }
    });
  };

  const removeFromCart = (id: string) => {
    setCartItems(prev => prev.filter(item => item.id !== id));
  };

  const updateQuantity = (id: string, change: number) => {
    setCartItems(prev => 
      prev.map(item => 
        item.id === id 
          ? { ...item, quantity: Math.max(0, item.quantity + change) }
          : item
      ).filter(item => item.quantity > 0)
    );
  };

  const clearCart = () => {
    setCartItems([]);
  };

  const getCartItemsCount = () => {
    return cartItems.reduce((total, item) => total + item.quantity, 0);
  };

  const getCartTotal = () => {
    return cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  const value: CartContextType = {
    cartItems,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    getCartItemsCount,
    getCartTotal
  };

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
};