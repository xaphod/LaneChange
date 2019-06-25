import { Platform } from 'react-native';
import firebase from 'react-native-firebase';
import UUIDGenerator from 'react-native-uuid-generator';
import { reportsRefName } from 'app/utils/constants';
import consolelog from 'app/utils/logging';

const registerReport = (report, firebaseImageURI) => {
  let user;
  const userObject = firebase.auth().currentUser;
  if (userObject) {
    user = userObject.uid;
  }

  const {
    date,
    notes,
    address,
    lon,
    lat,
    city,
    chosenCity,
  } = report;

  return firebase
    .firestore()
    .collection(reportsRefName())
    .add({
      date,
      notes,
      address,
      addressCity: city,
      lon,
      lat,
      chosenCity,
      image: firebaseImageURI,
      user,
    });
};

export const uploadReport = (report, progressCallback) => {
  const {
    date,
    imageURIOnDisk,
    chosenCity,
  } = report;

  if (!imageURIOnDisk || !date || !chosenCity) {
    throw new Error('Firebase uploadReport: need imageURIOnDisk, city and date');
  }

  return new Promise((resolve, reject) => {
    UUIDGenerator.getRandomUUID((uuid) => {
      consolelog(`DEBUG firebase/uploadReport(), uuid=${uuid}`);

      let refName = chosenCity;
      refName = refName.replace(/[^a-z0-9+]+/gi, '');
      if (__DEV__) {
        refName = `${refName}-testing`;
      }
      const firebaseImageRef = firebase.storage().ref(`${refName}-images`).child(`${uuid}.jpg`);
      const uploadTask = firebaseImageRef.putFile(imageURIOnDisk, {
        contentType: 'image/jpeg',
      });

      uploadTask.catch((error) => {
        consolelog('DEBUG firebase/uploadReport: ERROR:');
        consolelog(error);
        reject(error);
      });

      // https://firebase.google.com/docs/storage/web/upload-files
      uploadTask.on('state_changed', (snapshot) => {
        // Observe state change events such as progress, pause, and resume
        // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        consolelog('DEBUG firebase/uploadReport: Upload is ' + progress + '% done');
        if (progress) {
          progressCallback(progress);
        }
      }, (error) => {
        // A full list of error codes is available at
        // https://firebase.google.com/docs/storage/web/handle-errors
        consolelog('DEBUG firebase/uploadReport: ERROR:');
        consolelog(error);
        reject(error);
      }, () => {
        // completed successfully
        consolelog('DEBUG firebase/uploadReport: complete...');
        firebaseImageRef
          .getDownloadURL()
          .then((firebaseImageURI) => {
            consolelog(`DEBUG firebase/uploadReport: upload done, url=${firebaseImageURI}`);
            registerReport(report, firebaseImageURI, resolve, reject)
              .then((docRef) => {
                const { id } = docRef;
                consolelog(`DEBUG firebase/uploadReport: register done, ref id=${id}`);
                resolve({ firebaseImageURI, docRef: id });
              })
              .catch((error) => {
                consolelog('DEBUG firebase/registerReport: ERROR:');
                consolelog(error);
                reject(error);
              });
          })
          .catch((error) => {
            consolelog('DEBUG firebase/getDownloadURL: ERROR:');
            consolelog(error);
            reject(error);
          });
      });
    });
  });
};

export const deleteUserData = async () => {
  const userObject = firebase.auth().currentUser;
  if (!userObject) {
    throw new Error('No user is logged in.');
  }
  const { uid } = userObject;
  consolelog(`DEBUG deleteUserData for uid=${uid}`);

  const reportsRef = firebase.firestore().collection(reportsRefName());
  const reportsQuery = reportsRef.where('user', '==', uid);
  const snapshot = await reportsQuery.get()
    .catch((e) => {
      throw e;
    });

  snapshot.forEach((doc) => {
    const { image } = doc.data();
    if (image) {
      const photoRef = firebase.storage().refFromURL(image);
      if (photoRef) {
        photoRef.delete()
          .catch((e) => {
            throw e;
          });
      }
    }
    doc.ref.delete()
      .catch((e) => {
        throw e;
      });
  });

  userObject.delete()
    .catch((e) => {
      throw e;
    });

  // signInAnonymously called by handler in App.js
};

const signInAnonymously = () => {
  consolelog('DEBUG signInAnonymously()');
  firebase.auth().signInAnonymously()
    .catch((err) => {
      consolelog(`DEBUG firebase: ERROR signing in anonymously: ${err}`);
    });
};

export const getCities = async () => {
  try {
    const snapshot = await firebase
      .firestore()
      .collection('cities')
      .get();

    const cities = snapshot.docs.map((cityObj) => {
      return JSON.parse(JSON.stringify(cityObj.data()));
    });

    consolelog('DEBUG firebase getCities returning:');
    consolelog(cities);
    return cities;
  } catch (e) {
    consolelog('ERROR in firebase/cities:');
    consolelog(e);
    return undefined;
  }
};

export const registerFirebaseAuthHandler = (onSignedIn) => {
  firebase.auth().onAuthStateChanged((user) => {
    if (user) {
      // signed in
      if (user.isAnonymous) {
        consolelog(`DEBUG firebase: signed in anonymously as: ${user.uid}`);
      } else {
        consolelog(`DEBUG firebase: signed in to an actual account as: ${user.uid}`);
      }
      onSignedIn(user);
    } else {
      consolelog('DEBUG firebase: no user, calling signInAnonymously()');
      signInAnonymously();
    }
  });
};

export const shortenLink = async (linkIn) => {
  try {
    const domain = Platform.select({
      ios: 'https://lanechange.page.link',
      default: 'lanechange.page.link',
    });
    consolelog(`firebase shortenLink, shortening ${linkIn}, domain=${domain}`);
    const link = new firebase.links.DynamicLink(linkIn, domain);
    const retval = await firebase.links().createShortDynamicLink(link, 'UNGUESSABLE');
    return retval;
  } catch (e) {
    consolelog('ERROR in firebase/shortenLink:');
    consolelog(e);
    return undefined;
  }
};
