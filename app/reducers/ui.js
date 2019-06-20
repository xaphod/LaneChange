import * as Actions from 'app/actions';

export default () => {
  const initialState = {
    startScreenShown: false,
  };

  return (state = initialState, action) => {
    switch (action.type) {
      case Actions.ACTION_TYPE_NAVIGATE_TO_REPORT:
        action.navigation.navigate('Report');
        return {
          ...state,
          startScreenShown: true,
        };

      default:
        return state;
    }
  };
};
