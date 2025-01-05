import React from "react";
import Rating from "react-rating";

const BookStarRating = ({ rating, onRatingChange, readonly = false }) => {
  return (
    <Rating
      initialRating={rating}
      onChange={readonly ? undefined : onRatingChange}
      readonly={readonly}
      emptySymbol={<i className="bi bi-star text-warning fs-4"></i>}
      fullSymbol={<i className="bi bi-star-fill text-warning fs-4"></i>}
      fractions={1}
    />
  );
};

export default BookStarRating;
