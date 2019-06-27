import ActionSheet from 'react-native-action-sheet';
import { Platform } from 'react-native';
import RNFS from 'react-native-fs';
import * as Actions from 'app/actions';
import { uploadReport, deleteUserData } from 'app/utils/firebase';
import { openEmail, IOSPreferredMailClient } from 'app/utils/mail';
import { deletePhotosFromDisk } from 'app/utils/filesystem';
import consolelog from 'app/utils/logging';

export const createReport = (date, photo) => ({
  type: Actions.ACTION_TYPE_CREATE_REPORT,
  photo,
  date,
});

const emailReportContinued = async (dispatch, emailAddress, report, iOSMailClient) => {
  let error;
  try {
    dispatch({
      type: Actions.ACTION_TYPE_EMAIL_PROGRESS,
      report,
      progress: 0,
    });
    const emailSuccess = await openEmail(emailAddress, report, iOSMailClient); // does not throw, just returns false
    if (!emailSuccess) {
      error = new Error('Could not open the created email. Please check that your device is configured to send email.');
    }
  } catch (e) {
    consolelog(`DEBUG emailReport: ERROR: ${e}`);
    error = e;
  } finally {
    dispatch({
      type: Actions.ACTION_TYPE_EMAIL_REPORT,
      report,
      error,
    });
  }
};

export const emailReport = (emailAddress, report, iOSMailClientIn) => async (dispatch) => {
  consolelog('DEBUG emailReport action start');
  let iOSMailClient = iOSMailClientIn;
  if (Platform.OS !== 'ios') {
    emailReportContinued(dispatch, emailAddress, report);
    return;
  }

  if (iOSMailClient) {
    emailReportContinued(dispatch, emailAddress, report, iOSMailClient);
    return;
  }

  ActionSheet.showActionSheetWithOptions({
    options: [
      'Cancel',
      'Use Mail app (recommended)',
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
    emailReportContinued(dispatch, emailAddress, report, iOSMailClient);
  });
};

export const cancelReport = (isTrash = false) => {
  if (isTrash) {
    deletePhotosFromDisk();
  }
  return {
    type: Actions.ACTION_TYPE_CANCEL_REPORT,
    isTrash,
  };
};

export const expandInDraftReport = expand => ({
  type: Actions.ACTION_TYPE_EXPAND_IN_DRAFTREPORT,
  expand,
});

export const submitReport = (emailAddress, reportIn, iOSMailClient) => async (dispatch) => {
  const report = reportIn;
  let error;

  try {
    dispatch({
      type: Actions.ACTION_TYPE_SUBMIT_PROGRESS,
      report,
      progress: 0,
    });

    const { firebaseImageURI, docRef } = await uploadReport(report, (progress) => {
      // warning, this can fire multiple times AFTER final error has occurred
    }).catch((e) => {
      throw e;
    });
    consolelog(`DEBUG submitReport: uploadReport successful. imageLink: ${firebaseImageURI}`);
    report.imageLink = firebaseImageURI;
    report.docRef = docRef;
  } catch (e) {
    consolelog(`DEBUG submitReport: ERROR: ${e.message}`);
    error = e;
  } finally {
    const { imageURIOnDisk } = report;
    await RNFS.unlink(imageURIOnDisk)
      .catch((err) => {
        consolelog(`DEBUG submitReport: ERROR deleting imageURIOnDisk: ${err.message}`);
      });

    dispatch({
      type: Actions.ACTION_TYPE_SUBMIT_REPORT,
      report,
      error,
    });

    if (!error && report.docRef) {
      dispatch(emailReport(emailAddress, report, iOSMailClient));
    }
  }
};

export const deleteAllData = () => async (dispatch) => {
  dispatch({
    type: Actions.ACTION_TYPE_CANCEL_REPORT,
  });
  dispatch({
    type: Actions.ACTION_TYPE_DELETE_PROGRESS,
  });

  await deletePhotosFromDisk();

  let error;
  await deleteUserData()
    .catch((e) => {
      consolelog('DEBUG deleteAllData: caught error:');
      consolelog(e);
      error = e;
    });

  dispatch({
    type: Actions.ACTION_TYPE_DELETE_COMPLETE,
    error,
  });
};

export const deleteClear = () => ({
  type: Actions.ACTION_TYPE_DELETE_CLEAR,
});
