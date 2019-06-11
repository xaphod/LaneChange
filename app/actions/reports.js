import * as Actions from 'app/actions';

export const createReport = (date, photo) => ({
  type: Actions.ACTION_TYPE_CREATE_REPORT,
  photo,
  date,
});

export const submitReport = report => ({
  type: Actions.ACTION_TYPE_SUBMIT_REPORT,
  report,
});

export const cancelReport = () => ({
  type: Actions.ACTION_TYPE_CANCEL_REPORT,
});
