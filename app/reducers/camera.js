import * as Actions from 'app/actions';

export default () => {
  const initialState = {
  };

  return (state = initialState, action) => {
    switch (action.type) {
      case Actions.ACTION_TYPE_PHOTO_PROGRESS:
      {
        return {
          ...state,
          inProgress: {
            type: 'photo',
          },
        };
      }

      case Actions.ACTION_TYPE_PHOTO_TAKEN:
      {
        return {
          ...state,
          photo: action.photo,
          inProgress: undefined,
        };
      }

      default:
        return state;
    }
  };
};
