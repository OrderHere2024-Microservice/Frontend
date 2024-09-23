import React, { useState } from 'react';
import { Box, Typography, Divider, ButtonBase } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import CheckListItems from './components/CheckListItems/ChecklistItems';
import * as Action from '@store/actionTypes';
import { useRouter } from 'next/router';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';
import { useMutation } from '@apollo/client';
import { PLACE_ORDER } from '@services/orderService';
import { RootState } from '@store/store';
import { PlaceOrderDTO } from '@interfaces/OrderDTOs';
import Image from 'next/image';

dayjs.extend(utc);
dayjs.extend(timezone);

const CheckList = () => {
  const router = useRouter();
  const dispatch = useDispatch();

  const totalPrice = useSelector(
    (state: RootState) => state.cart.totalPrice,
  ).toFixed(2);
  const cartItems = useSelector((state: RootState) => state.cart.items);

  const shippingFee = 0;

  const address = useSelector((state: RootState) => state.delivery.addressData);
  const note = useSelector((state: RootState) => state.delivery.noteData);
  const orderType = useSelector((state: RootState) => state.cart.orderType);

  const dineInPhone = useSelector(
    (state: RootState) => state.dinein.phoneNumber,
  );
  const personCount = useSelector(
    (state: RootState) => state.dinein.personCount,
  );
  const dineInDate = useSelector(
    (state: RootState) => state.dinein.selectedDate,
  );
  const dineInTime = useSelector(
    (state: RootState) => state.dinein.selectedTime,
  );
  const combinedDateTime = dayjs(`${dineInDate} ${dineInTime}`);
  const dineInZonedDateTime = combinedDateTime.utc().format();
  const dineInName = useSelector((state: RootState) => state.dinein.name);
  const PickUpTime = useSelector(
    (state: RootState) => state.pickup.selectedTime,
  );
  const PickUpDate = useSelector(
    (state: RootState) => state.pickup.selectedDate,
  );
  const combinedPickUpDateTime = dayjs(`${PickUpDate} ${PickUpTime}`);
  const PickUpzonedDateTime = combinedPickUpDateTime.utc().format();
  const [placeOrderMutation] = useMutation<
    { placeOrder: boolean },
    { placeOrderDTO: PlaceOrderDTO }
  >(PLACE_ORDER);
  const [showWarningShake, setShowWarningShake] = useState(false);

  const warningShakeStyle = {
    animation: showWarningShake ? 'shake 0.5s' : 'none',
  };

  const handleClearCart = () => {
    dispatch({ type: Action.CLEAR_CART });
    dispatch({ type: Action.CALCULATE_TOTAL_PRICE });
  };
  const handleCheckout = async () => {
    let orderData: {
      restaurantId: number;
      orderStatus: string;
      discount: number;
      totalPrice: number;
      note: string;
      tableNumber: number;
      dishes: {
        dishId: number;
        dishName: string;
        dishQuantity: number;
        dishPrice: number;
      }[];
      orderType: string;
      address: string;
      phone: string;
      pickupTime: string;
      numberOfPeople?: number;
    } = {
      restaurantId: 1,
      orderStatus: 'pending',
      discount: 0,
      totalPrice: parseFloat(totalPrice),
      note: note,
      tableNumber: 0,
      dishes: cartItems.map((item) => ({
        dishId: item.dishId,
        dishName: item.dishName,
        dishQuantity: item.quantity,
        dishPrice: item.price,
      })),
      orderType: orderType,
      address: '',
      phone: '',
      pickupTime: '',
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
        numberOfPeople: personCount ? parseInt(personCount.toString()) : 0,
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
      const { data, errors } = await placeOrderMutation({
        variables: {
          placeOrderDTO: {
            ...orderData,
            numberOfPeople: orderData.numberOfPeople ?? 0,
          },
        },
      });

      if (errors) {
        console.error('GraphQL errors:', errors);
        return;
      }

      if (!data || !data.placeOrder) {
        console.error('Error: No data returned from placeOrderMutation');
        return;
      }
      const orderId = data.placeOrder;
      await router
        .push(`/pay?orderId=${orderId}&totalPrice=${totalPrice}`)
        .catch((error) => {
          console.error('Error navigating to payment page:', error);
        });

      dispatch({ type: Action.CLEAR_CART });
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
          <Image
            src="/icons/cart/trash.png"
            alt="trash"
            height={25}
            width={25}
          />
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
          <Image
            src="/icons/cart/warning-2.png"
            alt="question"
            height={25}
            width={25}
          />
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
          onClick={() => {
            handleCheckout().catch((error) => {
              console.error('Error checking out:', error);
            });
          }}
          sx={{ backgroundColor: 'primary.main', width: '100%', height: 40 }}
        >
          <Typography sx={{ marginRight: 2, color: 'white' }}>
            Check Out
          </Typography>{' '}
          <Image src="/icons/cart/user.png" alt="user" height={25} width={25} />
        </ButtonBase>
      </Box>
    </>
  );
};

export default CheckList;
