import React from "react";
import Rating from "react-rating";

const StarRating = ({ rating, onRatingChange }) => {
  return (
    <Rating
      initialRating={rating}
      onChange={onRatingChange}
      emptySymbol={<i className="bi bi-star text-warning fs-4"></i>}
      fullSymbol={<i className="bi bi-star-fill text-warning fs-4"></i>}
      fractions={1}
    />
  );
};

export default StarRating;