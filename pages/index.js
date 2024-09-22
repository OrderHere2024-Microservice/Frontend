import React, { useEffect, useState } from 'react';
import { useQuery } from '@apollo/client';
import ThreeColumnsLayout from '../layout/ThreeColumnsLayout';
import FoodItemsList from '../components/DishList/FoodItemsList';
import Carousel from '../components/Carousel/Carousel';
import Category from '../components/Category/Category';
import { GET_DISHES } from '../services/Dish';
import { GET_CATEGORIES_BY_RESTAURANT } from '../services/Category';
import { jwtInfo } from '../utils/jwtInfo';
import OrderList from '../components/OrderList/index';
import { useSelector } from 'react-redux';

const Index = () => {
  const [dishes, setDishes] = useState([]);
  const { token } = useSelector((state) => state.sign);
  const { userRole } = jwtInfo(token);

  const {
    loading: dishesLoading,
    error: dishesError,
    data: dishesData,
  } = useQuery(GET_DISHES, {
    variables: { restaurantId: 1 },
  });

  const {
    loading: categoriesLoading,
    error: categoriesError,
    data: categoriesData,
  } = useQuery(GET_CATEGORIES_BY_RESTAURANT, {
    variables: { restaurantId: 1 },
  });

  useEffect(() => {
    if (dishesData && dishesData.getDishes) {
      setDishes(dishesData.getDishes.data);
    }
  }, [dishesData]);

  if (dishesLoading || categoriesLoading) return <p>Loading...</p>;
  if (dishesError) return <p>Error fetching dishes: {dishesError.message}</p>;
  if (categoriesError)
    return <p>Error loading categories: {categoriesError.message}</p>;

  return (
    <>
      {userRole === 'ROLE_driver' ? (
        <OrderList />
      ) : (
        <ThreeColumnsLayout>
          <Carousel />
          <Category categories={categoriesData.getCategories} />
          <FoodItemsList dishes={dishes} />
        </ThreeColumnsLayout>
      )}
    </>
  );
};

export default Index;
