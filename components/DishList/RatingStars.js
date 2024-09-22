import Rating from '@mui/material/Rating';

const RatingStars = ({ rating }) => {
  return (
    <Rating
      name="rating"
      defaultValue={null}
      value={rating}
      precision={0.1}
      readOnly
    />
  );
}

export default RatingStars;