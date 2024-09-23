import * as Action from '../actionTypes';
import dayjs from 'dayjs';

interface DineInState {
  selectedDate: string;
  selectedTime: string;
  name: string;
  phoneNumber: string;
  personCount: number;
}

const initialState: DineInState = {
  selectedDate: dayjs().format('YYYY-MM-DD'),
  selectedTime: dayjs().format('HH:mm'),
  name: '',
  phoneNumber: '',
  personCount: 0,
};

type DineInAction =
  | { type: typeof Action.SET_DATE_DATA; payload: string }
  | { type: typeof Action.SET_TIME_DATA; payload: string }
  | { type: typeof Action.SET_PHONE_DATA; payload: string }
  | { type: typeof Action.SET_NAME_DATA; payload: string }
  | { type: typeof Action.SET_PERSON_COUNT_DATA; payload: number };

const dineInReducer = (
  state: DineInState = initialState,
  { type, payload }: DineInAction,
): DineInState => {
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
