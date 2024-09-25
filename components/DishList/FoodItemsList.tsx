import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { useSelector, useDispatch } from 'react-redux';
import { useMutation } from '@apollo/client';
import { Box, CircularProgress, Alert, Button } from '@mui/material';
import FoodItem from './FoodItem';
import AddDishModal from './AddDishModal';
import {
  addDishStart,
  addDishSuccess,
  addDishError,
} from '@store/actions/dishAction';
import { jwtInfo } from '@utils/jwtInfo';
import { postDishes, DELETE_DISH } from '@services/Dish';
import { RootState } from '@store/store';
import { DishGetDto } from '@interfaces/DishDTOs';
import { DishCreateDto } from '@interfaces/DishDTOs';

interface FoodItemsListProps {
  dishes: DishGetDto[];
}

const FoodItemsList = ({ dishes: initialDishes }: FoodItemsListProps) => {
  const [dishes, setDishes] = useState<DishGetDto[]>(initialDishes);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isAddDishModalOpen, setAddDishModalOpen] = useState(false);
  const [dishAdditionCount, setDishAdditionCount] = useState(0);

  const { searchTerm, category } = useSelector(
    (state: RootState) => state.dish,
  );
  const priceRange = useSelector((state: RootState) => state.filter.priceRange);
  const { token } = useSelector((state: RootState) => state.sign);
  const dispatch = useDispatch();
  const router = useRouter();
  const { userRole } = jwtInfo(token || '');

  const [deleteDishMutation] = useMutation<{ deleteDish: boolean }>(
    DELETE_DISH,
  );

  const handleAddNewDishClick = () => setAddDishModalOpen(true);
  const handleCloseModal = () => setAddDishModalOpen(false);

  const handleRemoveDish = async (dishId: number) => {
    try {
      setIsLoading(true);
      const response = await deleteDishMutation({ variables: { dishId } });
      if (response.data?.deleteDish) {
        setDishes((currentDishes) =>
          currentDishes.filter((dish) => dish.dishId !== dishId),
        );
      }
    } catch (error) {
      setError('Error deleting dish');
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddDishSubmit = async (newDishData: DishCreateDto) => {
    dispatch(addDishStart());
    try {
      setIsLoading(true);
      const response = await postDishes(newDishData);

      if (response) {
        dispatch(addDishSuccess());
        setDishAdditionCount((count) => count + 1);
        await router.push('/');
      }
    } catch (error: unknown) {
      if (error instanceof Error) {
        dispatch(addDishError(error.message));
      } else {
        dispatch(addDishError('An unknown error occurred'));
      }
    } finally {
      setIsLoading(false);
    }
    handleCloseModal();
  };

  // Effect to filter dishes based on price range, search term, and category
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
          onRemoveDish={(dishId) => {
            handleRemoveDish(dishId).catch((error: unknown) => {
              if (error instanceof Error) {
                setError(error.message);
              } else {
                setError('An unknown error occurred');
              }
            });
          }}
        />
      ))}

      {userRole === 'ROLE_sys_admin' && (
        <>
          <Box sx={{ display: 'flex', justifyContent: 'center' }}>
            <Button
              onClick={handleAddNewDishClick}
              variant="contained"
              sx={{
                mt: 5,
                mr: 5,
                fontSize: '18px',
                width: '180px',
                borderColor: 'black',
                '&:hover': {
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
            handleSubmit={(newDishData) => {
              handleAddDishSubmit(newDishData).catch((error: unknown) => {
                if (error instanceof Error) {
                  setError(error.message);
                } else {
                  setError('An unknown error occurred');
                }
              });
            }}
          />
        </>
      )}
    </>
  );
};

export default FoodItemsList;
