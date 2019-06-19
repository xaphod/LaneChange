import * as Actions from 'app/actions';

export const photoProgress = () => ({
  type: Actions.ACTION_TYPE_PHOTO_PROGRESS,
});

export const photoTaken = photo => ({
  type: Actions.ACTION_TYPE_PHOTO_TAKEN,
  photo,
});
