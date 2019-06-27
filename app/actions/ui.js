import * as Actions from 'app/actions';

export const navigateToReport = () => ({
  type: Actions.ACTION_TYPE_NAVIGATE_TO_REPORT,
});

export const setShareText = text => ({
  type: Actions.ACTION_TYPE_SET_SHARETEXT,
  text,
});
