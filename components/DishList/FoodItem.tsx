import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Box,
  Typography,
  Divider,
  ListItemText,
  IconButton,
  Button,
} from '@mui/material';
import { Add as AddIcon, Remove as RemoveIcon } from '@mui/icons-material';
import DeleteIcon from '@mui/icons-material/Delete';
import * as Action from '@store/actionTypes';
import DishPopup from '../DishPopUp/DishPopUp';
import RatingStars from './RatingStars';
import { jwtInfo } from '@utils/jwtInfo';
import { RootState } from '@store/store';

interface FoodItemProps {
  dishId: number;
  dishName: string;
  description: string;
  price: number;
  imageUrl: string;
  rating: number;
  onRemoveDish: (dishId: number) => void;
}

const FoodItem = ({
  dishId,
  dishName,
  description,
  price,
  imageUrl,
  rating,
  onRemoveDish,
}: FoodItemProps) => {
  const dispatch = useDispatch();
  const cartItems = useSelector((state: RootState) => state.cart.items);
  const item = cartItems.find((item) => item.dishId === dishId);
  const quantity = item ? item.quantity : 0;
  const [popupOpen, setPopupOpen] = useState(false);
  const [isAddedToCart, setIsAddedToCart] = useState(false);

  const { token } = useSelector((state: RootState) => state.sign);
  const { userRole } = jwtInfo(token as string);

  useEffect(() => {
    if (quantity === 0) {
      setIsAddedToCart(false);
    } else if (quantity > 0) {
      setIsAddedToCart(true);
    }
  }, [quantity]);

  const togglePopup = () => {
    setPopupOpen(!popupOpen);
  };

  const handleAddToCart = () => {
    setIsAddedToCart(true);
    if (quantity === 0) {
      const itemPayload = {
        dishId,
        dishName,
        description,
        price,
        imageUrl,
        rating,
        quantity: 1,
      };
      dispatch({ type: Action.ADD_TO_CART, payload: itemPayload });
    } else {
      dispatch({ type: Action.INCREASE_ITEM, payload: { dishId } });
    }
    dispatch({ type: Action.CALCULATE_TOTAL_PRICE });
  };

  const decrementQuantity = () => {
    if (quantity > 1) {
      dispatch({ type: Action.DECREASE_ITEM, payload: { dishId } });
    } else if (quantity === 1) {
      dispatch({ type: Action.REMOVE_FROM_CART, payload: { dishId } });
    }
    dispatch({ type: Action.CALCULATE_TOTAL_PRICE });
  };

  return (
    <>
      <Divider sx={{ border: 0, borderColor: 'border.main' }} />
      <Box
        id={`food-item-${dishId}`}
        sx={{
          position: 'relative',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'flex-start',
          marginY: 1.5,
          borderRadius: '10px',
          boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.1)',
          padding: '16px',
          height: '200px',
        }}
      >
        {userRole === 'ROLE_sys_admin' && (
          <IconButton
            onClick={() => onRemoveDish(dishId)}
            sx={{
              position: 'absolute',
              top: 0,
              right: 0,
            }}
          >
            <DeleteIcon />
          </IconButton>
        )}
        <Box
          component="img"
          sx={{
            width: '180px',
            height: '180px',
            flexShrink: 0,
            ':hover': { cursor: 'pointer' },
          }}
          src={imageUrl}
          alt={dishName}
          onClick={togglePopup}
        />
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            flexGrow: 1,
            marginLeft: '15px',
            justifyContent: 'space-between',
            height: '100%',
            marginRight: 2,
          }}
        >
          <Box sx={{ ml: 1, flexShrink: 0 }}>
            <Typography sx={{ fontSize: '25px', fontWeight: '600' }}>
              {dishName}
            </Typography>
          </Box>
          <Box
            sx={{
              display: 'flex',
              ml: 1,
              flexShrink: 0,
              width: '100%',
              alignItems: 'center',
              justifyContent: 'space-between',
              flexDirection: 'row',
            }}
          >
            <Typography sx={{ fontSize: '15px', fontWeight: '600' }}>
              {description}
            </Typography>
            <Typography sx={{ fontSize: '16px', fontWeight: '600' }}>
              ${price}
            </Typography>
          </Box>
          <Box
            sx={{
              display: 'flex',
              ml: 1,
              flexShrink: 0,
              width: '100%',
              alignItems: 'center',
              justifyContent: 'space-between',
              flexDirection: 'row',
            }}
          >
            <RatingStars rating={rating} />
            {isAddedToCart ? (
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  ml: 3,
                  border: '1.5px solid #1976d2',
                  borderRadius: '10px',
                  width: '200px',
                  justifyContent: 'space-between',
                  padding: '0 8px',
                }}
              >
                <IconButton
                  onClick={decrementQuantity}
                  sx={{ color: 'primary.main' }}
                  disabled={quantity === 0}
                >
                  <RemoveIcon />
                </IconButton>
                <ListItemText
                  primary={quantity}
                  primaryTypographyProps={{
                    fontWeight: 600,
                    textAlign: 'center',
                  }}
                />
                <IconButton
                  onClick={handleAddToCart}
                  sx={{ color: 'primary.main' }}
                >
                  <AddIcon />
                </IconButton>
              </Box>
            ) : (
              <Button
                sx={{
                  ml: 3,
                  backgroundColor: 'primary.main',
                  fontSize: '13px',
                  width: '200px',
                  color: '#fff',
                  '&:hover': {
                    backgroundColor: 'primary.main',
                    opacity: 0.6,
                    transition: '0.3s',
                  },
                }}
                onClick={handleAddToCart}
              >
                ADD TO CART
              </Button>
            )}
          </Box>
        </Box>
      </Box>
      <DishPopup
        dishId={dishId}
        dishName={dishName}
        description={description}
        price={price}
        imageUrl={imageUrl}
        open={popupOpen}
        onClose={togglePopup}
      />
    </>
  );
};

export default FoodItem;
