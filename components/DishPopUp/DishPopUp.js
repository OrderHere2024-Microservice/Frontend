import React, { useState, useEffect } from 'react';
import CloseIcon from '@mui/icons-material/Close';
import { useRouter } from 'next/router';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogActions from '@mui/material/DialogActions';
import {
  Box,
  Typography,
  ListItemText,
  IconButton,
  Button,
  List,
  ListItem,
  Collapse,
  Checkbox,
  TextField,
  DialogTitle,
  Input,
} from '@mui/material';
import { Add as AddIcon, Remove as RemoveIcon } from '@mui/icons-material';
import AddCircleRoundedIcon from '@mui/icons-material/AddCircleRounded';
import HighlightOffRoundedIcon from '@mui/icons-material/HighlightOffRounded';
import InsertPhotoOutlinedIcon from '@mui/icons-material/InsertPhotoOutlined';
import {
  GET_INGREDIENTS_BY_DISH_ID,
  GET_INGREDIENT_BY_ID,
  CREATE_INGREDIENT,
  UPDATE_INGREDIENT,
  DELETE_INGREDIENT,
} from '@services/Ingredient';
import { useApolloClient } from '@apollo/client';
import { useDispatch, useSelector } from 'react-redux';
import * as Action from '@store/actionTypes';
import { updateDishes } from '@services/Dish';
import { jwtInfo } from '@utils/jwtInfo';
import { useQuery, useMutation } from '@apollo/client';
import styles from './DishPopup.module.css';

const DishPopup = ({
  dishId,
  dishName,
  description,
  price,
  imageUrl,
  open,
  onClose,
}) => {
  const client = useApolloClient();
  const [ingredientDetails, setIngredientDetails] = useState([]);
  const dispatch = useDispatch();
  const cartItems = useSelector((state) => state.cart.items);
  const item = cartItems.find((item) => item.dishId === dishId);
  const quantity = item ? item.quantity : 0;
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [tempIngredientDetails, setTempIngredientDetails] = useState([]);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedIngredientId, setSelectedIngredientId] = useState(null);
  const [tempUnselectedIngredients, setTempUnselectedIngredients] = useState(
    new Set(),
  );
  const [newDish, setNewDish] = useState({
    dishId: dishId,
    dishName: dishName,
    description: description,
    price: price,
    restaurantId: 1,
    availability: true,
    imageFile: null,
  });
  const router = useRouter();
  const { token } = useSelector((state) => state.sign);
  const { userRole } = jwtInfo(token);
  const [isAddedToCart, setIsAddedToCart] = React.useState(false);

  const { data: dishData } = useQuery(GET_INGREDIENTS_BY_DISH_ID, {
    variables: { dishID: dishId },
  });

  const [createIngredient] = useMutation(CREATE_INGREDIENT);
  const [updateIngredient] = useMutation(UPDATE_INGREDIENT);
  const [deleteIngredient] = useMutation(DELETE_INGREDIENT);

  useEffect(() => {
    if (dishData && dishData.findIngredientsByDishID) {
      const ingredientPromises = dishData.findIngredientsByDishID.map(
        (dishIngredient) => {
          return getIngredientById(dishIngredient.ingredientId);
        },
      );
      Promise.all(ingredientPromises)
        .then((ingredientsResponses) => {
          const details = ingredientsResponses.map((ingredientResponse) => ({
            id: ingredientResponse.data.getIngredientById.ingredientId,
            name: ingredientResponse.data.getIngredientById.name,
          }));
          setIngredientDetails(details);
          setTempIngredientDetails(details);
        })
        .catch((error) => console.error('Error fetching ingredients', error));
    }
  }, [dishData, dishId]);

  const getIngredientById = async (ingredientId) => {
    try {
      const response = await client.query({
        query: GET_INGREDIENT_BY_ID,
        variables: { id: ingredientId },
      });
      return response;
    } catch (error) {
      console.error('Error fetching ingredient by ID:', error);
      return null;
    }
  };

  const handleDishChange = (e) => {
    const { name, value, files } = e.target;
    if (name === 'imageFile') {
      setNewDish({ ...newDish, imageFile: files[0] });
    } else {
      setNewDish({ ...newDish, [name]: value });
    }
  };

  const decrementQuantity = () => {
    if (quantity > 1) {
      dispatch({ type: Action.DECREASE_ITEM, payload: { dishId } });
    } else if (quantity === 1) {
      dispatch({ type: Action.REMOVE_FROM_CART, payload: { dishId } });
    }
    dispatch({ type: Action.CALCULATE_TOTAL_PRICE });
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
        quantity: 1,
      };
      dispatch({ type: Action.ADD_TO_CART, payload: itemPayload });
    } else {
      dispatch({ type: Action.INCREASE_ITEM, payload: { dishId } });
    }
    dispatch({ type: Action.CALCULATE_TOTAL_PRICE });
  };

  const toggleCollapse = () => {
    setIsCollapsed(!isCollapsed);
  };

  const toggleEditMode = () => {
    if (isEditMode) {
      setTempIngredientDetails([...ingredientDetails]);
    }
    setIsEditMode(!isEditMode);
  };

  const handleIngredientChange = (event, index) => {
    const newName = event.target.value;
    const capitalizedNewName =
      newName.charAt(0).toUpperCase() + newName.slice(1);
    const newDetails = [...tempIngredientDetails];
    newDetails[index] = {
      ...newDetails[index],
      name: capitalizedNewName,
    };
    setTempIngredientDetails(newDetails);
  };

  const saveIngredients = async () => {
    const isAnyEmpty = tempIngredientDetails.some(
      (ingredient) => !ingredient.name.trim(),
    );
    if (isAnyEmpty) {
      alert('Ingredient names cannot be empty.');
      return;
    }
    let updatedIngredients = [...tempIngredientDetails];
    for (let i = 0; i < tempIngredientDetails.length; i++) {
      const ingredient = tempIngredientDetails[i];
      try {
        if (ingredient.isNew) {
          const response = await createIngredient({
            variables: {
              postIngredientDTO: {
                dishId: dishId,
                name: ingredient.name,
                unit: 'grams',
                quantityValue: 1,
              },
            },
          });
          updatedIngredients[i] = {
            ...ingredient,
            id: response.data.createLinkIngredientDish,
            isNew: false,
          };
        } else {
          await updateIngredient({
            variables: {
              updateIngredientDTO: {
                ingredientId: ingredient.id,
                name: ingredient.name,
              },
            },
          });
        }
      } catch (error) {
        console.error('Error saving ingredient:', error);
      }
    }
    setTempIngredientDetails(updatedIngredients);
    setIngredientDetails(updatedIngredients);
    setIsEditMode(false);
  };

  const addNewIngredient = () => {
    const newIngredientDetail = {
      id: Date.now(),
      name: '',
      isNew: true,
    };
    setTempIngredientDetails((prevIngredients) => [
      ...prevIngredients,
      newIngredientDetail,
    ]);
  };

  const deleteIngredientItem = async (dishId, ingredientId) => {
    const ingredientToDelete = tempIngredientDetails.find(
      (ingredient) => ingredient.id === ingredientId,
    );
    if (!ingredientToDelete.name.trim() || ingredientToDelete.isNew) {
      const updatedIngredients = tempIngredientDetails.filter(
        (ingredient) => ingredient.id !== ingredientId,
      );
      setTempIngredientDetails(updatedIngredients);
    } else {
      try {
        await deleteIngredient({
          variables: {
            deleteIngredientDTO: {
              dishId: dishId,
              ingredientId: ingredientId,
            },
          },
        });
        const updatedIngredients = tempIngredientDetails.filter(
          (ingredient) => ingredient.id !== ingredientId,
        );
        setTempIngredientDetails(updatedIngredients);
        setDeleteDialogOpen(false);
      } catch (error) {
        console.error('Error deleting ingredient:', error);
      }
    }
  };

  const handleCheckboxChange = (ingredientName, isChecked) => {
    setTempUnselectedIngredients((prev) => {
      const newUnselected = new Set(prev);
      if (isChecked) {
        newUnselected.delete(ingredientName);
      } else {
        newUnselected.add(ingredientName);
      }
      return newUnselected;
    });
  };

  const handleEditDishSubmit = async (newDishData) => {
    try {
      await updateDishes(newDishData);
      router.push('/');
    } catch (error) {
      console.error('Error updating dish:', error);
    }
    setIsEditMode(false);
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      className={styles.dishPopup}
      fullWidth
      maxWidth="md"
      sx={{
        '& .MuiDialog-paper': { borderRadius: '10px', overflow: 'hidden' },
      }}
    >
      <IconButton
        aria-label="close"
        onClick={onClose}
        sx={{
          position: 'absolute',
          right: '1.5rem',
          top: '1rem',
          backgroundColor: '#D3D3D3',
          '&:hover': { backgroundColor: '#BFBFBF' },
        }}
      >
        <CloseIcon />
      </IconButton>
      <DialogContent
        sx={{ padding: 0, overflowY: 'auto', backgroundColor: '#f4f4f4' }}
      >
        {isEditMode && userRole == 'ROLE_sys_admin' ? (
          <Box position="relative" display="inline-block">
            <img width="500px" height="auto" src={imageUrl} alt={dishName} />
            <Box
              sx={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                bgcolor: 'rgba(0, 0, 0, 0.5)',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                cursor: 'pointer',
              }}
            >
              <Input
                accept="image/*"
                style={{ display: 'none' }}
                id="icon-button-file"
                type="file"
                name="imageFile"
                onChange={handleDishChange}
              />
              <label htmlFor="icon-button-file">
                <IconButton
                  color="primary"
                  aria-label="upload picture"
                  component="span"
                >
                  <InsertPhotoOutlinedIcon
                    style={{ fontSize: 200, color: 'white' }}
                  />
                </IconButton>
              </label>
            </Box>
          </Box>
        ) : (
          <img width="500px" height="auto" src={imageUrl} alt={dishName} />
        )}
        <DialogContentText
          className={styles.dishTitle}
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          {isEditMode && userRole == 'ROLE_sys_admin' ? (
            <TextField
              fullWidth
              sx={{ mt: 2, mr: 3 }}
              variant="outlined"
              label="Dish Name"
              name="dishName"
              value={newDish.dishName}
              onChange={handleDishChange}
            />
          ) : (
            <Typography variant="h5">{dishName}</Typography>
          )}
          {userRole == 'ROLE_sys_admin' && (
            <Button
              onClick={toggleEditMode}
              variant="contained"
              sx={{
                backgroundColor: 'primary.main',
                color: '#f4f4f4',
                marginRight: 3,
                paddingInline: 2,
                fontWeight: 600,
                fontSize: '1.2rem',
              }}
            >
              Edit
            </Button>
          )}
        </DialogContentText>

        <DialogContentText
          className={styles.dishPrice}
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          {isEditMode && userRole == 'ROLE_sys_admin' ? (
            <TextField
              fullWidth
              sx={{ mt: 2, mr: 3 }}
              variant="outlined"
              label="Price"
              name="price"
              value={newDish.price}
              onChange={handleDishChange}
              type="number"
              inputProps={{ min: 0 }}
            />
          ) : (
            <Typography variant="h5">${price}</Typography>
          )}
        </DialogContentText>

        <DialogContentText className={styles.dishIngredients}>
          {isEditMode && userRole == 'ROLE_sys_admin' ? (
            <TextField
              fullWidth
              sx={{ mt: 2 }}
              multiline
              variant="outlined"
              label="Description"
              name="description"
              value={newDish.description}
              onChange={handleDishChange}
            />
          ) : (
            <Typography>{description}</Typography>
          )}
        </DialogContentText>
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            marginY: 2,
          }}
        >
          {isEditMode && userRole == 'ROLE_sys_admin' && (
            <Button
              onClick={() => handleEditDishSubmit(newDish)}
              variant="contained"
              sx={{
                color: '#f4f4f4',
                marginRight: 3,
                paddingInline: 2,
                width: '250px',
                fontWeight: 600,
                fontSize: '1.3rem',
                mb: 2,
              }}
            >
              Edit Dish
            </Button>
          )}
        </Box>

        <DialogContentText sx={{ overflowY: 'auto' }}>
          <Box
            sx={{
              backgroundColor: '#ededed',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              cursor: 'pointer',
              pt: 1,
              pb: 1,
            }}
            onClick={toggleCollapse}
          >
            <Typography
              variant="Ingredients"
              sx={{ ml: 4, color: 'black', fontSize: '1.2em', fontWeight: 600 }}
            >
              Ingredients,{' '}
              {isCollapsed ? 'Click to expand.' : 'Un-tick to remove.'}
            </Typography>
            <IconButton>
              {isCollapsed ? <AddIcon /> : <RemoveIcon />}
            </IconButton>
          </Box>
          <Collapse
            in={!isCollapsed}
            sx={{ ml: 2, color: '#666', marginBlock: 1, fontWeight: 400 }}
          >
            <List>
              {tempIngredientDetails.map((ingredient, index) => (
                <ListItem
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    width: '100%',
                    fontSize: 17,
                  }}
                  key={ingredient.id}
                >
                  <Box
                    sx={{
                      width: '100%',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                    }}
                  >
                    {isEditMode && userRole == 'ROLE_sys_admin' ? (
                      <Box
                        sx={{
                          width: '100%',
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                        }}
                      >
                        <TextField
                          label="Ingredient Name"
                          value={ingredient.name}
                          onChange={(e) => handleIngredientChange(e, index)}
                          sx={{ flexGrow: 1 }}
                        />

                        <HighlightOffRoundedIcon
                          onClick={() => {
                            if (!ingredient.name.trim() || ingredient.isNew) {
                              deleteIngredientItem(dishId, ingredient.id);
                            } else {
                              setSelectedIngredientId(ingredient.id);
                              setDeleteDialogOpen(true);
                            }
                          }}
                          sx={{
                            flexGrow: 1,
                            cursor: 'pointer',
                            transition: 'transform 0.3s ease-in-out',
                            '&:hover': { transform: 'rotate(90deg)' },
                          }}
                        />
                        <Dialog
                          open={deleteDialogOpen}
                          keepMounted
                          onClose={() => setDeleteDialogOpen(false)}
                          aria-describedby="alert-dialog-slide-description"
                        >
                          <DialogTitle>
                            {'Delete ingredient permanently'}
                          </DialogTitle>
                          <DialogContent>
                            <DialogContentText id="alert-dialog-slide-description">
                              If you confirm to delete this ingredient, it will
                              be permanently deleted. Do you want to delete it
                              right now?
                            </DialogContentText>
                          </DialogContent>
                          <DialogActions>
                            <Button onClick={() => setDeleteDialogOpen(false)}>
                              No
                            </Button>
                            <Button
                              onClick={() =>
                                deleteIngredientItem(
                                  dishId,
                                  selectedIngredientId,
                                )
                              }
                            >
                              Yes
                            </Button>
                          </DialogActions>
                        </Dialog>
                      </Box>
                    ) : (
                      <Typography sx={{ flexGrow: 1 }}>
                        {ingredient.name}
                      </Typography>
                    )}
                    <Checkbox
                      defaultChecked
                      onChange={(e) =>
                        handleCheckboxChange(ingredient.name, e.target.checked)
                      }
                      sx={{
                        color: 'primary.main',
                        '&.Mui-checked': {
                          color: 'primary.main',
                        },
                      }}
                    />
                  </Box>
                </ListItem>
              ))}
            </List>
            {isEditMode && userRole == 'ROLE_sys_admin' ? (
              <Box>
                <Box
                  onClick={addNewIngredient}
                  sx={{
                    backgroundColor: 'rgba(128, 128, 128, 0.2)',
                    marginInline: 2,
                    paddingBlock: 1,
                    mb: 1,
                    borderRadius: 1,
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    cursor: 'pointer',
                    '&:hover': {
                      backgroundColor: 'rgba(128, 128, 128, 0.25)',
                    },
                  }}
                >
                  <AddCircleRoundedIcon style={{ fontSize: 40 }} />
                </Box>

                <Button
                  onClick={() => saveIngredients()}
                  variant="contained"
                  sx={{
                    backgroundColor: 'primary.main',
                    color: '#f4f4f4',
                    width: '95%',
                    fontWeight: 600,
                    paddingBlock: 1.5,
                    fontSize: '1.3rem',
                    display: 'block',
                    marginTop: 1.5,
                    marginLeft: 'auto',
                    marginRight: 'auto',
                  }}
                >
                  Save Ingredients
                </Button>
              </Box>
            ) : null}
          </Collapse>
        </DialogContentText>
        <hr style={{ width: '100%' }} />
      </DialogContent>
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'flex-end',
          padding: '20px',
          backgroundColor: '#f4f4f4',
          borderTop: '1px solid #E0E0E0',
        }}
      >
        {quantity > 0 && (
          <Box
            sx={{
              mr: 14,
              backgroundColor: 'primary.main',
              fontSize: '25px',
              width: '230px',
              height: '50px',
              color: '#fff',
              borderRadius: '10px',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            <div>{price * quantity}</div>
          </Box>
        )}
        {quantity > 0 ? (
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              mr: 4,
              border: '1.5px solid #1976d2',
              borderRadius: '10px',
              width: '200px',
              height: '45px',
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
              primaryTypographyProps={{ fontWeight: 600 }}
              style={{ paddingLeft: '25%' }}
            />
            <IconButton
              onClick={handleAddToCart}
              sx={{ color: 'primary.main' }}
            >
              <AddIcon />
            </IconButton>
          </Box>
        ) : (
          <DialogActions style={{ padding: 0 }}>
            <Button
              sx={{
                mr: 4,
                backgroundColor: 'primary.main',
                fontSize: '25px',
                width: '200px',
                height: '45px',
                color: '#fff',
                borderRadius: '10px',
                '&:hover': {
                  backgroundColor: 'primary.main',
                  opacity: 0.6,
                  transition: '0.3s',
                },
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
              }}
              onClick={handleAddToCart}
            >
              <div>Add</div>
            </Button>
          </DialogActions>
        )}
      </Box>
    </Dialog>
  );
};

export default DishPopup;
