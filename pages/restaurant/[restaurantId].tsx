import React, { useState } from 'react';
import { Box, Button } from '@mui/material';
import { useRouter } from 'next/router';
import RestaurantInfoHeader from '@components/restaurantInfo/components/restaurantInfoHeader';
import RestaurantInfoContent from '@components/restaurantInfo/components/restaurantInfoContent';
import Contact from '@components/restaurantInfo/components/contact';
import OpeningHours from '@components/restaurantInfo/components/openingHours';
import { EditRestaurantModal } from '@components/restaurantInfo/EditRestaurantModal';
import { useQuery } from '@apollo/client';
import { GET_RESTAURANT_INFO } from '@services/Restaurant';
import { jwtInfo } from '@utils/jwtInfo';
import { useSelector } from 'react-redux';
import { RootState } from '@store/store';
import { RestaurantGetDTO } from '@interfaces/RestaurantDTOs';

const RestaurantInfoPage = () => {
  const router = useRouter();
  const { restaurantId } = router.query;
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const { token } = useSelector((state: RootState) => state.sign);
  const { userRole } = jwtInfo(token || '');

  const { loading, error, data, refetch } = useQuery<
    { getRestaurantById: RestaurantGetDTO },
    { restaurantId: number }
  >(GET_RESTAURANT_INFO, {
    variables: { restaurantId: parseInt(restaurantId as string) },
    skip: !restaurantId,
    fetchPolicy: 'cache-and-network',
  });

  const restaurantData = data?.getRestaurantById;

  if (!restaurantId || loading) {
    return <div>Loading...</div>;
  }

  if (error || !restaurantData) {
    return <div>Restaurant not found</div>;
  }

  const handleEditButtonClick = () => {
    setIsEditModalOpen(true);
  };

  const refreshRestaurantData = async () => {
    try {
      await refetch();
    } catch (err) {
      console.error('Error fetching updated data:', err);
    }
  };

  return (
    <Box sx={{ width: '100%' }}>
      <RestaurantInfoHeader />
      {userRole === 'ROLE_sys_admin' && (
        <Box sx={{ display: 'flex', justifyContent: 'space-around' }}>
          <Button
            variant="contained"
            onClick={handleEditButtonClick}
            sx={{
              marginY: 4,
              backgroundColor: 'primary.main',
              color: '#fff',
              '&:hover': {
                backgroundColor: 'primary.main',
                opacity: 0.6,
                transition: '0.3s',
              },
            }}
          >
            EDIT RESTAURANT INFO
          </Button>
          {isEditModalOpen && (
            <EditRestaurantModal
              restaurantId={restaurantId}
              initialData={restaurantData}
              onClose={() => setIsEditModalOpen(false)}
              onUpdate={refreshRestaurantData}
            />
          )}
        </Box>
      )}
      <RestaurantInfoContent data={restaurantData} />
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-around',
          mt: 4,
          pt: 8,
          pb: 8,
          backgroundColor: '#E9E9E9',
        }}
      >
        <Contact data={restaurantData} />
        <OpeningHours data={restaurantData.openingHours} />
      </Box>
    </Box>
  );
};

export default RestaurantInfoPage;
