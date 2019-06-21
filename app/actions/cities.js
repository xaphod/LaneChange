import * as Actions from 'app/actions';
import { getCities } from 'app/utils/firebase';
import consolelog from 'app/utils/logging';

export const retrieveCities = () => async (dispatch) => {
  consolelog('DEBUG retrieveCities: retrieving cities');
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
    consolelog('DEBUG retrieveCities ERROR:');
    consolelog(e);
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
