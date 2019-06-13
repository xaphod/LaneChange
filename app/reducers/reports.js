import * as Actions from 'app/actions';

export default () => {
  const initialState = {
    draftReport: null,
    id: 0,
  };

  return (state = initialState, action) => {
    let { id } = state;

    switch (action.type) {
      case Actions.ACTION_TYPE_CREATE_REPORT:
        id += 1;
        return {
          ...state,
          id,
          draftReport: {
            photo: action.photo,
            date: action.date,
            id,
          },
        };

      case Actions.ACTION_TYPE_SUBMIT_REPORT:
      {
        let { draftReport } = state;
        if (!action.error) {
          draftReport = null;
          // const { navigation } = action;
          // navigation.popToTop();
        }

        return {
          ...state,
          draftReport,
          lastSubmit: {
            error: action.error,
            report: action.report,
          },
        };
      }

      case Actions.ACTION_TYPE_CANCEL_REPORT:
      {
        // const { navigation } = action;
        // navigation.popToTop();
        return {
          ...state,
          draftReport: null,
          lastSubmit: null,
        };
      }

      default:
        return state;
    }
  };
};
