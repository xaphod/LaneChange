import React, { Component } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { RNCamera } from 'react-native-camera';
import RNFS from 'react-native-fs';
import ImageResizer from 'react-native-image-resizer';
import { photoPath } from 'app/utils/constants';
import { randomString } from 'app/utils/string';

const PendingView = () => (
  <View
    style={{
      flex: 1,
      backgroundColor: 'black',
      justifyContent: 'center',
      alignItems: 'center',
    }}
  >
    <Text>The app needs permission to use your camera.</Text>
  </View>
);

export default class Camera extends Component {
  constructor(props) {
    super(props);

    this.takePicture = this.takePicture.bind(this);
  }

  takePicture = async (camera) => {
    const { onPhotoTaken, onTakingPhoto } = this.props;

    onTakingPhoto();

    const options = {
      quality: 0.8,
      // pauseAfterCapture: true,
    };
    const photo = await camera.takePictureAsync(options);
    const { uri } = photo;

    if (!uri) {
      console.log('DEBUG camera: takePicture has no URI, failed');
      onPhotoTaken(null);
      return;
    }

    const str = randomString(8);
    const destFilename = `photo-${str}.jpg`;
    const destFilenameResized = `photo-${str}-resized.jpg`;

    let failed = false;
    await RNFS.mkdir(photoPath(), { NSURLIsExcludedFromBackupKey: true })
      .catch((err) => {
        console.log(`DEBUG camera: mkdir error: ${err}`);
        onPhotoTaken(null);
        failed = true;
      });
    if (failed) { return; }

    const destPath = photoPath() + '/' + destFilename;
    await RNFS.moveFile(uri, destPath)
      .catch((err) => {
        console.log(`DEBUG camera: move error: ${err}`);
        onPhotoTaken(null);
        failed = true;
      });
    if (failed) { return; }

    const response = await ImageResizer.createResizedImage(destPath, 2000, 2000, 'JPEG', 60)
      .catch((err) => {
        console.log('DEBUG camera: resize ERROR:');
        console.log(err);
        onPhotoTaken(null);
        failed = true;
      });
    if (failed) { return; }

    const destPathResized = photoPath() + '/' + destFilenameResized;
    await RNFS.moveFile(response.uri, destPathResized)
      .catch((err) => {
        console.log('DEBUG camera: move2 ERROR:');
        console.log(err);
        onPhotoTaken(null);
        failed = true;
      });
    if (failed) { return; }

    photo.uri = destPathResized;
    photo.filename = destFilenameResized;
    onPhotoTaken(photo);
  };

  render() {
    const children = this.props.children;
    return (
      <View style={styles.container}>
        <RNCamera
          style={styles.preview}
          type={RNCamera.Constants.Type.back}
          flashMode={RNCamera.Constants.FlashMode.auto}
          captureAudio={false}
          androidCameraPermissionOptions={{
            title: 'Permission to use camera',
            message: 'We need your permission to use your camera',
            buttonPositive: 'Ok',
            buttonNegative: 'Cancel',
          }}
          androidRecordAudioPermissionOptions={{
            title: 'Permission to use audio recording',
            message: 'We need your permission to use your audio',
            buttonPositive: 'Ok',
            buttonNegative: 'Cancel',
          }}
        >
          {({ camera, status }) => {
            if (status !== 'READY') return <PendingView />;
            return (
              <View style={{ flex: 0, flexDirection: 'row', justifyContent: 'center' }}>
                {children}
                <TouchableOpacity onPress={() => this.takePicture(camera)} style={styles.capture}>
                  <Text style={{ fontSize: 14 }}> Take a photo </Text>
                </TouchableOpacity>
              </View>
            );
          }}
        </RNCamera>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    backgroundColor: 'black',
  },
  preview: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  capture: {
    flex: 0,
    backgroundColor: '#fff',
    borderRadius: 5,
    padding: 15,
    paddingHorizontal: 20,
    alignSelf: 'center',
    margin: 20,
  },
});
