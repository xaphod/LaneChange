import { googleMapsAPIKey } from 'app/utils/keys';

export default reverseGeocode = async (latitude, longitude) => {
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
  console.log(`DEBUG createReport chosen adddress: ${formatted_address}`);
  return formatted_address;
};
