import * as Actions from 'app/actions';

export default () => {
  const initialState = {
    startScreenShown: false,
  };

  return (state = initialState, action) => {
    switch (action.type) {
      case Actions.ACTION_TYPE_CREATE_REPORT:
        return {
          ...state,
        };

      default:
        return state;
    }
  };
};
