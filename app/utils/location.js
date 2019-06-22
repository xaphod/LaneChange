import RNLocation from 'react-native-location';
import { googleMapsAPIKey } from 'app/utils/keys';
import consolelog from 'app/utils/logging';

const getAddressComponent = (address_components, componentName) => {
  return address_components.find(
    component => component.types && component.types.find(type => type === componentName)
  );
};

export const reverseGeocode = async (latitude, longitude) => {
  try {
    const response = await fetch(`https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=${googleMapsAPIKey}`);
    const json = await response.json();

    consolelog(`DEBUG reverseGeocode:`);
    consolelog(json);
    const { results } = json;
    const firstResult = results.find(() => true);
    if (!firstResult) {
      consolelog('DEBUG reverseGeocode: no results');
      return undefined;
    }

    const { formatted_address, address_components } = firstResult;
    let streetNumber, route, locality;
    if (address_components) {
      let component;
      component = getAddressComponent(address_components, 'street_number');
      if (component && component.short_name) {
        streetNumber = component.short_name;
      }
      component = getAddressComponent(address_components, 'route');
      if (component && component.short_name) {
        route = component.short_name;
      }
      component = getAddressComponent(address_components, 'locality');
      if (component && component.short_name) {
        locality = component.short_name;
      }
    }
    const result = { address: formatted_address };
    if (streetNumber && route && locality) {
      result.addressShort = `${streetNumber} ${route}, ${locality}`;
    }
    if (locality) {
      result.city = locality;
    }

    consolelog('DEBUG reverseGeocode result:');
    consolelog(result);
    return result;
  } catch (e) {
    consolelog('ERROR reverseGeocode:');
    consolelog(e);
  }
};

export const getLocation = async () => {
  try {
    const granted = await RNLocation.requestPermission({
      ios: 'whenInUse',
      android: {
        detail: 'fine',
        rationale: {
          title: 'Add the location to your report',
          message: 'PLEASE READ: Your location must be added to the report for it to be usable. If you do not allow the app access to your location then you must manually enter the location of the photo. The app only accesses your location at the moment you take a photo for a report.',
          buttonPositive: 'Add Location',
          buttonNegative: 'No thanks',
        },
      },
    });
    if (!granted) {
      consolelog('DEBUG getLocation: location permission NOT GRANTED');
      return undefined;
    }

    const latestLocation = await RNLocation.getLatestLocation({ timeout: 1500 });

    if (!latestLocation || !latestLocation.longitude || !latestLocation.latitude) {
      consolelog('DEBUG getLocation: NO location found');
      return undefined;
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

    consolelog('DEBUG getLocation:doing reverse geocode of location:');
    consolelog(latestLocation);
    const result = await reverseGeocode(latestLocation.latitude, latestLocation.longitude);

    return {
      ...latestLocation,
      ...result,
    };
  } catch (e) {
    consolelog('ERROR getLocation:');
    consolelog(e);
  }
};
