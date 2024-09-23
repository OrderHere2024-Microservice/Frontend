import React, { useState } from 'react';
import { Box, Button, Stack } from '@mui/material';
import { useDispatch } from 'react-redux';
import * as Actions from '@store/actionTypes';
import { CategoryGetDto } from '@interfaces/CategoryDTOs';

const buttonGroupStyles = {
  justifyContent: 'center',
  padding: 2,
  backgroundColor: '#fff',
};

const Category = ({ categories }: { categories: CategoryGetDto[] }) => {
  const [selectedCategoryId, setSelectedCategoryId] = useState<number | null>(
    null,
  );

  const dispatch = useDispatch();

  const handleCategoryClick = (categoryId: number) => {
    if (selectedCategoryId === categoryId) {
      setSelectedCategoryId(null);
      dispatch({ type: Actions.SET_CATEGORY, payload: null });
    } else {
      setSelectedCategoryId(categoryId);
      dispatch({ type: Actions.SET_CATEGORY, payload: categoryId });
    }
  };

  return (
    <Box sx={{ width: '100%', overflowX: 'auto', ...buttonGroupStyles }}>
      <Stack
        direction="row"
        justifyContent="flex-start"
        alignItems="center"
        spacing={2}
        sx={{
          '& > *': {
            flex: '0 0 auto',
            minWidth: 'fit-content',
          },
          flexWrap: 'nowrap',
        }}
      >
        {categories.map((category) => (
          <Button
            key={category.categoryId}
            onClick={() => handleCategoryClick(category.categoryId)}
            sx={{
              backgroundColor:
                selectedCategoryId === category.categoryId
                  ? 'primary.main'
                  : 'grey',
              fontSize: '14px',
              width: '120px',
              color: 'white',
              '&:hover': {
                backgroundColor: 'primary.main',
                color: 'white',
                transition: 'all 0.5s ease',
              },
            }}
          >
            {category.categoryName}
          </Button>
        ))}
      </Stack>
    </Box>
  );
};

export default Category;
