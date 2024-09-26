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
import { useQuery } from '@apollo/client';
import { GET_ALL_ORDERS } from '@services/orderService';
import OrderPopUp from './ListPopUp';
import * as Action from '@store/actionTypes';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@store/store';
import { jwtInfo } from '@utils/jwtInfo';
import { OrderGetDTO } from '@interfaces/OrderDTOs';

const ListDetail = () => {
  const [displayOrders, setDisplayOrders] = useState<OrderGetDTO[]>([]);
  const [open, setOpen] = useState<boolean>(false);
  const [selectedOrder, setSelectedOrder] = useState<OrderGetDTO | null>(null);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const ordersPerPage = 10;

  const dispatch = useDispatch();
  const orders = useSelector((state: RootState) => state.order.orders);
  const status = useSelector((state: RootState) => state.order.status);
  const sorted = useSelector((state: RootState) => state.order.sortedOrder);
  const searchText = useSelector((state: RootState) => state.order.searchText);
  const { token } = useSelector((state: RootState) => state.sign);
  const { userRole } = jwtInfo(token || '');

  const { data, loading, error } = useQuery<{ getAllOrders: OrderGetDTO[] }>(
    GET_ALL_ORDERS,
    {
      skip: userRole !== 'ROLE_driver',
    },
  );

  useEffect(() => {
    if (data && data.getAllOrders) {
      dispatch({ type: Action.FETCH_ORDERS, payload: data.getAllOrders });
    }
  }, [data, dispatch]);

  useEffect(() => {
    let updatedOrders = orders.filter(
      (order: OrderGetDTO) => order.orderType === 'delivery',
    );

    if (status) {
      updatedOrders = updatedOrders.filter(
        (order: OrderGetDTO) =>
          status[order.orderStatus as keyof typeof status] ?? true,
      );
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
          (a, b) =>
            new Date(b.updatedTime).getTime() -
            new Date(a.updatedTime).getTime(),
        );
        break;
      case 'orderDateOTN':
        updatedOrders.sort(
          (a, b) =>
            new Date(a.updatedTime).getTime() -
            new Date(b.updatedTime).getTime(),
        );
        break;
      default:
        break;
    }

    if (searchText) {
      updatedOrders = updatedOrders.filter((order: OrderGetDTO) => {
        let matchesSearch = true;
        if (
          !isNaN(parseFloat(searchText)) &&
          isFinite(parseFloat(searchText))
        ) {
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
  }, [currentPage, orders, status, sorted, searchText]);

  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);
  const pageCount = Math.ceil(orders.length / ordersPerPage);

  const handleClickOpen = (order: OrderGetDTO) => {
    setSelectedOrder(order);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const convertTime = (utc: string) => {
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

  const handleOrderStatusUpdate = (
    updatedOrderId: number,
    newStatus: string,
  ) => {
    setDisplayOrders((currentDisplayOrders) =>
      currentDisplayOrders.map((order) =>
        order.orderId === updatedOrderId
          ? { ...order, orderStatus: newStatus }
          : order,
      ),
    );
  };

  if (loading) return <p>Loading orders...</p>;
  if (error) return <p>Error fetching orders</p>;

  return (
    <Container>
      {displayOrders.map((order: OrderGetDTO) => (
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
        order={selectedOrder!}
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

export default ListDetail;
