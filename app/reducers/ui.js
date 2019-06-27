import { REHYDRATE } from 'redux-persist';
import * as Actions from 'app/actions';
import { defaultShareText } from 'app/utils/constants';

export default () => {
  const initialState = {
    startScreenShown: false,
    shareText: defaultShareText,
  };

  return (state = initialState, action) => {
    switch (action.type) {
      case REHYDRATE:
      { // ACHTUNG: if you implement REHYDRATE you are responsible for doing ALL of it
        if (!action.payload || !action.payload.ui) {
          return state;
        }
        const retval = {
          ...state, // initialState above
          ...action.payload.ui,
        };
        if (!retval.shareText) {
          consolelog('UI reducer: setting defaultShareText');
          retval.shareText = defaultShareText;
        }
        return retval;
      }

      case Actions.ACTION_TYPE_NAVIGATE_TO_REPORT:
        return {
          ...state,
          startScreenShown: true,
          termsAlertShown: true,
        };

      case Actions.ACTION_TYPE_SET_SHARETEXT:
        return {
          ...state,
          shareText: action.text,
        };

      default:
        return state;
    }
  };
};
