import React, { useState } from 'react';
import { Box, Typography, Divider, ButtonBase } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import CheckListItems from './components/CheckListItems/ChecklistItems';
import * as Action from '../../../../../store/actionTypes';
import { useRouter } from 'next/router';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';
import { useMutation } from '@apollo/client';
import { PLACE_ORDER } from '../../../../../services/orderService';

dayjs.extend(utc);
dayjs.extend(timezone);

const CheckList = () => {
  const router = useRouter();
  const dispatch = useDispatch();

  const totalPrice = useSelector((state) => state.cart.totalPrice).toFixed(2);
  const cartItems = useSelector((state) => state.cart.items);

  const shippingFee = 0;

  const address = useSelector((state) => state.delivery.addressData);
  const note = useSelector((state) => state.delivery.noteData);
  const orderType = useSelector((state) => state.cart.orderType);

  const dineInPhone = useSelector((state) => state.dinein.phoneNumber);
  const personCount = useSelector((state) => state.dinein.personCount);
  const dineInDate = useSelector((state) => state.dinein.selectedDate);
  const dineInTime = useSelector((state) => state.dinein.selectedTime);
  const combinedDateTime = dayjs(`${dineInDate} ${dineInTime}`);
  const dineInZonedDateTime = combinedDateTime.utc().format();
  const dineInName = useSelector((state) => state.dinein.name);
  const PickUpTime = useSelector((state) => state.pickup.selectedTime);
  const PickUpDate = useSelector((state) => state.pickup.selectedDate);
  const combinedPickUpDateTime = dayjs(`${PickUpDate} ${PickUpTime}`);
  const PickUpzonedDateTime = combinedPickUpDateTime.utc().format();
  const [placeOrderMutation] = useMutation(PLACE_ORDER);

  const unselectedIngredients = useSelector(
    (state) => state.ingredient.unselectedIngredients,
  );
  console.log('unselect', unselectedIngredients);
  let formattedIngredients = '';
  for (const [dish, unselected] of Object.entries(unselectedIngredients)) {
    const unselectedString = unselected.join(', No ');
    formattedIngredients += `${dish}: No ${unselectedString}\n`;
  }
  formattedIngredients = formattedIngredients.trim();
  console.log('format unselected', formattedIngredients);

  const [showWarningShake, setShowWarningShake] = useState(false);

  const warningShakeStyle = {
    animation: showWarningShake ? 'shake 0.5s' : 'none',
  };

  const handleClearCart = () => {
    dispatch({ type: Action.CLEAR_CART });
    dispatch({ type: Action.CALCULATE_TOTAL_PRICE });
  };
  const handleCheckout = async () => {
    let orderData = {
      restaurantId: 1,
      orderStatus: 'pending',
      discount: 0,
      totalPrice: parseFloat(totalPrice),
      note: `${note.note} ${
        formattedIngredients ? `Customized detail: ${formattedIngredients}` : ''
      }`,
      dishes: cartItems.map((item) => ({
        dishId: item.dishId,
        dishName: item.dishName,
        dishQuantity: item.quantity,
        dishPrice: item.price,
      })),
    };

    if (orderType === 'delivery') {
      orderData = {
        ...orderData,
        orderType: orderType,
        address: address.address,
        phone: address.phone,
      };

      if (
        orderType === 'delivery' &&
        (!address.name || !address.phone || !address.address)
      ) {
        console.log('Warning: Shipping information is missing!');
        setShowWarningShake(true);
        setTimeout(() => setShowWarningShake(false), 1000);
        return;
      }
    } else if (orderType === 'dine in') {
      orderData = {
        ...orderData,
        orderType: 'dine_in',
        pickupTime: dineInZonedDateTime,
        phone: dineInPhone,
        numberOfPeople: parseInt(personCount),
      };

      if (!dineInName || !dineInPhone || !personCount) {
        console.log('Warning: Dine-in information is missing!');
        setShowWarningShake(true);
        setTimeout(() => setShowWarningShake(false), 1000);
        return;
      }
    } else if (orderType === 'pickup') {
      orderData = {
        ...orderData,
        orderType: orderType,
        pickupTime: PickUpzonedDateTime,
      };
    }

    try {
      console.log('final data:', orderData);
      const { data, errors } = await placeOrderMutation({
        variables: {
          placeOrderDTO: orderData,
        },
      });

      if (errors) {
        console.error('GraphQL errors:', errors);
        return;
      }

      console.log('Order placed successfully:', data.placeOrder);
      const orderId = data.placeOrder;
      router.push(`/pay?orderId=${orderId}&totalPrice=${totalPrice}`);

      dispatch({ type: Action.CLEAR_CART });
      dispatch({ type: Action.CLEAR_UNSELECTED_INGREDIENTS });
    } catch (error) {
      console.error('Error placing order:', error);
    }
  };

  return (
    <>
      <Box
        sx={{ padding: 2, display: 'flex', justifyContent: 'space-between' }}
      >
        <Typography
          sx={{ fontSize: '20px', fontWeight: '600', color: 'text.title' }}
        >
          Checklist
        </Typography>
        <ButtonBase
          onClick={handleClearCart}
          sx={{
            ':hover': {
              cursor: 'pointer',
            },
          }}
        >
          <img src="icons/cart/trash.png" alt="trash" />
        </ButtonBase>
      </Box>
      <Divider sx={{ mx: 2, borderColor: 'border.section' }} />
      <Box sx={{ mx: 2, height: 216, overflowY: 'scroll' }}>
        <CheckListItems />
      </Box>
      <Divider sx={{ mx: 2, borderColor: 'border.section' }} />

      <Divider sx={{ mx: 2, borderColor: 'border.section' }} />
      <Box
        sx={{ padding: 2, display: 'flex', justifyContent: 'space-between' }}
      >
        <Typography
          sx={{ fontSize: '16px', fontWeight: '400', color: 'text.title' }}
        >
          Total
        </Typography>
        <Typography
          sx={{ fontSize: '16px', fontWeight: '400', color: 'text.title' }}
        >
          ${totalPrice}
        </Typography>
      </Box>

      <Divider sx={{ mx: 2, borderColor: 'border.section' }} />
      <Box
        sx={{ padding: 2, display: 'flex', justifyContent: 'space-between' }}
      >
        <Typography
          sx={{ fontSize: '14px', fontWeight: '400', color: 'text.title' }}
        >
          Shipping Fee
        </Typography>
        <Typography
          sx={{ fontSize: '14px', fontWeight: '400', color: 'text.title' }}
        >
          ${shippingFee}
        </Typography>
      </Box>
      <Box
        sx={{ padding: 2, display: 'flex', justifyContent: 'space-between' }}
      >
        <Typography
          sx={{ fontSize: '10px', fontWeight: '300', color: 'text.warning' }}
        >
          The shipping cost will be calculated based on your chosen address,
          time, and method of delivery, and will be added to this amount.
        </Typography>
        <Box sx={{ ml: 2 }}>
          <img src="icons/cart/warning-2.png" alt="question" />
        </Box>
      </Box>

      <Divider sx={{ mx: 2, borderColor: 'border.section' }} />
      <Box
        sx={{ padding: 2, display: 'flex', justifyContent: 'space-between' }}
      >
        <Typography
          sx={{ fontSize: '18px', fontWeight: '500', color: 'text.title' }}
        >
          Order Total
        </Typography>
        <Typography
          sx={{ fontSize: '18px', fontWeight: '500', color: 'text.dishSize' }}
        >
          ${totalPrice}
        </Typography>
      </Box>

      {orderType === 'delivery' &&
        (!address.name || !address.phone || !address.address) && (
          <Box
            sx={{
              mx: 2,
              padding: 2,
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              backgroundColor: 'warning.main',
              color: 'white',
              borderRadius: '8px',
              ...warningShakeStyle,
            }}
          >
            <Typography sx={{ fontSize: '16px', fontWeight: '400' }}>
              Warning: Shipping information is missing!
            </Typography>
          </Box>
        )}

      {orderType === 'dine in' &&
        (!dineInName || !dineInPhone || !personCount) && (
          <Box
            sx={{
              mx: 2,
              padding: 2,
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              backgroundColor: 'warning.main',
              color: 'white',
              borderRadius: '8px',
              ...warningShakeStyle,
            }}
          >
            <Typography sx={{ fontSize: '16px', fontWeight: '400' }}>
              Warning: Dine-in information is missing!
            </Typography>
          </Box>
        )}

      <Box
        sx={{ padding: 2, display: 'flex', justifyContent: 'center', mb: 4 }}
      >
        <ButtonBase
          onClick={handleCheckout}
          sx={{ backgroundColor: 'primary.main', width: '100%', height: 40 }}
        >
          <Typography sx={{ marginRight: 2, color: 'white' }}>
            Check Out
          </Typography>{' '}
          <img src="/icons/cart/user.png" />
        </ButtonBase>
      </Box>
    </>
  );
};

export default CheckList;
