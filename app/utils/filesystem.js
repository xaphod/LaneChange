import RNFS from 'react-native-fs';
import { photoPath } from 'app/utils/constants';

export const deletePhotosFromDisk = async () => {
  await RNFS.unlink(photoPath())
    .catch((e) => {});
};
