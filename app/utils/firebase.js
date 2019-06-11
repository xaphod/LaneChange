import firebase from 'react-native-firebase';
import UUIDGenerator from 'react-native-uuid-generator';

const registerReport = (report, firebaseImageURI, resolve) => {
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

  firebase.firestore().collection('reports').add({
    date,
    notes,
    address,
    lon,
    lat,
    city,
    image: firebaseImageURI,
    user,
  }).then(() => {
    resolve(firebaseImageURI);
  });
};

export default uploadReport = (report) => {
  const {
    date,
    imageURIOnDisk,
    city,
  } = report;

  if (!imageURIOnDisk || !date || !city) {
    throw new Error('Firebase uploadReport: need imageURIOnDisk, city and date');
  }

  return new Promise((resolve) => {
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
        throw error;
      }, () => {
        // completed successfully
        firebaseImageRef.getDownloadURL().then((firebaseImageURI) => {
          console.log(`DEBUG firebase/uploadReport: upload done, url=${firebaseImageURI}`);
          registerReport(report, firebaseImageURI, resolve);
        });
      });
    });
  });
};
