import { Box } from '@mui/material';
import React from 'react';

const CartImage = () => {
  return (
    <Box
      sx={{
        width: '100%',
        height: '300px',
        backgroundImage: 'url(/image/cart-bg.png)',
        backgroundSize: 'cover',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
      }}
    ></Box>
  );
};

export default CartImage;
