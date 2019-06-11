import * as Actions from 'app/actions';
import { emailReport } from 'app/utils/mail';
import uploadReport from 'app/utils/firebase';

export default () => {
  const initialState = {
    draftReport: null,
  };

  return (state = initialState, action) => {
    switch (action.type) {
      case Actions.ACTION_TYPE_CREATE_REPORT:
        return {
          ...state,
          draftReport: {
            photo: action.photo,
            date: action.date,
          },
        };

      case Actions.ACTION_TYPE_SUBMIT_REPORT:
        if (action.report) {
          const { report } = action;
          uploadReport(report)
            .then((imageLink) => {
              console.log(`DEBUG reports reducer: uploadReport yielded imageLink: ${imageLink}`);
              report.imageLink = imageLink;
              emailReport(action.report);
            })
            .catch((e) => {
              console.log(`DEBUG reports reducer: uploadReport ERROR: ${e}`);
              emailReport(action.report);
            });
        }

        return {
          ...state,
          draftReport: null,
        };

      case Actions.ACTION_TYPE_CANCEL_REPORT:
        return {
          ...state,
          draftReport: null,
        };

      default:
        return state;
    }
  };
};
