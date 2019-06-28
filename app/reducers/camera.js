import { REHYDRATE } from 'redux-persist';
import * as Actions from 'app/actions';

export default () => {
  const initialState = {
  };

  return (state = initialState, action) => {
    switch (action.type) {
      case REHYDRATE:
      { // ACHTUNG: if you implement REHYDRATE you are responsible for doing ALL of it
        if (!action.payload || !action.payload.camera) {
          return state;
        }
        const retval = {
          ...state, // initialState above
          ...action.payload.camera,
          inProgress: undefined,
        };
        return retval;
      }

      case Actions.ACTION_TYPE_PHOTO_PROGRESS:
      {
        return {
          ...state,
          inProgress: {
            type: 'photo',
            uri: action.uri,
          },
        };
      }

      case Actions.ACTION_TYPE_PHOTO_TAKING_FINISHED:
      {
        return {
          ...state,
          inProgress: undefined,
        };
      }

      default:
        return state;
    }
  };
};
