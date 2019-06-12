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
    let error = null;

    try {
      const imageLink = await uploadReport(report);
      console.log(`DEBUG submitReport: uploadReport yielded imageLink: ${imageLink}`);
      report.imageLink = imageLink;

      const emailSuccess = await emailReport(report); // does not throw, just returns false
      if (!emailSuccess) {
        error = new Error('Could not open the created email. Please check that your device is configured to send email.');
      }
    } catch (e) {
      console.log(`DEBUG submitReport: uploadReport ERROR: ${e}`);
      error = e;
    } finally {
      dispatch({
        type: Actions.ACTION_TYPE_SUBMIT_REPORT,
        report,
        error,
        navigation,
      });
    }
  };
};

export const cancelReport = navigation => ({
  type: Actions.ACTION_TYPE_CANCEL_REPORT,
  navigation,
});
