export const emailToAddress = 'mobility@hamilton.ca';

export const city = () => {
  // danger: is used as firebase storage ref & firestore collection string (alphanumerics only)
  if (__DEV__) {
    return 'hamilton-testing';
  }
  return 'hamilton';
};



export const populateCities = async () => {

};
