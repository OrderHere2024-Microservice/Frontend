import React, { useState } from 'react';
import { useQuery } from '@apollo/client';
import { GET_RESTAURANT_ADDRESS } from '@services/Restaurant';
import { GET_ORDER_BY_ID } from '@services/orderService';
import { Box, Divider, Grid, Typography } from '@mui/material';
import LocationOnIcon from '@mui/icons-material/LocationOn';

export const OrderDetail = ({ orderId }) => {
  console.log(orderId);
  const [restaurantId, setRestaurantId] = useState(1);

  const {
    loading: loadingOrder,
    error: orderError,
    data: orderData,
  } = useQuery(GET_ORDER_BY_ID, {
    variables: { orderId },
  });

  const {
    loading: loadingRestaurant,
    error: restaurantError,
    data: restaurantAddressData,
  } = useQuery(GET_RESTAURANT_ADDRESS, {
    variables: { restaurantId },
    skip: !restaurantId,
  });

  const convertToMelbourneTime = (utcTimestamp) => {
    if (!utcTimestamp) {
      return 'Null';
    }
    const trimmedTimestamp = /(\.\d{3})\d*Z$/.test(utcTimestamp)
      ? utcTimestamp.replace(/(\.\d{3})\d*Z$/, '$1Z')
      : utcTimestamp;

    const date = new Date(trimmedTimestamp);
    if (isNaN(date)) {
      return 'Null';
    }

    const dateOptions = {
      year: 'numeric',
      month: 'numeric',
      day: 'numeric',
      timeZone: 'Australia/Melbourne',
    };
    const timeOptions = {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      timeZone: 'Australia/Melbourne',
    };

    const formattedDate = new Intl.DateTimeFormat('en-AU', dateOptions).format(
      date,
    );
    const formattedTime = new Intl.DateTimeFormat('en-AU', timeOptions).format(
      date,
    );
    return `${formattedDate}\n${formattedTime}`;
  };

  const renderOrderTypeInfo = (order) => {
    switch (order?.orderType) {
      case 'delivery':
        return (
          <>
            <Grid item xs={6}>
              <Typography sx={{ color: 'text.secondary' }}>
                Estimation Time
              </Typography>
              <Typography sx={{ fontWeight: 'bold' }}>10 Min</Typography>
            </Grid>
            <Grid item xs={6}>
              <Typography sx={{ color: 'text.secondary' }}>Distance</Typography>
              <Typography sx={{ fontWeight: 'bold' }}>2.5km</Typography>
            </Grid>
          </>
        );
      case 'pickup':
        return (
          <>
            <Grid item xs={6}>
              <Typography sx={{ color: 'text.secondary' }}>
                PickUp Time
              </Typography>
              <Typography sx={{ fontWeight: 'bold' }}>
                {convertToMelbourneTime(order?.pickupTime)}
              </Typography>
            </Grid>
            <Grid item xs={6}>
              <Typography sx={{ color: 'text.secondary' }}>Phone</Typography>
              <Typography sx={{ fontWeight: 'bold' }}>
                {order?.phone ? order?.phone : 'Null'}
              </Typography>
            </Grid>
          </>
        );
      case 'dine_in':
        return (
          <>
            <Grid item xs={6}>
              <Typography sx={{ color: 'text.secondary' }}>
                Number of People
              </Typography>
              <Typography sx={{ fontWeight: 'bold' }}>
                {order?.numberOfPeople ? order?.numberOfPeople : 'Null'}
              </Typography>
            </Grid>
            <Grid item xs={6}>
              <Typography sx={{ color: 'text.secondary' }}>
                Dine In Time
              </Typography>
              <Typography sx={{ fontWeight: 'bold' }}>
                {order?.pickUpTime ? order?.pickUpTime : 'Null'}
              </Typography>
            </Grid>
          </>
        );
      default:
        return null;
    }
  };

  if (loadingOrder || loadingRestaurant) {
    return <Typography>Loading...</Typography>;
  }

  if (orderError || restaurantError) {
    return <Typography>Error loading data</Typography>;
  }

  const order = orderData?.getOrderById;
  const restaurantAddress =
    restaurantAddressData?.getRestaurantById?.address || 'No address found';

  return (
    <Box maxWidth="md" sx={{ margin: 'auto' }}>
      <Typography variant="h4" sx={{ textAlign: 'center', marginBottom: 2 }}>
        Order Details
      </Typography>
      <Box
        sx={{
          borderRadius: '5px',
          border: '1px solid #D9D9D9',
          padding: 2,
          backgroundColor: '#fff',
        }}
      >
        {order ? (
          <Box
            sx={{
              borderRadius: '5px',
              border: '1px solid #D9D9D9',
              paddingBlock: 2,
              paddingInline: 2,
            }}
          >
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                mb: 2,
              }}
            >
              <Box>
                <Typography variant="h6">Order #{order.orderId}</Typography>
              </Box>
              <Typography variant="h6">{order.username}</Typography>
            </Box>
            <Divider />
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'space-between',
                mt: 2,
                width: '100%',
                mb: 2,
              }}
            >
              <Box
                sx={{
                  maxWidth: '50%',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                }}
              >
                <Typography
                  sx={{ color: 'text.secondary', textTransform: 'capitalize' }}
                >
                  {order.orderType == 'dine_in' ? 'Dine in' : order.orderType}{' '}
                  Address
                </Typography>
                <Box display="flex" alignItems="center">
                  <LocationOnIcon />
                  <Typography>
                    {order.orderType === 'delivery'
                      ? order.address
                      : restaurantAddress}
                  </Typography>
                </Box>
                <Typography sx={{ color: 'text.secondary' }}>
                  Note:{' '}
                  {order?.note || 'No special instructions.'}
                </Typography>
              </Box>
              <Grid container spacing={2} sx={{ maxWidth: '50%' }}>
                {renderOrderTypeInfo(order)}
                <Grid item xs={6}>
                  <Typography sx={{ color: 'text.secondary' }}>
                    Payment
                  </Typography>
                  <Typography sx={{ fontWeight: 'bold' }}>
                    Credit Card
                  </Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography sx={{ color: 'text.secondary' }}>
                    Status
                  </Typography>
                  <Box sx={{ cursor: 'pointer' }}>
                    <Typography
                      sx={{ fontWeight: 'bold', textTransform: 'capitalize' }}
                    >
                      {order.orderStatus == 'in_transit'
                        ? 'In transit'
                        : order.orderStatus}
                    </Typography>
                  </Box>
                </Grid>
              </Grid>
            </Box>
            <Divider />
            {order.dishes.map((dish) => (
              <Box
                key={dish.dishName}
                sx={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  mb: 2,
                  mt: 2,
                }}
              >
                <Typography variant="h6">
                  {dish.dishName} x {dish.dishQuantity}
                </Typography>
                <Typography variant="h6">
                  {dish.dishQuantity * dish.dishPrice}
                </Typography>
              </Box>
            ))}
            <Divider />
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                mt: 2,
              }}
            >
              <Typography variant="h6">Total</Typography>
              <Typography variant="h6">${order.totalPrice}</Typography>
            </Box>
          </Box>
        ) : (
          <Typography>No order details found</Typography>
        )}
      </Box>
    </Box>
  );
};
