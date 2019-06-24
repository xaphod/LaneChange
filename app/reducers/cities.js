import { REHYDRATE } from 'redux-persist';
import * as Actions from 'app/actions';
import consolelog from 'app/utils/logging';

const unknownCity = {
  name: 'Unknown',
  email: '',
};

export default () => {
  const initialState = {
    cities: [],
    chosenCity: unknownCity,
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

      // location provided a city, check if we can match it and choose a city automatically
      // do not override a user-selected city, ie. chosenCity that isn't unknownCity
      case Actions.ACTION_TYPE_GOTCITY:
      {
        const { cities } = state;
        if (
          !cities ||
          !action.city ||
          !state.chosenCity ||
          state.chosenCity.name !== unknownCity.name
        ) {
          return state;
        }

        const gotCityMatch = new RegExp(`^${action.city}$`, 'i');
        const newState = {
          ...state,
        };
        cities.some((city) => {
          if (city.name && city.name.match(gotCityMatch)) {
            consolelog('DEBUG cities reducer: gotCity MATCH:');
            consolelog(city);
            newState.chosenCity = city;
            return true;
          }
          if (city.otherNames) {
            return city.otherNames.some((otherName) => {
              if (otherName.match(gotCityMatch)) {
                consolelog('DEBUG cities reducer: gotCity MATCH via otherNames:');
                consolelog(city);
                newState.chosenCity = city;
                return true;
              }
              return false;
            });
          }
          return false;
        });
        return newState;
      }

      default:
        return state;
    }
  };
};
