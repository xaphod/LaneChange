import * as Actions from 'app/actions';

export const photoProgress = uri => ({
  type: Actions.ACTION_TYPE_PHOTO_PROGRESS,
  uri,
});

export const photoTakingFinished = () => ({
  type: Actions.ACTION_TYPE_PHOTO_TAKING_FINISHED,
});
