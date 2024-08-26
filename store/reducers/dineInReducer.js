import * as Action from '../actionTypes';
import dayjs from 'dayjs';

const initialState = {
  selectedDate: dayjs().format('YYYY-MM-DD'),
  selectedTime: dayjs().format('HH:mm'),
  name: '',
  phoneNumber: '',
  personCount: 0,
};

const dineInReducer = (state = initialState, { type, payload }) => {
  switch (type) {
    case Action.SET_DATE_DATA:
      return {
        ...state,
        selectedDate: payload,
      };
    case Action.SET_TIME_DATA:
      return {
        ...state,
        selectedTime: payload,
      };
    case Action.SET_PHONE_DATA:
      return {
        ...state,
        phoneNumber: payload,
      };
    case Action.SET_NAME_DATA:
      return {
        ...state,
        name: payload,
      };
    case Action.SET_PERSON_COUNT_DATA:
      return {
        ...state,
        personCount: payload,
      };
    default:
      return state;
  }
};

export default dineInReducer;
