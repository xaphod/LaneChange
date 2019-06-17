import firebase from 'react-native-firebase';
import UUIDGenerator from 'react-native-uuid-generator';
import { reportsRefName } from 'app/utils/constants';

const registerReport = (report, firebaseImageURI) => {
  // https://rnfirebase.io/docs/v5.x.x/firestore/transactions
  // firebase.firestore().runTransaction(async (transaction) => {
  // });

  let user = null;
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
    .collection(reportsRefName)
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

export default uploadReport = (reportIn) => {
  const report = reportIn;
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

      // https://firebase.google.com/docs/storage/web/upload-files
      uploadTask.on('state_changed', (snapshot) => {
        // Observe state change events such as progress, pause, and resume
        // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        console.log('DEBUG firebase/uploadReport: Upload is ' + progress + '% done');
      }, (error) => {
        // A full list of error codes is available at
        // https://firebase.google.com/docs/storage/web/handle-errors
        console.log('DEBUG firebase/uploadReport: ERROR:');
        console.log(error);
        reject(error);
      }, () => {
        // completed successfully
        firebaseImageRef
          .getDownloadURL()
          .then((firebaseImageURI) => {
            console.log(`DEBUG firebase/uploadReport: upload done, url=${firebaseImageURI}`);
            registerReport(report, firebaseImageURI, resolve, reject)
              .then((docRef) => {
                console.log(`DEBUG firebase/uploadReport: register done, ref=${docRef}`);
                report.docRef = docRef;
                resolve(firebaseImageURI);
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
