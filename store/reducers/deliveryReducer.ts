import * as Action from '../actionTypes';

interface AddressData {
  address: string;
  name: string;
  phone: string;
}

interface DeliveryState {
  addressData: AddressData;
  noteData: string;
}

const initialState: DeliveryState = {
  addressData: {
    address: '',
    name: '',
    phone: '',
  },
  noteData: '',
};

type DeliveryAction =
  | { type: typeof Action.SET_ADDRESS_DATA; payload: AddressData }
  | { type: typeof Action.SET_NOTE_DATA; payload: string };

const deliveryReducer = (
  state: DeliveryState = initialState,
  { type, payload }: DeliveryAction,
): DeliveryState => {
  switch (type) {
    case Action.SET_ADDRESS_DATA:
      return {
        ...state,
        addressData: payload,
      };

    case Action.SET_NOTE_DATA:
      return {
        ...state,
        noteData: payload,
      };
    default:
      return state;
  }
};

export default deliveryReducer;
