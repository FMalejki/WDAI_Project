import React from "react";
import { useCart } from "../context/CartContext";
import { useOrderHistory } from "../context/OrderHistoryContext";
import { Link } from "react-router-dom";

const CartPage: React.FC = () => {
  const { cart, removeFromCart, updateQuantity } = useCart();
  const { addOrder } = useOrderHistory();


  const handleQuantityChange = (id: number, event: React.ChangeEvent<HTMLInputElement>) => {
    const newQuantity = parseInt(event.target.value);
    if (newQuantity > 0) {
      updateQuantity(id, newQuantity);
    }
  };

  const totalPrice = cart.reduce((acc, product) => acc + product.price * product.quantity, 0);

  const placeOrder = () => {
    const newOrder = {
      id: new Date().getTime(),
      date: new Date().toLocaleDateString(),
      products: cart,
    };
    addOrder(newOrder);
    cart.forEach((product) => removeFromCart(product.id));
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold">Your Cart</h1>
      <div className="mt-4">
        {cart.length === 0 ? (
          <p>Your cart is empty!</p>
        ) : (
          <div>
            <ul>
              {cart.map((product) => (
                <li key={product.id} className="flex justify-between p-2 border-b">
                  <span>{product.title}</span>
                  <div className="flex items-center space-x-2">
                    <input
                      type="number"
                      value={product.quantity}
                      min="1"
                      onChange={(e) => handleQuantityChange(product.id, e)}
                      className="w-16 p-1 border"
                    />
                    <span>${(product.price * product.quantity).toFixed(2)}</span>
                    <button
                      onClick={() => removeFromCart(product.id)}
                      className="bg-red-500 text-white px-2 py-1 rounded"
                    >
                      Remove
                    </button>
                  </div>
                </li>
              ))}
            </ul>
            <div className="mt-4">
              <p className="text-xl font-bold">Total: ${totalPrice.toFixed(2)}</p>
              <button
                onClick={placeOrder}
                className="mt-4 bg-green-500 text-white px-4 py-2 rounded"
              >
                Place Order
              </button>
            </div>
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

export default CartPage;
