import React, { useState, ChangeEvent } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  InputLabel,
  Select,
  MenuItem,
  DialogActions,
  TextField,
  FormControl,
  Button,
  SelectChangeEvent,
} from '@mui/material';
import { useQuery } from '@apollo/client';
import DeleteIcon from '@mui/icons-material/Delete';
import { GET_CATEGORIES_BY_RESTAURANT } from '@services/Category';
import { CategoryGetDto } from '@interfaces/CategoryDTOs';

interface AddDishModalProps {
  open: boolean;
  handleClose: () => void;
  handleSubmit: (newDishData: DishFormData) => void;
}

interface DishFormData {
  dishName: string;
  description: string;
  price: number;
  restaurantId: number;
  availability: boolean;
  imageFile: File | null;
  categoryId: number;
}

const AddDishModal = ({
  open,
  handleClose,
  handleSubmit,
}: AddDishModalProps) => {
  const [newDish, setNewDish] = useState<DishFormData>({
    dishName: '',
    description: '',
    price: 0.0,
    restaurantId: 1,
    availability: true,
    imageFile: null,
    categoryId: 0,
  });

  const [imageName, setImageName] = useState<string>('');

  const { loading, error, data } = useQuery<{
    getCategories: CategoryGetDto[];
  }>(GET_CATEGORIES_BY_RESTAURANT, {
    variables: { restaurantId: newDish.restaurantId },
    skip: !open,
  });

  const handleChange = (
    e:
      | ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
      | SelectChangeEvent<number>,
  ) => {
    const { name, value, files } = e.target as HTMLInputElement;

    if (name === 'imageFile' && files) {
      setNewDish({ ...newDish, imageFile: files[0] });
      setImageName(files[0].name);
    } else {
      setNewDish({ ...newDish, [name]: value });
    }
  };

  const handleFormSubmit = () => {
    handleSubmit(newDish);
    handleClose();
  };

  const handleDeleteFile = () => {
    setImageName('');
    setNewDish({ ...newDish, imageFile: null });
  };

  if (loading) return <p>Loading categories...</p>;
  if (error) return <p>Error loading categories: {error.message}</p>;

  return (
    <Dialog open={open} onClose={handleClose}>
      <DialogTitle>Add New Dish</DialogTitle>
      <DialogContent>
        <TextField
          name="dishName"
          label="Dish Name"
          fullWidth
          margin="normal"
          onChange={handleChange}
        />
        <TextField
          name="description"
          label="Description"
          fullWidth
          margin="normal"
          onChange={handleChange}
        />
        <TextField
          name="price"
          label="Price"
          fullWidth
          margin="normal"
          type="number"
          onChange={handleChange}
        />
        <FormControl fullWidth margin="normal">
          <InputLabel>Category</InputLabel>
          <Select
            name="categoryId"
            value={newDish.categoryId}
            label="Category"
            onChange={handleChange}
          >
            {data?.getCategories.map((category) => (
              <MenuItem key={category.categoryId} value={category.categoryId}>
                {category.categoryName}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <div style={{ display: 'flex', alignItems: 'center', marginTop: 16 }}>
          <Button
            variant="contained"
            component="label"
            style={{ marginRight: 8 }}
          >
            Upload Image
            <input
              type="file"
              hidden
              onChange={handleChange}
              name="imageFile"
            />
          </Button>
          {imageName && (
            <span style={{ display: 'flex', alignItems: 'center' }}>
              {imageName}
              <DeleteIcon
                onClick={handleDeleteFile}
                style={{ cursor: 'pointer', marginLeft: 8 }}
              />
            </span>
          )}
        </div>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>Cancel</Button>
        <Button onClick={handleFormSubmit}>Add Dish</Button>
      </DialogActions>
    </Dialog>
  );
};

export default AddDishModal;
