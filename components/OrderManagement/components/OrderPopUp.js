import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Typography,
  Box,
  Divider,
  Grid,
  Button,
  Select,
  MenuItem,
} from '@mui/material';
import { useMutation } from '@apollo/client';
import { UPDATE_ORDER_STATUS, DELETE_ORDER } from '../../../services/orderService';
import { useQuery } from '@apollo/client';
import { GET_RESTAURANT_ADDRESS } from '../../../services/Restaurant';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import * as Action from '../../../store/actionTypes';
import { useDispatch, useSelector } from 'react-redux';
import { jwtInfo } from '../../../utils/jwtInfo';
import dynamic from 'next/dynamic';

const ContactMap = dynamic(
  () => import('../../restaurantInfo/components/ContactMap'),
  { ssr: false },
);

const OrderPopUp = ({ open, onClose, order, time, onOrderStatusUpdate }) => {
  const dispatch = useDispatch();
  const { token } = useSelector((state) => state.sign);
  const { userRole } = jwtInfo(token);

  const [originalStatus, setOriginalStatus] = useState('');
  const [isEditMode, setEditMode] = useState(false);
  const [statusValue, setStatusValue] = useState(order?.orderStatus || '');

  const [updateOrderStatusMutation] = useMutation(UPDATE_ORDER_STATUS);

  const [deleteOrderMutation] = useMutation(DELETE_ORDER);

  const { data, loading, error } = useQuery(GET_RESTAURANT_ADDRESS, {
    variables: { restaurantId: order?.restaurantId },
    skip: !order?.restaurantId,
  });

  const address = order?.address || data?.getRestaurantById?.address;

  const handleClose = () => {
    if (isEditMode) {
      setStatusValue(originalStatus);
    }
    onClose();
  };

  const toggleEditMode = () => {
    if (!isEditMode) {
      setOriginalStatus(order.orderStatus);
      setStatusValue(order.orderStatus);
    }
    setEditMode(!isEditMode);
  };

  const handleStatusChange = (event) => {
    setStatusValue(event.target.value);
  };

  const handleEditStatusSubmit = async () => {
    try {
      const response = await updateOrderStatusMutation({
        variables: {
          updateOrderStatusDTO: {
            orderId: parseInt(order.orderId),
            orderStatus: statusValue,
          },
        },
      });
      if (response.data) {
        dispatch({
          type: Action.UPDATE_ORDER_STATUS,
          payload: { orderId: order.orderId, newStatus: statusValue },
        });
        setOriginalStatus(statusValue);
        setEditMode(false);
        onOrderStatusUpdate(order.orderId, statusValue);
        onClose();
      }
    } catch (error) {
      console.error('Error updating status:', error);
    }
  };

  const handleRejectedOrder = async () => {
    try {
      await deleteOrderMutation({
        variables: {
          deleteOrderDTO: {
            orderId: parseInt(order.orderId),
          },
        },
      });
      dispatch({ type: Action.DELETE_ORDER, payload: order.orderId });
      onClose();
    } catch (error) {
      console.error('Error deleting order:', error);
    }
  };

  const convertToMelbourneTime = (utcTimestamp) => {
    if (!utcTimestamp) return 'Null';
    const date = new Date(utcTimestamp);
    return date.toLocaleString('en-AU', {
      timeZone: 'Australia/Melbourne',
      year: 'numeric',
      month: 'numeric',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    });
  };

  const renderOrderTypeInfo = () => {
    switch (order.orderType) {
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
                {convertToMelbourneTime(order.pickupTime)}
              </Typography>
            </Grid>
            <Grid item xs={6}>
              <Typography sx={{ color: 'text.secondary' }}>Phone</Typography>
              <Typography sx={{ fontWeight: 'bold' }}>
                {order.phone ? order.phone : 'Null'}
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
                {order.numberOfPeople ? order.numberOfPeople : 'Null'}
              </Typography>
            </Grid>
            <Grid item xs={6}>
              <Typography sx={{ color: 'text.secondary' }}>
                PickUp Time
              </Typography>
              <Typography sx={{ fontWeight: 'bold' }}>
                {order.pickUpTime ? order.pickUpTime : 'Null'}
              </Typography>
            </Grid>
          </>
        );
      default:
        return null;
    }
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="md">
      <DialogTitle>Order Details</DialogTitle>
      <DialogContent>
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
                <Typography sx={{ color: 'text.secondary' }}>{time}</Typography>
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
                }}
              >
                <Typography
                  sx={{ color: 'text.secondary', textTransform: 'capitalize' }}
                >
                  {order.orderType === 'dine_in' ? 'Dine in' : order.orderType}{' '}
                  Address
                </Typography>
                <Box display="flex" alignItems="center">
                  <LocationOnIcon />
                  <Typography>{address}</Typography>
                </Box>
                <ContactMap address={address} />
                <Typography sx={{ color: 'text.secondary' }}>
                  Note: {order.note || 'No special instructions'}
                </Typography>
              </Box>
              <Grid container spacing={2} sx={{ maxWidth: '50%' }}>
                {renderOrderTypeInfo()}
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
                    {isEditMode ? (
                      <Select
                        labelId="status-choose-label"
                        id="status-select"
                        value={statusValue}
                        onChange={handleStatusChange}
                      >
                        <MenuItem value="pending">Pending</MenuItem>
                        <MenuItem value="preparing">Preparing</MenuItem>
                        <MenuItem value="finished">Finished</MenuItem>
                        <MenuItem value="cancelled">Cancelled</MenuItem>
                        <MenuItem value="in_transit">In transit</MenuItem>
                        <MenuItem value="delivered">Delivered</MenuItem>
                        <MenuItem value="delayed">Delayed</MenuItem>
                      </Select>
                    ) : (
                      <Typography
                        sx={{ fontWeight: 'bold', textTransform: 'capitalize' }}
                      >
                        {order.orderStatus === 'in_transit'
                          ? 'In transit'
                          : order.orderStatus}
                      </Typography>
                    )}
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
          <Typography>Loading...</Typography>
        )}
      </DialogContent>
      <DialogActions>
        {userRole === 'ROLE_sys_admin' ? (
          isEditMode ? (
            <>
              <Button onClick={toggleEditMode}>Exit</Button>
              <Button onClick={handleEditStatusSubmit}>Save</Button>
            </>
          ) : (
            <>
              <Button onClick={handleClose}>Close</Button>
              <Button onClick={handleRejectedOrder}>Reject Order</Button>
              <Button onClick={toggleEditMode}>Modify Order</Button>
            </>
          )
        ) : (
          <>
            <Button onClick={handleClose}>Close</Button>
            <Button onClick={handleEditStatusSubmit}>Save</Button>
          </>
        )}
      </DialogActions>
    </Dialog>
  );
};

export default OrderPopUp;
