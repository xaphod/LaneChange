import RNLocation from 'react-native-location';
import { googleMapsAPIKey } from 'app/utils/keys';

export const reverseGeocode = async (latitude, longitude) => {
  const response = await fetch(`https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=${googleMapsAPIKey}`)
    .catch((e) => {
      throw e;
    });

  const json = await response.json();
  console.log(`DEBUG reverseGeocode:`);
  console.log(json);
  const { results } = json;
  const firstResult = results.find(() => true);
  if (!firstResult) {
    console.log('DEBUG reverseGeocode: no results');
    return null;
  }
  const { formatted_address } = firstResult;
  console.log(`DEBUG reverseGeocode chosen adddress: ${formatted_address}`);
  return formatted_address;
};

export const getLocation = async () => {
  // RNLocation.configure({
  // });
  const granted = await RNLocation.requestPermission({
    ios: 'whenInUse',
    android: {
      detail: 'fine',
      rationale: {
        title: 'Add the location to your report',
        message: 'Please allow the app to add your current location to the report.',
        buttonPositive: 'Add Location',
        buttonNegative: 'No thanks',
      },
    },
  });
  if (!granted) {
    console.log('DEBUG getLocation: location permission NOT GRANTED');
    return null;
  }

  const latestLocation = await RNLocation.getLatestLocation({ timeout: 1500 })
    .catch((e) => {
      console.log('DEBUG getLocation: ERROR getting location:');
      console.log(e);
      return null;
    });

  if (!latestLocation || !latestLocation.longitude || !latestLocation.latitude) {
    console.log('DEBUG getLocation: NO location found');
    return null;
  }

  /* Example location returned
  {
    speed: -1,
    longitude: -0.1337,
    latitude: 51.50998,
    accuracy: 5,
    heading: -1,
    altitude: 0,
    altitudeAccuracy: -1
    floor: 0
    timestamp: 1446007304457.029
  }
  */
  // TODO: test, potentially throw away if bad timestamp, or accuracy etc

  console.log('DEBUG getLocation:doing reverse geocode of location:');
  console.log(latestLocation);
  const address = await reverseGeocode(latestLocation.latitude, latestLocation.longitude);
  return {
    address,
    ...latestLocation,
  };
};
