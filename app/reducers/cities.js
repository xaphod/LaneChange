import { REHYDRATE } from 'redux-persist';
import * as Actions from 'app/actions';
import consolelog from 'app/utils/logging';

export default () => {
  const initialState = {
    cities: [],
    chosenCity: {
      name: 'Unknown',
      email: '',
    },
    retrievedCities: false,
    retreivingCities: false,
  };

  return (state = initialState, action) => {
    switch (action.type) {
      case REHYDRATE:
      { // ACHTUNG: if you implement REHYDRATE you are responsible for doing ALL of it
        if (!action.payload || !action.payload.cities) {
          return state;
        }
        const retval = {
          ...state, // initialState above
          ...action.payload.cities,
          retrievedCities: false,
          retreivingCities: false,
        };
        consolelog('DEBUG City reducer: rehydrated state is');
        consolelog(retval);
        return retval;
      }

      case Actions.ACTION_TYPE_RETRIEVING_CITIES:
        return {
          ...state,
          retreivingCities: true,
        };

      case Actions.ACTION_TYPE_RETRIEVING_CITIES_DONE:
        return {
          ...state,
          retreivingCities: undefined,
        };

      case Actions.ACTION_TYPE_RETRIEVED_CITIES:
        if (action.cities) {
          return {
            ...state,
            cities: action.cities,
            retrievedCities: true,
          };
        }
        return state;

      case Actions.ACTION_TYPE_SET_CHOSENCITY:
      {
        if (!action.city) {
          consolelog('DEBUG City reducer: ERROR, must not set falsey city!');
          return state;
        }

        const newState = {
          ...state,
          chosenCity: action.city,
        };
        return newState;
      }

      default:
        return state;
    }
  };
};
