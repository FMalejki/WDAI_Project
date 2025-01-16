import React from "react";
import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext"; // Importujemy AuthProvider
import LoginRegisterPage from "./components/LoginRegisterPage";
import ProtectedRoute from "./components/ProtectedRoute";
import HomePage from "./components/HomePage";
import ProductPage from "./components/ProductPage";
import CartPage from "./components/CartPage";
import OrderHistoryPage from "./components/OrderHistoryPage";
import { CartProvider } from "./context/CartContext";
import { OrderHistoryProvider } from "./context/OrderHistoryContext";
import Header from "./components/Header";


const App: React.FC = () => {
  return (
    <AuthProvider>
      <CartProvider>
        <OrderHistoryProvider>
      <Router>
      <Header />
        <Routes>
          <Route path="/login" element={<LoginRegisterPage />} />
          <Route path="/product/:id"
            element={
              <ProtectedRoute>
                <ProductPage />
              </ProtectedRoute>
            }/>
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <HomePage />
              </ProtectedRoute>
            }
          />
          <Route path="/cart" element={<ProtectedRoute><CartPage /></ProtectedRoute>}/>
          <Route path="/orders" element={<ProtectedRoute><OrderHistoryPage /></ProtectedRoute>} />
        </Routes>
      </Router>
      </OrderHistoryProvider>
      </CartProvider>
    </AuthProvider>
  );
};

export default App;
