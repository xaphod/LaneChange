import { REHYDRATE } from 'redux-persist';
import * as Actions from 'app/actions';
import { defaultCity } from 'app/utils/constants';

export default () => {
  const initialState = {
    cities: [],
    chosenCity: defaultCity,
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
        if (!state.chosenCity || !state.chosenCity.name || !state.chosenCity.email) {
          console.warn('MAJOR PROBLEM (city reducer): hydrated chosenCity has no name/email! reverting to default...');
          retval.chosenCity = defaultCity;
        }
        console.log('DEBUG City reducer: rehydrated state is');
        console.log(retval);
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
          console.log('DEBUG City reducer: ERROR, must not set falsey city!');
          return state;
        }

        const newState = {
          ...state,
          chosenCity: action.city,
        };
        const { name } = action.city;
        if (!name) {
          console.log('DEBUG City reducer: NO CITY NAME!');
          console.log(action.city);
          newState.chosenCity.name = 'unknown';
        }
        return newState;
      }

      default:
        return state;
    }
  };
};
