import React, { useState } from "react";
import { Form, Button, Alert } from "react-bootstrap";
import { useReviews } from "../context/ReviewContext";

interface ReviewFormProps {
}

const ReviewForm: React.FC<ReviewFormProps> = () => {
  const { reviews, addReview } = useReviews();
  const [email, setEmail] = useState<string>("");
  const [message, setMessage] = useState<string>("");
  const [rating, setRating] = useState<number>(0);
  const [error, setError] = useState<string>("");

  const userAlreadyReviewed = reviews.some((review) => review.email === email);

  const validateForm = (): boolean => {
    if (!email || !message || rating === 0) {
      setError("All fields are required!");
      return false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError("Please provide a valid email address.");
      return false;
    }

    if (userAlreadyReviewed) {
      setError("You have already submitted a review.");
      return false;
    }

    setError("");
    return true;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (validateForm()) {
      addReview({ email, message, rating });
      setEmail("");
      setMessage("");
      setRating(0);
    }
  };

  return (
    <div className="p-4 max-w-md mx-auto">
      <h2 className="text-2xl font-semibold mb-4">Submit Your Review</h2>
      <Form onSubmit={handleSubmit}>
        {error && <Alert variant="danger">{error}</Alert>}
        
        <Form.Group className="mb-3">
          <Form.Label>Email</Form.Label>
          <Form.Control
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email"
          />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Message</Form.Label>
          <Form.Control
            as="textarea"
            rows={3}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Write your review"
          />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Rating</Form.Label>
          <div className="d-flex gap-2">
            {[1, 2, 3, 4, 5].map((star) => (
              <Button
                key={star}
                variant={rating >= star ? "warning" : "secondary"}
                onClick={() => setRating(star)}
                className="p-2"
              >
                ★
              </Button>
            ))}
          </div>
        </Form.Group>

        <Button type="submit" variant="primary">
          Submit Review
        </Button>
      </Form>
    </div>
  );
};

export default ReviewForm;
