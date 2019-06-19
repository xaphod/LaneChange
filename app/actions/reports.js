import ActionSheet from 'react-native-action-sheet';
import { Platform } from 'react-native';
import * as Actions from 'app/actions';
import uploadReport from 'app/utils/firebase';
import { openEmail, IOSPreferredMailClient } from 'app/utils/mail';

export const createReport = (date, photo) => ({
  type: Actions.ACTION_TYPE_CREATE_REPORT,
  photo,
  date,
});

const emailReportContinued = async (dispatch, report, navigation, iOSMailClient) => {
  let error;
  try {
    dispatch({
      type: Actions.ACTION_TYPE_EMAIL_PROGRESS,
      report,
      progress: 0,
    });
    const emailSuccess = await openEmail(report, iOSMailClient); // does not throw, just returns false
    if (!emailSuccess) {
      error = new Error('Could not open the created email. Please check that your device is configured to send email.');
    }
  } catch (e) {
    console.log(`DEBUG emailReport: ERROR: ${e}`);
    error = e;
  } finally {
    dispatch({
      type: Actions.ACTION_TYPE_EMAIL_REPORT,
      report,
      error,
      navigation,
    });
  }
};

export const emailReport = (report, navigation) => async (dispatch, getState) => {
  console.log('DEBUG emailReport action start');
  if (Platform.OS !== 'ios') {
    emailReportContinued(dispatch, report, navigation);
    return;
  }

  const { reports } = getState();
  let { iOSMailClient } = reports;
  if (iOSMailClient) {
    emailReportContinued(dispatch, report, navigation, iOSMailClient);
    return;
  }

  ActionSheet.showActionSheetWithOptions({
    options: [
      'Cancel',
      'Use Mail app',
      'Use Gmail app',
    ],
    cancelButtonIndex: 0,
  },
  (buttonIndex) => {
    if (!buttonIndex || buttonIndex === 0) {
      // case: android user touched outside of popup
      return;
    }
    switch (buttonIndex) {
      case 1:
        iOSMailClient = IOSPreferredMailClient.NATIVE;
        break;
      case 2:
        iOSMailClient = IOSPreferredMailClient.GMAIL;
        break;
      default:
        iOSMailClient = IOSPreferredMailClient.NATIVE;
        break;
    }

    dispatch({
      type: Actions.ACTION_TYPE_CHOSE_IOS_MAIL_CLIENT,
      iOSMailClient,
    });
    emailReportContinued(dispatch, report, navigation, iOSMailClient);
  });
};

export const cancelReport = navigation => ({
  type: Actions.ACTION_TYPE_CANCEL_REPORT,
  navigation,
});

export const expandInDraftReport = expand => ({
  type: Actions.ACTION_TYPE_EXPAND_IN_DRAFTREPORT,
  expand,
});

export const submitReport = (reportIn, navigation) => async (dispatch) => {
  const report = reportIn;
  let error;

  try {
    dispatch({
      type: Actions.ACTION_TYPE_SUBMIT_PROGRESS,
      report,
      progress: 0,
    });

    const { firebaseImageURI, docRef } = await uploadReport(report, (progress) => {
      dispatch({
        type: Actions.ACTION_TYPE_SUBMIT_PROGRESS,
        report,
        progress,
      });
    });
    console.log(`DEBUG submitReport: uploadReport successful. imageLink: ${firebaseImageURI}`);
    report.imageLink = firebaseImageURI;
    report.docRef = docRef;
  } catch (e) {
    console.log(`DEBUG submitReport: ERROR: ${e}`);
    error = e;
  } finally {
    dispatch({
      type: Actions.ACTION_TYPE_SUBMIT_REPORT,
      report,
      error,
      navigation,
    });

    if (!error && report.docRef) {
      dispatch(emailReport(report, navigation));
    }
  }
};
