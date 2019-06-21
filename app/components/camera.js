import React, { Component } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { RNCamera } from 'react-native-camera';
import RNFS from 'react-native-fs';
import ImageResizer from 'react-native-image-resizer';
import { photoPath } from 'app/utils/constants';
import { randomString } from 'app/utils/string';
import consolelog from 'app/utils/logging';

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
    let photo = null;
    try {
      photo = await camera.takePictureAsync(options);
    } catch (e) {
      consolelog('DEBUG camera: takePicture ERROR:');
      consolelog(e);
      onPhotoTaken(undefined, new Error(`Could not take a photo. Error: ${e.message}`));
      return;
    }
    const { uri } = photo;
    if (!uri) {
      consolelog('DEBUG camera: takePicture has no URI, failed');
      onPhotoTaken(undefined, new Error('Could not take a photo. Please check that this app has permission to use the camera, and that he device has enough space to take a photo.'));
      return;
    }

    const str = randomString(8);
    const destFilename = `photo-${str}.jpg`;
    const destFilenameResized = `photo-${str}-resized.jpg`;

    let failed = false;
    await RNFS.mkdir(photoPath(), { NSURLIsExcludedFromBackupKey: true })
      .catch((err) => {
        consolelog(`DEBUG camera: mkdir error: ${err}`);
        onPhotoTaken(undefined, new Error('Could not take a photo: could not create a folder for the photos.'));
        failed = true;
      });
    if (failed) { return; }

    const destPath = photoPath() + '/' + destFilename;
    await RNFS.moveFile(uri, destPath)
      .catch((err) => {
        consolelog(`DEBUG camera: move error: ${err}`);
        onPhotoTaken(undefined, new Error('Could not take a photo: could not move the photo into its folder.'));
        failed = true;
      });
    if (failed) { return; }

    const response = await ImageResizer.createResizedImage(destPath, 2000, 2000, 'JPEG', 60)
      .catch((err) => {
        consolelog('DEBUG camera: resize ERROR:');
        consolelog(err);
        onPhotoTaken(undefined, new Error('Could not take a photo: there was an error resizing the photo.'));
        failed = true;
      });
    if (failed) { return; }

    const destPathResized = photoPath() + '/' + destFilenameResized;
    await RNFS.moveFile(response.uri, destPathResized)
      .catch((err) => {
        consolelog('DEBUG camera: move2 ERROR:');
        consolelog(err);
        onPhotoTaken(undefined, new Error('Could not take a photo: could not move the resized photo into its folder.'));
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
            if (status === 'NOT_AUTHORIZED') {
              consolelog('Camera: NOT_AUTHORIZED');
              this.props.cameraNotAuthorized();
              return null;
            }
            if (status !== 'READY') return <PendingView />;
            return (
              <View style={{ flex: 0, flexDirection: 'row', justifyContent: 'center' }}>
                {children}
                <TouchableOpacity
                  onPress={
                    () => {
                      this.takePicture(camera)
                        .catch((e) => { // unhandled/unknown error case
                          const { onPhotoTaken } = this.props;
                          if (onPhotoTaken && e.message) {
                            onPhotoTaken(undefined, new Error(`Could not take a photo. Error: ${e.message}`));
                          }
                        });
                    }
                  }
                  style={styles.capture}
                >
                  {this.props.shutter}
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
    alignSelf: 'center',
    margin: 20,
  },
});
