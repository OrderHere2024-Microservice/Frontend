import { Box, Typography, Button } from '@mui/material';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '@store/store';
import * as Action from '@store/actionTypes';

const Option = () => {
  const dispatch = useDispatch();
  const orderType = useSelector((state: RootState) => state.cart.orderType);

  const handleClick = (newOrderType: string) => {
    dispatch({ type: Action.SET_ORDER_TYPE, payload: newOrderType });
  };

  return (
    <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
      <Button
        sx={{
          backgroundColor: orderType === 'delivery' ? 'primary.main' : 'grey',
          width: '120px',
          height: '48px',
          borderRadius: '50px',
          mb: 4,
          '&:hover': {
            backgroundColor: orderType === 'dine in' ? 'primary.main' : 'grey',
          },
        }}
        onClick={() => handleClick('delivery')}
      >
        <Typography
          sx={{ color: 'white', fontSize: '16px', fontWeight: '600' }}
        >
          Delivery
        </Typography>
      </Button>
      <Button
        sx={{
          backgroundColor: orderType === 'pickup' ? 'primary.main' : 'grey',
          width: '120px',
          height: '48px',
          borderRadius: '50px',
          '&:hover': {
            backgroundColor: orderType === 'dine in' ? 'primary.main' : 'grey',
          },
        }}
        onClick={() => handleClick('pickup')}
      >
        <Typography
          sx={{ color: 'white', fontSize: '16px', fontWeight: '600' }}
        >
          Pickup
        </Typography>
      </Button>
      <Button
        sx={{
          backgroundColor: orderType === 'dine in' ? 'primary.main' : 'grey',
          width: '120px',
          height: '48px',
          borderRadius: '50px',
          '&:hover': {
            backgroundColor: orderType === 'dine in' ? 'primary.main' : 'grey',
          },
        }}
        onClick={() => handleClick('dine in')}
      >
        <Typography
          sx={{ color: 'white', fontSize: '16px', fontWeight: '600' }}
        >
          Dine in
        </Typography>
      </Button>
    </Box>
  );
};

export default Option;
