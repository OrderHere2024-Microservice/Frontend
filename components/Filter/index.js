import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import Slider from '@mui/material/Slider';
import { Typography, Box } from '@mui/material';
import { useQuery } from '@apollo/client';
import { GET_DISHES_PRICE_FILTER } from '../../services/Dish';
import * as Action from '../../store/actionTypes';

const pricingFilterStyle = {
  background: '#FEF6E9',
  padding: '20px',
  borderRadius: '8px',
  boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
  marginBottom: '20px',
};



const PricingFilter = () => {
  const dispatch = useDispatch();
  const [priceRange, setPriceRange] = useState({ min: 0, max: 100 });
  const [values, setValues] = useState([0, 100]);

  const { loading, error, data } = useQuery(GET_DISHES_PRICE_FILTER, {
    variables: { restaurantId: 1 },
  });

  useEffect(() => {
    if (data && data.getDishes) {
      const prices = data.getDishes.data.map((dish) => dish.price);
      const minPrice = Math.floor(Math.min(...prices));
      const maxPrice = Math.ceil(Math.max(...prices));
      setPriceRange({ min: minPrice, max: maxPrice });
      setValues([minPrice, maxPrice]);
    }
  }, [data]);

  const handleChange = (event, newValues) => {
    setValues(newValues);
    dispatch({
      type: Action.SET_PRICE_RANGE,
      payload: { min: newValues[0], max: newValues[1] },
    });
  };

  const marks = [
    {
      value: values[0],
      label: `$${values[0]}`,
      position: 'bottom',
    },
    {
      value: values[1],
      label: `$${values[1]}`,
      position: 'bottom',
    },
  ];

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  return (
    <Box sx={{ ...pricingFilterStyle, width: '100%' }}>
      <Typography variant="h5" gutterBottom fontWeight="bold">
        PRICING FILTER
      </Typography>
      <Box sx={{ borderBottom: '1px dashed grey', width: '100%', my: 2 }} />
      <Slider
        value={values}
        onChange={handleChange}
        valueLabelDisplay="off"
        marks={marks}
        sx={{
          color: '#1976d2',
          '& .MuiSlider-thumb': {
            height: 24,
            width: 24,
            backgroundColor: '#fff',
            border: '2px solid currentColor',
            '&:focus, &:hover, &.Mui-active, &.Mui-focusVisible': {
              boxShadow: `0px 0px 0px 8px rgb(255 0 0 / 16%)`,
            },
          },
          '& .MuiSlider-track': {
            height: 8,
          },
          '& .MuiSlider-rail': {
            color: '#d8d8d8',
            opacity: 1,
            height: 8,
          },
          '& .MuiSlider-markLabel': {
            fontSize: '1.0rem',
          },
        }}
        min={priceRange.min}
        max={priceRange.max}
      />
    </Box>
  );
};

export default PricingFilter;
