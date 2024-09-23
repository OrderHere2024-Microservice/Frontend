import * as Action from '../actionTypes';
import dayjs from 'dayjs';

interface PickupState {
  selectedDate: string;
  selectedTime: string;
}

const initialState: PickupState = {
  selectedDate: dayjs().format('YYYY-MM-DD'),
  selectedTime: dayjs().format('HH:mm'),
};

type PickupAction =
  | { type: typeof Action.SET_PICK_UP_DATE; payload: string }
  | { type: typeof Action.SET_PICK_UP_TIME; payload: string };

const pickupReducer = (
  state: PickupState = initialState,
  { type, payload }: PickupAction,
): PickupState => {
  switch (type) {
    case Action.SET_PICK_UP_DATE:
      return {
        ...state,
        selectedDate: payload,
      };
    case Action.SET_PICK_UP_TIME:
      return {
        ...state,
        selectedTime: payload,
      };
    default:
      return state;
  }
};

export default pickupReducer;
