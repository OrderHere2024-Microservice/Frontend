import http from '../utils/axios';
import { gql } from '@apollo/client';

const getIngredientsByDish = (dishId) =>
  http(`/v1/public/ingredients/dish/${dishId}`, { method: 'GET' });

const getIngredient = (ingredientId) =>
  http(`/v1/public/ingredients/${ingredientId}`, { method: 'GET' });

const createIngredient = (ingredientData) =>
  http(`/v1/public/ingredients`, {
    method: 'POST',
    data: ingredientData,
  });

const updateIngredient = (ingredient) =>
  http(`/v1/public/ingredients/update`, {
    method: 'PUT',
    data: ingredient,
  });

const deleteIngredient = (ingredientInfo) =>
  http(`/v1/public/ingredients/delete`, {
    method: 'DELETE',
    data: ingredientInfo,
  });

export const GET_INGREDIENTS_BY_DISH_ID = gql`
  query GetIngredientsByDishID($dishID: Int!) {
    findIngredientsByDishID(dishID: $dishID) {
      linkIngredientDishId
      dishId
      ingredientId
      quantityValue
      quantityUnit
    }
  }
`;

export const GET_INGREDIENT_BY_ID = gql`
  query GetIngredientById($id: Int!) {
    getIngredientById(id: $id) {
      ingredientId
      name
    }
  }
`;

export const CREATE_INGREDIENT = gql`
  mutation CreateIngredient($postIngredientDTO: PostIngredientInput!) {
    createLinkIngredientDish(postIngredientDTO: $postIngredientDTO)
  }
`;

export const UPDATE_INGREDIENT = gql`
  mutation UpdateIngredient($updateIngredientDTO: UpdateIngredientInput!) {
    updateIngredient(updateIngredientDTO: $updateIngredientDTO) {
      ingredientId
      name
    }
  }
`;

export const DELETE_INGREDIENT = gql`
  mutation DeleteIngredient($deleteIngredientDTO: DeleteIngredientInput!) {
    deleteIngredientLink(deleteIngredientDTO: $deleteIngredientDTO)
  }
`;
