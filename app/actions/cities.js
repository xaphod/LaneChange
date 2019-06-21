import * as Actions from 'app/actions';
import { getCities } from 'app/utils/firebase';

export const retrieveCities = () => async (dispatch) => {
  console.log('DEBUG retrieveCities: retrieving cities');
  dispatch({
    type: Actions.ACTION_TYPE_RETRIEVING_CITIES,
  });

  try {
    const cities = await getCities();
    dispatch({
      type: Actions.ACTION_TYPE_RETRIEVED_CITIES,
      cities,
    });
  } catch (e) {
    console.log('DEBUG retrieveCities ERROR:');
    console.log(e);
  } finally {
    dispatch({
      type: Actions.ACTION_TYPE_RETRIEVING_CITIES_DONE,
    });
  }
};

export const setChosenCity = city => ({
  type: Actions.ACTION_TYPE_SET_CHOSENCITY,
  city,
});
