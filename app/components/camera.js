import React, { Component } from 'react';
import { StyleSheet, Text, TouchableOpacity, View, CameraRoll, Image } from 'react-native';
import { RNCamera } from 'react-native-camera';
import ImageResizer from 'react-native-image-resizer';
import ReactNativeHapticFeedback from "react-native-haptic-feedback";
import RNFS from 'react-native-fs';
import { photoPath } from 'app/utils/constants';
import { randomString } from 'app/utils/string';
import consolelog from 'app/utils/logging';

let unmounted = false;
const shutterButton = require('app/assets/img/shutterButton.png');

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
  takingPhoto: {
    width: '100%',
    height: '100%',
    borderWidth: 2,
    borderColor: '#fffd37',
  },
  takingPhotoInner: {
    backgroundColor: '#000',
    opacity: 0.4,
    flex: 1,
  },
});

const PendingView = () => (
  <View
    style={{
      flex: 1,
      backgroundColor: 'white',
      justifyContent: 'center',
      alignItems: 'center',
    }}
  >
    <Text style={{ fontSize: 14 }}>
      Loading...
    </Text>
    <Text style={{ fontSize: 10 }}>
      If the camera does not load, please make sure this app has permission to use the camera.
    </Text>
  </View>
);

export default class Camera extends Component {
  constructor(props) {
    super(props);
    this.state = {
      takingPhoto: false,
    };

    this.takePicture = this.takePicture.bind(this);
  }

  shouldComponentUpdate(nextProps, nextState) {
    return this.props.shutter !== nextProps.shutter ||
      this.state.takingPhoto !== nextState.takingPhoto;
  }

  componentWillUnmount() {
    unmounted = true;
  }

  takePicture = async (camera) => {
    const { onPhotoTaken, onTakingPhotoPreviewAvailable } = this.props;
    const options = {
      quality: 0.8,
      pauseAfterCapture: true,
    };
    let photo = null;
    let uri;
    try {
      const hapticOptions = {
        enableVibrateFallback: false,
        ignoreAndroidSystemSettings: false,
      };
      ReactNativeHapticFeedback.trigger('impactMedium', hapticOptions);

      photo = await camera.takePictureAsync(options);
      uri = photo.uri;
      if (!uri) {
        consolelog('DEBUG camera: takePicture has no URI, failed');
        this.setState({ takingPhoto: false }, () => {
          onPhotoTaken(undefined, new Error('Could not take a photo. Please check that this app has permission to use the camera, and that he device has enough space to take a photo.'));
        });
        return;
      }
      onTakingPhotoPreviewAvailable(uri);
    } catch (e) {
      consolelog('DEBUG camera: takePicture ERROR:');
      consolelog(e);
      this.setState({ takingPhoto: false }, () => {
        onPhotoTaken(undefined, new Error(`Could not take a photo. Error: ${e.message}`));
      });
      return;
    } finally {
      if (!unmounted) {
        this.setState({ takingPhoto: false });
      }
    }

    const str = randomString(8);
    const destFilenameResized = `photo-${str}-resized.jpg`;

    let failed = false;
    await RNFS.mkdir(photoPath(), { NSURLIsExcludedFromBackupKey: true })
      .catch((err) => {
        consolelog(`DEBUG camera: mkdir error: ${err}`);
        onPhotoTaken(undefined, new Error('Could not take a photo: could not create a folder for the photos.'));
        failed = true;
      });
    if (failed) { return; }

    // save to camera roll. Could grab the URI to the asset here, currently unused.
    await CameraRoll.saveToCameraRoll(uri)
      .catch((err) => { // not a failure: user might not want them saved to camera roll
        consolelog(`DEBUG camera: save to camera roll failed, continuing: ${err}`);
      });

    const response = await ImageResizer.createResizedImage(uri, 2000, 2000, 'JPEG', 60)
      .catch((err) => {
        consolelog('DEBUG camera: resize ERROR:');
        consolelog(err);
        onPhotoTaken(undefined, new Error('Could not take a photo: there was an error resizing the photo.'));
        failed = true;
      });
    if (failed) { return; }

    await RNFS.unlink(uri)
      .catch((err) => { // not a failure
        consolelog(`DEBUG camera: could not delete full-sized photo: ${err}`);
      });

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
    consolelog('Camera RENDER');
    const children = this.props.children;
    const { shutter } = this.props;
    const { takingPhoto } = this.state;
    const shutterElement = (shutter && !takingPhoto) ? (<Image source={shutterButton} />) : (<View />);

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
            if (takingPhoto) {
              return (
                <View style={styles.takingPhoto}>
                  <View style={styles.takingPhotoInner} />
                </View>
              );
            }

            return (
              <View style={{ flex: 0, flexDirection: 'row', justifyContent: 'center' }}>
                {children}
                <TouchableOpacity
                  onPressIn={
                    () => {
                      this.setState({
                        takingPhoto: true,
                      }, () => {
                        this.takePicture(camera)
                        .catch((e) => { // unhandled/unknown error case
                          this.setState({ takingPhoto: false });
                          const { onPhotoTaken } = this.props;
                          if (onPhotoTaken && e.message) {
                            onPhotoTaken(undefined, new Error(`Could not take a photo. Error: ${e.message}`));
                          }
                        });
                      });
                    }
                  }
                  style={styles.capture}
                >
                  {shutterElement}
                </TouchableOpacity>
              </View>
            );
          }}
        </RNCamera>
      </View>
    );
  }
}
