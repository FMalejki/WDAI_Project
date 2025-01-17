import React, { createContext, useContext, ReactNode, useState, useEffect } from "react";
import axios from "axios";
import ProductPage from "../components/ProductPage";

interface Product {
  id: number;
  title: string;
  description: string;
  price: number;
  category: string;
  image: string;
  quantity: number;
}

interface CartContextType {
  cart: Product[];
  addToCart: (product: Product) => void;
  removeFromCart: (title: string) => void;
  updateQuantity: (title: string, quantity: number) => void;
  fetchCart: () => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
};

interface CartProviderProps {
  children: ReactNode;
}

export const CartProvider: React.FC<CartProviderProps> = ({ children }) => {
  const [cart, setCart] = useState<Product[]>([]);

  const fetchCart = async () => {
    try {
      const response = await axios.get("http://localhost:5000/cart", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      setCart(response.data);
    } catch (error) {
      console.error("Failed to fetch cart:", error);
    }
  };

  const addToCart = async (product: Product) => {
    try {
      const response = await axios.post(
        "http://localhost:5000/cart",
        { 
          title: product.title,
          description: product.description,
          price: product.price,
          category: product.category,
          image: product.image,
          quantity: product.quantity,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      setCart((prevCart) => [...prevCart, response.data]);
    } catch (error) {
      console.error("Failed to add to cart:", error);
    }
  };
  

  const removeFromCart = async (title: string) => {
    try {
      console.log(title)
      setCart((prevCart) =>
        prevCart.filter((product) => product.title !== title)
      );
      await axios.delete(`http://localhost:5000/cart/${title}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
  

    } catch (error) {
      console.error("Failed to remove from cart:", error);
    }
  };
  const updateQuantity = async (title: string, quantity: number) => {
    try {
      const response = await axios.put(
        `http://localhost:5000/cart/${title}`,
        { quantity },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
  
      if (quantity > 0) {
        setCart((prevCart) =>
          prevCart.map((product) =>
            product.title === title ? { ...product, quantity } : product
          )
        );
      } else {
        setCart((prevCart) =>
          prevCart.filter((product) => product.title !== title)
        );
      }
    } catch (error) {
      console.error("Failed to update quantity:", error);
    }
  };
  

  useEffect(() => {
    fetchCart();
  }, []);

  return (
    <CartContext.Provider value={{ cart, addToCart, removeFromCart, updateQuantity, fetchCart }}>
      {children}
    </CartContext.Provider>
  );
};
