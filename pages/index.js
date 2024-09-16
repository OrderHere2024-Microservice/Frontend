import React, { useEffect, useState } from 'react';
import { useQuery } from '@apollo/client';
import ThreeColumnsLayout from '../layout/ThreeColumnsLayout';
import FoodItemsList from '../components/DishList/FoodItemsList';
import Carousel from '../components/Carousel/Carousel';
import Category from '../components/Category/Category';
import { getDishes } from '../services/Dish';
import { GET_CATEGORIES_BY_RESTAURANT } from '../services/Category';
import { jwtInfo } from '../utils/jwtInfo';
import OrderList from '../components/OrderList/index';
import { useSelector } from 'react-redux';

const Index = () => {
  const [dishes, setDishes] = useState([]);
  const { token } = useSelector((state) => state.sign);
  const { userRole } = jwtInfo(token);

  useEffect(() => {
    async function fetchDishes() {
      try {
        const dishResponse = await getDishes();
        setDishes(dishResponse.data.data);
      } catch (error) {
        console.error('Error fetching dishes:', error);
      }
    }
    fetchDishes();
  }, []);

  const { loading, error, data } = useQuery(GET_CATEGORIES_BY_RESTAURANT, {
    variables: { restaurantId: 1 },
  });

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error loading categories: {error.message}</p>;

  return (
    <>
      {userRole === 'ROLE_driver' ? (
        <OrderList />
      ) : (
        <ThreeColumnsLayout>
          <Carousel />
          <Category categories={data.getCategories} />
          <FoodItemsList dishes={dishes} />
        </ThreeColumnsLayout>
      )}
    </>
  );
};

export default Index;
