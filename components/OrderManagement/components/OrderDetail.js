import React, { useState, useEffect } from 'react';
import {
  Container,
  Card,
  Typography,
  CardContent,
  Grid,
  Box,
  Button,
} from '@mui/material';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import { useDispatch, useSelector } from 'react-redux';
import { useQuery } from '@apollo/client';
import { GET_USER_ORDERS, GET_ALL_ORDERS } from '@services/orderService';
import OrderPopUp from './OrderPopUp';
import * as Action from '@store/actionTypes';
import { jwtInfo } from '@utils/jwtInfo';

const OrderDetail = () => {
  const [displayOrders, setDisplayOrders] = useState([]);
  const [open, setOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const ordersPerPage = 10;
  const dispatch = useDispatch();
  const orders = useSelector((state) => state.order.orders);
  const options = useSelector((state) => state.order.options);
  const status = useSelector((state) => state.order.status);
  const sorted = useSelector((state) => state.order.sortedOrder);
  const searchText = useSelector((state) => state.order.searchText);
  const { token } = useSelector((state) => state.sign);
  const { userRole } = jwtInfo(token);

  const {
    data: userData,
    loading: userLoading,
    error: userError,
  } = useQuery(GET_USER_ORDERS, {
    skip: userRole === 'ROLE_sys_admin',
  });

  const {
    data: allOrdersData,
    loading: allOrdersLoading,
    error: allOrdersError,
  } = useQuery(GET_ALL_ORDERS, {
    skip: userRole !== 'ROLE_sys_admin',
  });

  useEffect(() => {
    if (
      userRole === 'ROLE_sys_admin' &&
      allOrdersData &&
      allOrdersData.getAllOrders
    ) {
      dispatch({
        type: Action.FETCH_ORDERS,
        payload: allOrdersData.getAllOrders,
      });
    } else if (userData && userData.getUserOrders) {
      dispatch({ type: Action.FETCH_ORDERS, payload: userData.getUserOrders });
    }
    dispatch({ type: Action.SET_SEARCH_TEXT, payload: '' });
  }, [dispatch, userRole, allOrdersData, userData]);

  useEffect(() => {
    let updatedOrders = [...orders];

    if (options && status) {
      updatedOrders = updatedOrders.filter((order) => {
        const orderTypeIsValid = options[order.orderType] ?? true;
        const orderStatusIsValid = status[order.orderStatus] ?? true;
        return orderTypeIsValid && orderStatusIsValid;
      });
    }

    switch (sorted) {
      case 'orderNumber':
        updatedOrders.sort((a, b) => a.orderId - b.orderId);
        break;
      case 'priceLTH':
        updatedOrders.sort((a, b) => a.totalPrice - b.totalPrice);
        break;
      case 'priceHTL':
        updatedOrders.sort((a, b) => b.totalPrice - a.totalPrice);
        break;
      case 'orderDateNTO':
        updatedOrders.sort(
          (a, b) => new Date(b.updatedTime) - new Date(a.updatedTime),
        );
        break;
      case 'orderDateOTN':
        updatedOrders.sort(
          (a, b) => new Date(a.updatedTime) - new Date(b.updatedTime),
        );
        break;
      default:
        break;
    }

    if (searchText) {
      updatedOrders = updatedOrders.filter((order) => {
        let matchesSearch = true;
        if (!isNaN(parseFloat(searchText)) && isFinite(searchText)) {
          matchesSearch =
            order.orderId.toString().includes(searchText) ||
            order.totalPrice.toString().includes(searchText);
        } else if (searchText.startsWith('#')) {
          const numberSearch = searchText.replace(/# */, '');
          matchesSearch = order.orderId.toString().includes(numberSearch);
        } else {
          matchesSearch = order.username === searchText;
        }
        return matchesSearch;
      });
    }

    const indexOfLastOrder = currentPage * ordersPerPage;
    const indexOfFirstOrder = indexOfLastOrder - ordersPerPage;
    const currentOrders = updatedOrders.slice(
      indexOfFirstOrder,
      indexOfLastOrder,
    );

    setDisplayOrders(currentOrders);
  }, [currentPage, orders, options, status, sorted, searchText]);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);
  const pageCount = Math.ceil(orders.length / ordersPerPage);

  const handleClickOpen = (order) => {
    setSelectedOrder(order);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const convertTime = (utc) => {
    const date = new Date(utc);
    const melbourneTime = new Intl.DateTimeFormat('en-AU', {
      timeZone: 'Australia/Melbourne',
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    }).format(date);

    return melbourneTime;
  };

  const handleOrderStatusUpdate = (updatedOrderId, newStatus) => {
    setDisplayOrders((currentDisplayOrders) =>
      currentDisplayOrders.map((order) =>
        order.orderId === updatedOrderId
          ? { ...order, orderStatus: newStatus }
          : order,
      ),
    );
  };

  if (userRole === 'ROLE_sys_admin' && allOrdersLoading)
    return <p>Loading all orders...</p>;
  if (userRole !== 'ROLE_sys_admin' && userLoading)
    return <p>Loading user orders...</p>;
  if (allOrdersError || userError) return <p>Order not found</p>;

  return (
    <Container>
      {displayOrders.map((order) => (
        <Card
          key={order.orderId}
          sx={{
            my: 2,
            border: '1px solid #D9D9D9',
            borderRadius: '5px',
            cursor: 'pointer',
            transition:
              'transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out',
            '&:hover': {
              transform: 'scale(1.05)',
              boxShadow: '0 4px 20px rgba(0,0,0,0.2)',
            },
          }}
          onClick={() => handleClickOpen(order)}
        >
          <CardContent>
            <Grid
              container
              justifyContent="space-between"
              alignItems="center"
              spacing={0}
            >
              <Grid item>
                <Typography variant="h6">Order #{order.orderId}</Typography>
                <Typography color="text.secondary">
                  {convertTime(order.updatedTime)}
                </Typography>
              </Grid>
              <Grid item>
                <Typography>${order.totalPrice}</Typography>
              </Grid>
              <Grid item>
                <ArrowForwardIosIcon />
              </Grid>
            </Grid>
          </CardContent>
        </Card>
      ))}
      <OrderPopUp
        open={open}
        onClose={handleClose}
        order={selectedOrder}
        time={selectedOrder ? convertTime(selectedOrder.updatedTime) : ''}
        onOrderStatusUpdate={handleOrderStatusUpdate}
      />
      <Box display="flex" justifyContent="center" my={2}>
        {Array.from({ length: pageCount }, (_, index) => (
          <Button key={index + 1} onClick={() => paginate(index + 1)}>
            {index + 1}
          </Button>
        ))}
      </Box>
    </Container>
  );
};

export default OrderDetail;
