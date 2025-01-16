import React, { createContext, useState, ReactNode, useContext } from "react";

interface Product {
    id: number;
    title: string;
    description: string;
    price: number;
    category: string;
    image: string;
    quantity: number;
}

interface Order {
  id: number;
  date: string;
  products: Product[];
}

interface OrderHistoryContextType {
  orders: Order[];
  addOrder: (order: Order) => void;
}

const OrderHistoryContext = createContext<OrderHistoryContextType | undefined>(undefined);

export const useOrderHistory = () => {
  const context = useContext(OrderHistoryContext);
  if (!context) {
    throw new Error("useOrderHistory must be used within a OrderHistoryProvider");
  }
  return context;
};

interface OrderHistoryProviderProps {
  children: ReactNode;
}

export const OrderHistoryProvider: React.FC<OrderHistoryProviderProps> = ({ children }) => {
  const [orders, setOrders] = useState<Order[]>([]);

  const addOrder = (order: Order) => {
    setOrders((prevOrders) => [...prevOrders, order]);
  };

  return (
    <OrderHistoryContext.Provider value={{ orders, addOrder }}>
      {children}
    </OrderHistoryContext.Provider>
  );
};
