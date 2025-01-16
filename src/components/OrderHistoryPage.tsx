import React from "react";
import { useOrderHistory } from "../context/OrderHistoryContext"; 
import { Link } from "react-router-dom";

const OrderHistoryPage: React.FC = () => {
  const { orders } = useOrderHistory();

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold">Order History</h1>
      <div className="mt-4">
        {orders.length === 0 ? (
          <p>You have no orders yet.</p>
        ) : (
          <div>
            <ul>
              {orders.map((order) => (
                <li key={order.id} className="mb-6 p-4 border rounded-lg shadow-lg">
                  <h2 className="text-xl font-semibold">Order #{order.id}</h2>
                  <p className="text-sm text-gray-500">Date: {order.date}</p>
                  <div className="mt-2">
                    <h3 className="text-lg font-semibold">Products:</h3>
                    <ul className="list-disc pl-6">
                      {order.products.map((product) => (
                        <li key={product.id} className="flex justify-between">
                          <span>{product.title} x{product.quantity}</span>
                          <span>${(product.price * product.quantity).toFixed(2)}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
      <div className="mt-4">
        <Link to="/" className="bg-blue-500 text-white px-4 py-2 rounded">
          Continue Shopping
        </Link>
      </div>
    </div>
  );
};

export default OrderHistoryPage;