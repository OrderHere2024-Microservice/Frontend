import Rating from '@mui/material/Rating';

const RatingStars = ({ rating }: { rating: number }) => {
  return (
    <Rating
      name="rating"
      defaultValue={undefined}
      value={rating}
      precision={0.1}
      readOnly
    />
  );
};

export default RatingStars;
