import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { useSelector, useDispatch } from 'react-redux';
import { useMutation } from '@apollo/client';
import FoodItem from '/components/DishList/FoodItem';
import { Box, CircularProgress, Alert, Button } from '@mui/material';
import AddDishModal from './AddDishModal';
import { addDishStart, addDishSuccess, addDishError } from './AddDishModal';
import { jwtInfo } from '../../utils/jwtInfo';
import { DELETE_DISH, CREATE_DISH } from '../../services/Dish';
import { postDishes } from '../../services/Dish';

const FoodItemsList = ({ dishes: initialDishes }) => {
  const [dishes, setDishes] = useState(initialDishes);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isAddDishModalOpen, setAddDishModalOpen] = useState(false);
  const [dishAdditionCount, setDishAdditionCount] = useState(0);
  const { searchTerm, category } = useSelector((state) => state.dish);

  const dispatch = useDispatch();
  const router = useRouter();
  const priceRange = useSelector((state) => state.filter.priceRange);
  const { token } = useSelector((state) => state.sign);
  const { userRole } = jwtInfo(token);

  const [deleteDishMutation] = useMutation(DELETE_DISH);
  // const [addDishMutation] = useMutation(CREATE_DISH);

  const handleAddNewDishClick = () => setAddDishModalOpen(true);
  const handleCloseModal = () => setAddDishModalOpen(false);

  const handleRemoveDish = async (dishId) => {
    try {
      const response = await deleteDishMutation({ variables: { dishId } });
      if (response.data.deleteDish) {
        setDishes((currentDishes) =>
          currentDishes.filter((dish) => dish.dishId !== dishId),
        );
      }
    } catch (error) {
      setError('Error deleting dish');
    }
  };

  const handleAddDishSubmit = async (newDishData) => {
    dispatch(addDishStart());
    try {
      const response = await postDishes(newDishData);

      if (response) {
        dispatch(addDishSuccess(response.data.data));
        setDishAdditionCount((count) => count + 1);
        router.push('/');
      }
    } catch (error) {
      dispatch(addDishError(error.toString()));
    }
    handleCloseModal();
  };

  useEffect(() => {
    let filteredDishes = initialDishes.filter(
      (dish) => dish.price >= priceRange.min && dish.price <= priceRange.max,
    );
    if (searchTerm) {
      filteredDishes = filteredDishes.filter(
        (dish) =>
          dish.dishName.toLowerCase().includes(searchTerm.toLowerCase()) ||
          dish.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
          dish.price.toString().includes(searchTerm),
      );
    }
    if (category) {
      filteredDishes = filteredDishes.filter(
        (dish) => dish.categoryId === category,
      );
    }
    setDishes(filteredDishes);
    setError(null);
  }, [priceRange, dishAdditionCount, initialDishes, searchTerm, category]);

  if (isLoading) {
    return (
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: '20vh',
        }}
      >
        <CircularProgress size={80} />
      </Box>
    );
  }

  if (error) {
    return (
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: '20vh',
        }}
      >
        <Alert severity="error" sx={{ width: '50%', fontSize: '1.2rem' }}>
          {error}
        </Alert>
      </Box>
    );
  }

  return (
    <>
      {dishes.map((dish) => (
        <FoodItem
          key={dish.dishId}
          dishId={dish.dishId}
          dishName={dish.dishName}
          description={dish.description}
          price={dish.price}
          imageUrl={dish.imageUrl}
          rating={dish.rating}
          onRemoveDish={handleRemoveDish}
        />
      ))}

      {userRole === 'ROLE_sys_admin' && (
        <>
          <Box sx={{ display: 'flex', justifyContent: 'center' }}>
            <Button
              onClick={handleAddNewDishClick}
              sx={{
                mt: 5,
                mr: 5,
                backgroundColor: 'button.main',
                fontSize: '14px',
                width: '170px',
                color: '#fff',
                '&:hover': {
                  backgroundColor: 'button.main',
                  opacity: 0.6,
                  transition: '0.3s',
                },
              }}
            >
              ADD NEW DISH
            </Button>
          </Box>
          <AddDishModal
            open={isAddDishModalOpen}
            handleClose={handleCloseModal}
            handleSubmit={handleAddDishSubmit}
          />
        </>
      )}
    </>
  );
};

export default FoodItemsList;
