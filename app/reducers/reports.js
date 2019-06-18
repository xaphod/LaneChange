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
          inProgress: undefined,
        };

      case Actions.ACTION_TYPE_EXPAND_IN_DRAFTREPORT:
      {
        const { draftReport } = state;
        return {
          ...state,
          draftReport: {
            ...draftReport,
            ...action.expand,
          },
        };
      }

      case Actions.ACTION_TYPE_SUBMIT_PROGRESS:
      {
        return {
          ...state,
          inProgress: {
            type: 'submit',
            percent: action.progress,
          },
        };
      }

      case Actions.ACTION_TYPE_SUBMIT_REPORT:
      {
        return {
          ...state,
          lastSubmit: {
            error: action.error,
            report: action.report,
          },
          inProgress: undefined,
        };
      }

      case Actions.ACTION_TYPE_EMAIL_PROGRESS:
      {
        return {
          ...state,
          inProgress: {
            type: 'email',
            percent: action.progress,
          },
        };
      }

      case Actions.ACTION_TYPE_EMAIL_REPORT:
      {
        const { lastSubmit } = state;
        if (!action.error && lastSubmit) {
          // const { navigation } = action;
          // navigation.popToTop();

          return {
            ...state,
            draftReport: undefined,
            lastSubmit: {
              ...lastSubmit,
              report: action.report,
              didEmail: true,
            },
            inProgress: undefined,
          };
        }
        return {
          ...state,
          lastSubmit: {
            ...lastSubmit,
            report: action.report,
            error: action.error,
          },
          inProgress: undefined,
        };
      }

      case Actions.ACTION_TYPE_CANCEL_REPORT:
      {
        // const { navigation } = action;
        // navigation.popToTop();
        return {
          ...state,
          draftReport: undefined,
          lastSubmit: undefined,
          inProgress: undefined,
        };
      }

      default:
        return state;
    }
  };
};
