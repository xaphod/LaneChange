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
    console.error('NO CITY!');
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
    console.log('DEBUG populateCities: no-op, already retrieved/retrieving');
    return;
  }

  retreivingCities = true;
  console.log('DEBUG populateCities: retrieving cities');

  try {
    const storedChosenCity = await AsyncStorage.getItem(chosenCityKey);
    if (storedChosenCity && chosenCity === defaultCity) {
      console.log('DEBUG populateCities: loaded stored chosen city:');
      console.log(storedChosenCity);
      chosenCity = storedChosenCity;
    }
    
    cities = await getCities();
    retrievedCities = true;
    console.log('DEBUG populateCities: retrieved cities:');
    console.log(cities);
  } catch (e) {
    console.log('DEBUG populateCities ERROR:');
    console.log(e);
  } finally {
    retreivingCities = false;
  }
};

export const listCities = () => cities;

