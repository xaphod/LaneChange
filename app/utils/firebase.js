import firebase from 'react-native-firebase';
import UUIDGenerator from 'react-native-uuid-generator';
import { reportsRefName } from 'app/utils/constants';

const registerReport = (report, firebaseImageURI) => {
  // https://rnfirebase.io/docs/v5.x.x/firestore/transactions
  // firebase.firestore().runTransaction(async (transaction) => {
  // });

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
  } = report;

  return firebase
    .firestore()
    .collection(reportsRefName())
    .add({
      date,
      notes,
      address,
      lon,
      lat,
      city,
      image: firebaseImageURI,
      user,
    });
};

export const uploadReport = (report, progressCallback) => {
  const {
    date,
    imageURIOnDisk,
    city,
  } = report;

  if (!imageURIOnDisk || !date || !city) {
    throw new Error('Firebase uploadReport: need imageURIOnDisk, city and date');
  }

  return new Promise((resolve, reject) => {
    UUIDGenerator.getRandomUUID((uuid) => {
      console.log(`DEBUG firebase/uploadReport(), uuid=${uuid}`);

      const firebaseImageRef = firebase.storage().ref(`${city}-images`).child(`${uuid}.jpg`);
      const uploadTask = firebaseImageRef.putFile(imageURIOnDisk, {
        contentType: 'image/jpeg',
      });

      uploadTask.catch((error) => {
        console.log('DEBUG firebase/uploadReport: ERROR:');
        console.log(error);
        reject(error);
      });

      // https://firebase.google.com/docs/storage/web/upload-files
      uploadTask.on('state_changed', (snapshot) => {
        // Observe state change events such as progress, pause, and resume
        // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        console.log('DEBUG firebase/uploadReport: Upload is ' + progress + '% done');
        if (progress) {
          progressCallback(progress);
        }
      }, (error) => {
        // A full list of error codes is available at
        // https://firebase.google.com/docs/storage/web/handle-errors
        console.log('DEBUG firebase/uploadReport: ERROR:');
        console.log(error);
        reject(error);
      }, () => {
        // completed successfully
        console.log('DEBUG firebase/uploadReport: complete...');
        firebaseImageRef
          .getDownloadURL()
          .then((firebaseImageURI) => {
            console.log(`DEBUG firebase/uploadReport: upload done, url=${firebaseImageURI}`);
            registerReport(report, firebaseImageURI, resolve, reject)
              .then((docRef) => {
                const { id } = docRef;
                console.log(`DEBUG firebase/uploadReport: register done, ref id=${id}`);
                resolve({ firebaseImageURI, docRef: id });
              })
              .catch((error) => {
                console.log('DEBUG firebase/registerReport: ERROR:');
                console.log(error);
                reject(error);
              });
          })
          .catch((error) => {
            console.log('DEBUG firebase/getDownloadURL: ERROR:');
            console.log(error);
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
  console.log(`DEBUG deleteUserData for uid=${uid}`);

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

export const signInAnonymously = () => {
  console.log('DEBUG signInAnonymously()');
  firebase.auth().signInAnonymously()
    .catch((err) => {
      console.log(`DEBUG App.js: ERROR signing in anonymously: ${err}`);
    });
};

export const getCities = async () => {
  try {
    const snapshot = await firebase
      .firestore()
      .collection('cities')
      .get();

    const cities = snapshot.docs.map((cityObj) => {
      const { name, email } = cityObj.data();
      const city = {
        name,
        email,
      };
      return city;
    });

    return cities;
  } catch (e) {
    console.log('ERROR in firebase/cities:');
    console.log(e);
    return undefined;
  }
};
