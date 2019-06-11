import RNFS from 'react-native-fs';

export const photoPath = () => `${RNFS.DocumentDirectoryPath}/photo`;
export const emailSubject = 'Mobility incident';
export const emailToAddress = 'mobility@hamilton.ca';
export const city = 'hamilton'; // danger: is used as firebase storage ref & firestore collection string (alphanumerics only)
