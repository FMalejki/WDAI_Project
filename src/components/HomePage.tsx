import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { Card, Button, Form, Row, Col } from "react-bootstrap";

interface Product {
  id: number;
  title: string;
  description: string;
  price: number;
  category: string;
  image: string;
}

const HomePage: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>("");

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get<Product[]>("https://fakestoreapi.com/products");
        response.data = response.data.filter((item) => {
          return !(item.title && item.title.includes("-"));
        });
        setProducts(response.data);
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };

    fetchProducts();
  }, []);

  const filteredProducts = products.filter((product) =>
    product.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-6">
      <h1 className="text-4xl font-bold text-center text-gray-800 mb-6">Simple Store</h1>

      <div className="mb-8 d-flex justify-content-center">
        <Form.Control
          type="text"
          placeholder="Search products..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-75"
        />
      </div>

      <Row xs={1} sm={2} md={3} lg={4} className="g-4">
        {filteredProducts.map((product) => (
          <Col key={product.id}>
            <Card className="h-100 shadow-sm border-light">
              <Card.Img
                variant="top"
                src={product.image}
                alt={product.title}
                className="w-100 h-100 object-contain"
              />
              <Card.Body>
                <Card.Title>{product.title}</Card.Title>
                <Card.Text>
                  {product.description.substring(0, 50)}...
                </Card.Text>
                <Card.Text className="fw-bold">${product.price.toFixed(2)}</Card.Text>
                <Link to={`/product/${product.id}`}>
                  <Button variant="primary" className="w-100">
                    View Details
                  </Button>
                </Link>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>
    </div>
  );
};

export default HomePage;
