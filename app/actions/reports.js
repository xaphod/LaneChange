import * as Actions from 'app/actions';
import { emailReport } from 'app/utils/mail';
import uploadReport from 'app/utils/firebase';

export const createReport = (date, photo) => ({
  type: Actions.ACTION_TYPE_CREATE_REPORT,
  photo,
  date,
});

export const submitReport = (reportIn, navigation) => {
  return async (dispatch) => {
    const report = reportIn;
    try {
      const imageLink = await uploadReport(report);
      console.log(`DEBUG submitReport: uploadReport yielded imageLink: ${imageLink}`);
      report.imageLink = imageLink;
    } catch (e) {
      console.log(`DEBUG submitReport: uploadReport ERROR: ${e}`);
    } finally {
      const success = await emailReport(report);

      dispatch({
        type: Actions.ACTION_TYPE_SUBMIT_REPORT,
        report,
        success,
        navigation,
      });
    }
  };
};

export const cancelReport = navigation => ({
  type: Actions.ACTION_TYPE_CANCEL_REPORT,
  navigation,
});
