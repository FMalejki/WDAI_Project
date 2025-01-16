import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { useCart } from "../context/CartContext";
import ReviewForm from "./ReviewForm";
import { ReviewProvider } from "../context/ReviewContext";
import ReviewList from "./ReviewList";

interface Product {
  id: number;
  title: string;
  description: string;
  price: number;
  category: string;
  image: string;
  quantity: number;
  rating: {
    rate: number;
    count: number;
  };
}

const ProductPage: React.FC = () => {
  const { addToCart } = useCart();
  const { id } = useParams<{ id: string }>();
  const [product, setProduct] = useState<Product | null>(null);
  const [quantity, setQuantity] = useState<number>(1);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await axios.get<Product>(`https://fakestoreapi.com/products/${id}`);
        setProduct(response.data);
      } catch (error) {
        console.error("Error fetching product:", error);
      }
    };

    fetchProduct();
  }, [id]);

  const handleAddToCart = () => {
    console.log(`Added to cart: ${product?.title}, Quantity: ${quantity}, Price: ${product?.price}`)
    if(product !== null){
        const productWithQuantity: Product = { ...product, quantity: quantity };
        addToCart(productWithQuantity)
    }
    alert(`Added ${quantity} x "${product?.title}" of price ${product?.price} to cart!`);
  };

  if (!product) {
    return <div className="text-center text-gray-700">Loading product details...</div>;
  }

  return (
    <div className="p-6">
      <div className="max-w-4xl mx-auto flex flex-col lg:flex-row gap-8">
        <div className="flex-shrink-0">
          <img
            src={product.image}
            alt={product.title}
            className="w-full max-w-sm mx-auto object-contain rounded-lg shadow-md"
          />
        </div>

        <div className="flex-grow">
          <h1 className="text-3xl font-bold text-gray-800 mb-4">{product.title}</h1>
          <p className="text-lg text-gray-600 mb-2">{product.category}</p>
          <p className="text-xl text-gray-900 font-semibold mb-6">${product.price.toFixed(2)}</p>

          <p className="text-gray-700 leading-relaxed mb-6">{product.description}</p>

          <div className="flex items-center gap-2 mb-6">
            <span className="text-yellow-500 text-lg font-medium">{product.rating.rate} ★</span>
            <span className="text-gray-500 text-sm">({product.rating.count} reviews)</span>
          </div>

          <div className="flex items-center gap-4 mb-4">
            <label htmlFor="quantity" className="text-gray-700 font-medium">
              Quantity:
            </label>
            <input
              id="quantity"
              type="number"
              min="1"
              value={quantity}
              onChange={(e) => setQuantity(Number(e.target.value))}
              className="w-16 p-2 border border-gray-300 rounded-lg text-center focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <button
            onClick={handleAddToCart}
            className="py-2 px-6 bg-blue-500 text-white font-medium rounded-lg shadow-md hover:bg-blue-600 transition-colors"
          >
            Add to Cart
          </button>
        </div>
        <ReviewProvider>
            <div className="App">
                <h1>Product Reviews</h1>
                <ReviewList/>
                <ReviewForm />
            </div>
        </ReviewProvider>
      </div>
    </div>
  );
};

export default ProductPage;
