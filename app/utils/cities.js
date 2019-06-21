import { AsyncStorage } from 'react-native'
import { defaultCity } from 'app/utils/constants';
import { getCities } from 'app/utils/firebase';

const chosenCityKey = 'laneChange.city';

let cities; // ARRAY of objects
let chosenCity = defaultCity;
let retrievedCities = false;
let retreivingCities = false;

export const cityEmailAddress = () => {
  const { email } = chosenCity;
  return email;
};

export const cityName = () => {
  let { name } = chosenCity;
  if (!name) {
    console.log('NO CITY!');
    console.log(chosenCity);
    return 'unknown';
  }
  // danger: is used as firebase storage ref & firestore collection string (alphanumerics only)
  name = name.replace(/[^ a-z0-9+]+/gi, '');
  if (__DEV__) {
    return `${name}-testing`;
  }
  return name;
};

// ENTRY POINT
export const retrieveCities = async () => {
  if (retrievedCities || retreivingCities) {
    console.log('DEBUG retrieveCities: no-op, already retrieved/retrieving');
    return;
  }

  retreivingCities = true;
  console.log('DEBUG retrieveCities: retrieving cities');

  try {
    const storedChosenCity = JSON.parse(await AsyncStorage.getItem(chosenCityKey));
    if (storedChosenCity) {
      console.log('DEBUG retrieveCities: loaded stored city:');
      console.log(storedChosenCity);

      if (chosenCity.name === defaultCity.name) { // only overwrite if default
        chosenCity = storedChosenCity;
      } else {
        console.log('DEBUG retrieveCities: NOT using stored city as default is not chosen at the moment');
      }
    }

    cities = await getCities();
    retrievedCities = true;
    console.log('DEBUG retrieveCities: retrieved cities:');
    console.log(cities);
  } catch (e) {
    console.log('DEBUG retrieveCities ERROR:');
    console.log(e);
  } finally {
    retreivingCities = false;
  }
};

export const listCities = () => {
  console.log('listCities:');
  console.log(cities);
  return cities;
};

export const getChosenCity = () => chosenCity;

export const setChosenCity = async (city) => {
  try {
    console.log('DEBUG setChosenCity: setting to');
    console.log(city);
    await AsyncStorage.setItem(chosenCityKey, JSON.stringify(city));
  } catch (e) {
    console.log('DEBUG setChosenCity ERROR:');
    console.log(e);
  } finally {
    chosenCity = city;

    console.log('setChosenCity, after - cities is:');
    console.log(cities);
  }
};
