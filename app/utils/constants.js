import RNFS from 'react-native-fs';
import { Linking } from 'react-native';

export const photoPath = () => `${RNFS.DocumentDirectoryPath}/photo`;
export const emailSubject = 'Mobility incident';
export const emailToAddress = 'mobility@hamilton.ca';

export const city = () => {
  // danger: is used as firebase storage ref & firestore collection string (alphanumerics only)
  if (__DEV__) {
    return 'hamilton-testing';
  }
  return 'hamilton';
};

export const reportsRefName = () => {
  if (__DEV__) {
    return 'reports-testing';
  }
  return 'reports';
};

const tryUrl = async (url) => {
  const retval = await Linking.canOpenURL(url);
  if (!retval) {
    console.log(`DEBUG tryUrl() canOpenURL failed for ${url}`);
    return;
  }
  await Linking.openURL(url)
    .catch((err) => {
      console.log(`DEBUG tryUrl() catch error: ${err}`);
    });
};

export const openTerms = async () => {
  const url = 'https://solodigitalis.com/lanechange/terms';
  await tryUrl(url);
};

export const openPrivacy = async () => {
  const url = 'https://solodigitalis.com/lanechange/privacy';
  await tryUrl(url);
};

export const openSolodigitalis = async () => {
  const url = 'https://solodigitalis.com';
  await tryUrl(url);
};

export const openSource = async () => {
  const url = 'https://github.com/xaphod/LaneChange';
  await tryUrl(url);
};

export const openCycleHamilton = async () => {
  const url = 'https://cyclehamont.ca';
  await tryUrl(url);
};

export const disabledColor = '#dddddd';

export const shareText = () => {
  const appUrl = 'https://solodigitalis.com/lanechange';
  return `I'm making our city safer with LaneChange! Grab the free app here: ${appUrl}`;
};
