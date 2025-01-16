import React from "react";
import { useReviews } from "../context/ReviewContext";
import { Card } from "react-bootstrap";

const ReviewList: React.FC = () => {
  const { reviews } = useReviews();

  return (
    <div className="p-4 max-w-md mx-auto">
      <h2 className="text-2xl font-semibold mb-4">Reviews</h2>
      {reviews.length === 0 ? (
        <p>No reviews yet.</p>
      ) : (
        reviews.map((review, index) => (
          <Card key={index} className="mb-4">
            <Card.Body>
              <Card.Title>{review.email}</Card.Title>
              <Card.Text>{review.message}</Card.Text>
              <Card.Text>Rating: {"★".repeat(review.rating)}</Card.Text>
            </Card.Body>
          </Card>
        ))
      )}
    </div>
  );
};

export default ReviewList;
