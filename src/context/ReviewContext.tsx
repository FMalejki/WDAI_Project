import axios from "axios";
import React, { createContext, useContext, useState, ReactNode, useEffect } from "react";

interface Review {
  email: string;
  message: string;
  rating: number;
}

interface ReviewContextType {
  reviews: Review[];
  addReview: (review: Review) => void;
  fetchReview: () => void;
}

const ReviewContext = createContext<ReviewContextType | undefined>(undefined);

interface ReviewProviderProps {
  children: ReactNode;
}

export const ReviewProvider: React.FC<ReviewProviderProps> = ({ children }) => {
  const [reviews, setReviews] = useState<Review[]>([]);

  const addReview = async (review: Review) => {
    try {
        const response = await axios.post(
          "http://localhost:5000/reviews",
          { 
            email: review.email,
            rating: review.rating,
            message: review.message,
          },
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        setReviews((prevReviews) => [...prevReviews, review]);
    } catch (error) {
        console.error("Failed to add to reviews:", error);
      }
  };

  const fetchReview = async () => {
    try {
      const response = await axios.get("http://localhost:5000/reviews", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`, // Zakładając, że używasz tokenów
        },
      });
      setReviews(response.data);
    } catch (error) {
      console.error("Failed to fetch reviews:", error);
    }
  };

    useEffect(() => {
      fetchReview();
    }, []);

  return (
    <ReviewContext.Provider value={{ reviews, addReview, fetchReview }}>
      {children}
    </ReviewContext.Provider>
  );
};

export const useReviews = (): ReviewContextType => {
  const context = useContext(ReviewContext);
  if (!context) {
    throw new Error("useReviews must be used within a ReviewProvider");
  }
  return context;
};
