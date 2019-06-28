import React, { Component } from 'react';
import { Platform, StyleSheet, Text, View, Button, Alert, Linking, SafeAreaView, Image, TouchableOpacity } from 'react-native';
import { connect } from 'react-redux';
import LinearGradient from 'react-native-linear-gradient';
import { submitReport, cancelReport, createReport, emailReport } from 'app/actions/reports';
import DefaultButton from 'app/components/button';
import Camera from 'app/components/camera';
import LoadingView from 'app/components/loadingview';
import { photoPath, disabledColor } from 'app/utils/constants';
import { IOSPreferredMailClient } from 'app/utils/mail';
import { getLocation } from 'app/utils/location';
import { photoProgress, photoTakingFinished } from 'app/actions/camera';
import consolelog from 'app/utils/logging';
import { gotCity } from 'app/actions/cities';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f7f7f7',
  },
  headerButton: {
    paddingHorizontal: 20,
    height: 30,
    justifyContent: 'center',
  },
  camera: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'flex-end',
    backgroundColor: '#f20000',
  },
  text: {
    fontSize: 16,
  },
  report: {
    height: 245,
    backgroundColor: '#f7f7f7',
  },
  reportMeta: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    height: 55,
    paddingHorizontal: 20,
    backgroundColor: '#fff',
    borderColor: '#E8E8E8',
    borderBottomWidth: 1,
  },
  addNoteButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    paddingHorizontal: 20,
    height: 60,
    backgroundColor: '#fff',
    borderColor: '#F0F0F0',
    borderWidth: 1,
    borderRadius: 6,
  },
  addNoteButtonText: {
    fontSize: 16,
    color: '#019864',
    paddingLeft: 20,
  },
  addNoteChevron: {
    fontSize: 14,
    color: '#B9B9B9',
    marginLeft: 'auto',
  },
  reportActions: {
    padding: 20,
  },
  gradient: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 100,
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
  photoContainer: {
    flex: 1,
  },
  photo: {
    flex: 1,
  },
  locationContainer: {
    bottom: 14,
  },
  locationText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  cameraNotAuthorized: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

const notesIcon = require('app/assets/img/notesIcon.png');
const trashIcon = require('app/assets/img/trashIcon.png');
const moreDots = require('app/assets/img/moreDots.png');

class Report extends Component {
  static navigationOptions = ({ navigation }) => ({
    headerTitle: 'File a Report',
    headerLeft: () => {
      const opacity = navigation.getParam('trashOpacity', 1.0);
      const disabled = (opacity < 1.0);
      return (
        <View style={{ flexDirection: 'row' }}>
          <TouchableOpacity
            style={styles.headerButton}
            disabled={disabled}
            onPress={() => navigation.state.params.trashPressed()}
          >
            <Image source={trashIcon} opacity={opacity} />
          </TouchableOpacity>
        </View>
      );
    },
    headerRight: (
      <View style={{ flexDirection: 'row' }}>
        <TouchableOpacity
          style={styles.headerButton}
          onPress={() => navigation.state.params.morePressed()}
        >
          <Image source={moreDots} />
        </TouchableOpacity>
      </View>
    ),
  });

  static getDerivedStateFromProps(nextProps, prevState) {
    const { didError } = prevState;
    const { reports, camera } = nextProps;
    const { lastSubmit, draftReport } = reports;

    if ((reports && reports.inProgress) || (camera && camera.inProgress)) {
      const retval = {
        ...prevState,
        showLoading: true,
        showPhotoFromURIWhileProcessing: undefined,
      };
      if (camera && camera.inProgress && camera.inProgress.uri) {
        retval.showLoading = false;
        retval.showPhotoFromURIWhileProcessing = camera.inProgress.uri;
      }
      return retval;
    }
    if (!lastSubmit || !lastSubmit.report) {
      return {
        ...prevState,
        showLoading: undefined,
        showPhotoFromURIWhileProcessing: undefined,
      };
    }
    const { error } = lastSubmit;
    const newState = prevState;
    newState.showPhotoFromURIWhileProcessing = undefined;

    // ERROR CASE
    if (
      draftReport &&
      draftReport.id &&
      lastSubmit.report.id &&
      lastSubmit.report.id === draftReport.id &&
      error &&
      error.message &&
      !didError
    ) {
      Alert.alert(
        'Uh oh',
        error.message,
        [
          {
            text: 'OK',
          },
        ],
      );
      newState.didError = true;
      nextProps.navigation.setParams({ trashOpacity: 1.0 });
    }
    // DONE CASE
    else if (
      lastSubmit.report.id &&
      lastSubmit.didEmail &&
      draftReport &&
      draftReport.id &&
      draftReport.id === lastSubmit.report.id &&
      (
        !prevState.doneForID ||
        prevState.doneForID !== lastSubmit.report.id
      )
    ) {
      consolelog('Reports: DONE case');
      newState.doneForID = lastSubmit.report.id;
      nextProps.cancelReport();
      nextProps.navigation.setParams({ trashOpacity: 0.2 });
      nextProps.navigation.navigate('Done');
    }

    return {
      ...newState,
      showLoading: undefined,
    };
  }

  constructor(props) {
    super(props);
    this.state = {
      didError: false,
      counter: 0,
      timer: null,
    };

    this.trashPressed = this.trashPressed.bind(this);
    this.morePressed = this.morePressed.bind(this);
    this.createEmailPressed = this.createEmailPressed.bind(this);
    this.onTakingPhotoPreviewAvailable = this.onTakingPhotoPreviewAvailable.bind(this);
    this.onPhotoTaken = this.onPhotoTaken.bind(this);
    this.getLocation = this.getLocation.bind(this);
    this.tick = this.tick.bind(this);
  }

  componentDidMount() {
    const { reports } = this.props;
    const { draftReport } = reports;
    const trashOpacity = draftReport ? 1.0 : 0.2;
    this.props.navigation.setParams({
      trashPressed: this.trashPressed,
      morePressed: this.morePressed,
      trashOpacity,
    });
    const timer = setInterval(this.tick, 2000);
    this.setState({ timer });
  }

  componentWillUnmount() {
    clearInterval(this.state.timer);
  }

  tick() {
    this.setState({
      counter: this.state.counter + 1,
    });
  }

  trashPressed = () => {
    Alert.alert(
      'Discard this Report?',
      'Are you sure you want to discard this report? There is no undo button.',
      [
        {
          text: 'Discard',
          onPress: () => {
            this.props.cancelReport(true);
            this.props.navigation.setParams({ trashOpacity: 0.2 });
          },
        },
        {
          text: 'Cancel',
          style: 'cancel',
        },
      ],
    );
  }

  morePressed = () => {
    this.props.navigation.navigate('Menu');
  }

  onTakingPhotoPreviewAvailable = (uri) => {
    this.props.photoProgress(uri);
  };

  onPhotoTaken = (photo, error) => {
    this.props.navigation.setParams({ trashOpacity: 1.0 });
    if (error) {
      const { message } = error;
      if (message) {
        Alert.alert(
          'Uh oh',
          message,
          [
            {
              text: 'OK',
            },
          ],
        );
      }
      this.props.photoTakingFinished();
      return;
    }

    // width: returns the image's width (taking image orientation into account)
    // height: returns the image's height (taking image orientation into account)
    // uri: (string) the path to the image saved on your app's cache directory.
    // base64: (string?) the base64 representation of the image if required.
    // exif: returns an exif map of the image if required.
    // pictureOrientation: (number) the orientation of the picture
    // deviceOrientation: (number) the orientation of the device
    this.getLocation()
      .then((location) => {
        this.props.createReport(Date(), photo, location);
        this.props.photoTakingFinished();
      })
      .catch((e) => {
        consolelog(`DEBUG Report getLocation.catch: ${e.message}`);
        this.props.createReport(Date(), photo);
        this.props.photoTakingFinished();
      });
  };

  createEmailPressed = () => {
    const { reports, cities } = this.props;
    const { chosenCity } = cities;
    const { name, email } = chosenCity;
    const { draftReport, lastSubmit, inProgress } = reports;

    if (inProgress && inProgress.type) {
      consolelog('DEBUG createEmailPressed: DEBOUNCE');
      return;
    }

    if (
      lastSubmit &&
      lastSubmit.report &&
      lastSubmit.report.id &&
      draftReport &&
      draftReport.id &&
      lastSubmit.report.id === draftReport.id &&
      lastSubmit.report.docRef
    ) {
      consolelog('DEBUG createEmailPressed: seems this report has already been uploaded/submitted. Doing email...');

      this.setState({
        didError: undefined,
      }, () => {
        this.props.emailReport(email, lastSubmit.report, reports.iOSMailClient);
      });
      return;
    }

    consolelog('DEBUG createEmailPressed: submitting');
    const {
      photo,
      location,
    } = draftReport;
    const { filename } = photo;
    const imageURIOnDisk = `file://${photoPath()}/${filename}`;
    const report = {
      ...draftReport,
      photo: undefined,
      location: undefined,
      imageURIOnDisk,
      chosenCity: name,
    };

    if (location) {
      report.address = location.address;
      report.lon = location.longitude;
      report.lat = location.latitude;
      report.city = location.city;
    }

    this.setState({
      didError: undefined,
    }, () => {
      this.props.submitReport(email, report, reports.iOSMailClient);
    });
  };

  getLocation = async () => {
    try {
      const location = await getLocation();
      if (location && location.city) {
        this.props.gotCity(location.city);
      }
      return location;
    } catch (e) {
      consolelog('DEBUG getLocation error:');
      consolelog(e);
      return undefined;
    }
  };

  render() {
    const { showLoading, cameraNotAuthorized, showPhotoFromURIWhileProcessing } = this.state;
    const { reports } = this.props;
    const { draftReport } = reports;
    let imageURIOnDisk;
    let locationText;
    let notesText = 'Add Note';
    let dateObj;
    let dateStyle = {
      ...styles.text,
      color: disabledColor,
    };
    let createEmailTitle = 'Create Email';
    let controlsDisabled = false;

    if (draftReport && draftReport.photo) {
      const { photo, date, location, notes } = draftReport;
      const { filename } = photo;
      imageURIOnDisk = `file://${photoPath()}/${filename}`;
      if (date) {
        dateStyle = styles.text;
        dateObj = new Date(date);
      }
      if (location) {
        if (location.addressShort) {
          locationText = location.addressShort;
        } else if (location.address) {
          locationText = location.address;
        }
      }
      if (notes) {
        const [firstLine, secondLine, ...rest] = notes.split('\n');
        notesText = firstLine;
        if (firstLine.length > 20) {
          notesText = firstLine.substring(0, 20) + '\u2026';
        } else if (secondLine !== undefined) {
          notesText += '\u2026';
        }
      }
    } else if (showPhotoFromURIWhileProcessing) {
      imageURIOnDisk = showPhotoFromURIWhileProcessing;
      createEmailTitle = 'Please wait...';
      controlsDisabled = true;
    }

    if (!dateObj) {
      dateObj = new Date();
    }

    const dayText = dateObj.toLocaleDateString('default', { weekday: 'short', month: 'long', year: 'numeric', day: 'numeric' });
    const timeText = dateObj.toLocaleTimeString('default', { hour: 'numeric', minute: 'numeric' });

    if (!draftReport) {
      controlsDisabled = true;
    }

    return (
      <SafeAreaView style={styles.container}>
        {!!imageURIOnDisk && (
          <View style={styles.photoContainer}>
            <Image
              style={styles.photo}
              resizeMode="contain"
              source={{ uri: imageURIOnDisk }}
            />
            {!!locationText && (
              <LinearGradient colors={['rgba(0,0,0,0)', 'rgba(0,0,0,0.6)']} style={styles.gradient}>
                <View style={styles.locationContainer}>
                  <Text style={styles.locationText}>{locationText}</Text>
                </View>
              </LinearGradient>
            )}
          </View>
        )}
        {!imageURIOnDisk && !cameraNotAuthorized && (
          <Camera
            style={styles.camera}
            shutter={!showLoading}
            onTakingPhotoPreviewAvailable={this.onTakingPhotoPreviewAvailable}
            onPhotoTaken={this.onPhotoTaken}
            cameraNotAuthorized={() => this.setState({ cameraNotAuthorized: true })}
          />
        )}
        {!imageURIOnDisk && cameraNotAuthorized && (
          <View style={styles.cameraNotAuthorized}>
            <Text>
              Please authorize this app to use the camera.
            </Text>
          </View>
        )}

        <View style={styles.report}>
          <View style={styles.reportMeta}>
            <Text style={dateStyle}>{dayText}</Text>
            <Text style={dateStyle}>{timeText}</Text>
          </View>
          <View style={styles.reportActions}>
            <TouchableOpacity
              style={styles.addNoteButton}
              onPress={() => this.props.navigation.navigate('Notes')}
              disabled={controlsDisabled}
            >
              <Image source={notesIcon} opacity={controlsDisabled ? 0.2 : 1.0} />
              <Text
                style={controlsDisabled ? { ...styles.addNoteButtonText, color: disabledColor } : styles.addNoteButtonText}
              >
                {notesText}
              </Text>
              <Text style={styles.addNoteChevron}>&gt;</Text>
            </TouchableOpacity>
            <DefaultButton
              title={createEmailTitle}
              onPress={() => this.createEmailPressed()}
              disabled={controlsDisabled}
            />
          </View>
        </View>
        {!!showLoading && (
          <LoadingView />
        )}
      </SafeAreaView>
    );
  }
}

const mapStateToProps = state => ({
  reports: state.reports,
  ui: state.ui,
  camera: state.camera,
  cities: state.cities,
});

const mapDispatchToProps = dispatch => ({
  cancelReport: isTrash => dispatch(cancelReport(isTrash)),
  submitReport: (emailAddress, report, iOSMailClient) => dispatch(submitReport(emailAddress, report, iOSMailClient)),
  createReport: (date, photo, location) => dispatch(createReport(date, photo, location)),
  emailReport: (emailAddress, report, iOSMailClient) => dispatch(emailReport(emailAddress, report, iOSMailClient)),
  photoProgress: uri => dispatch(photoProgress(uri)),
  photoTakingFinished: () => dispatch(photoTakingFinished()),
  gotCity: city => dispatch(gotCity(city)),
});

export default connect(mapStateToProps, mapDispatchToProps)(Report);
