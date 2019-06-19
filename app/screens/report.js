import React, { Component } from 'react';
import { Platform, StyleSheet, Text, View, Button, Alert, Linking, SafeAreaView, Image, TouchableOpacity } from 'react-native';
import { connect } from 'react-redux';
import LinearGradient from 'react-native-linear-gradient';
import { submitReport, cancelReport, createReport, emailReport, expandInDraftReport } from 'app/actions/reports';
import DefaultButton from 'app/components/button';
import Camera from 'app/components/camera';
import LoadingView from 'app/components/loadingview';
import { photoPath, city, disabledColor } from 'app/utils/constants';
import { IOSPreferredMailClient } from 'app/utils/mail';
import { getLocation } from 'app/utils/location';
import { photoProgress, photoTaken } from 'app/actions/camera';

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
    fontSize: 14,
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
});

const shutterButton = require('app/assets/img/shutterButton.png');
const notesIcon = require('app/assets/img/notesIcon.png');
const trashIcon = require('app/assets/img/trashIcon.png');
const moreDots = require('app/assets/img/moreDots.png');

class Report extends Component {
  static navigationOptions = ({ navigation }) => ({
    headerTitle: 'File a Report',
    headerLeft: (
      <View style={{ flexDirection: 'row' }}>
        <TouchableOpacity
          style={styles.headerButton}
          onPress={() => navigation.state.params.trashPressed()}
        >
          <Image source={trashIcon} />
        </TouchableOpacity>
      </View>
    ),
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
      return {
        ...prevState,
        showLoading: true,
      };
    }
    if (!lastSubmit || !lastSubmit.report) {
      return {
        ...prevState,
        showLoading: undefined,
      };
    }
    const { report, error } = lastSubmit;
    const newState = prevState;

    if (
      draftReport &&
      draftReport.id &&
      lastSubmit.report &&
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
    this.onTakingPhoto = this.onTakingPhoto.bind(this);
    this.onPhotoTaken = this.onPhotoTaken.bind(this);
    this.getLocation = this.getLocation.bind(this);
    this.tick = this.tick.bind(this);
  }

  componentDidMount() {
    this.props.navigation.setParams({
      trashPressed: this.trashPressed,
      morePressed: this.morePressed,
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
          onPress: () => this.props.cancelReport(this.props.navigation),
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

  onTakingPhoto = () => {
    this.props.photoProgress();
  };

  onPhotoTaken = (photo, error) => {
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
      this.props.photoTaken();
      return;
    }

    // width: returns the image's width (taking image orientation into account)
    // height: returns the image's height (taking image orientation into account)
    // uri: (string) the path to the image saved on your app's cache directory.
    // base64: (string?) the base64 representation of the image if required.
    // exif: returns an exif map of the image if required.
    // pictureOrientation: (number) the orientation of the picture
    // deviceOrientation: (number) the orientation of the device
    this.props.createReport(Date(), photo);
    this.getLocation();
    this.props.photoTaken();
  };

  createEmailPressed = () => {
    const { reports } = this.props;
    const { draftReport, lastSubmit, inProgress } = reports;

    if (inProgress && inProgress.type) {
      console.log('DEBUG createEmailPressed: DEBOUNCE');
      return;
    }

    if (
      lastSubmit &&
      lastSubmit.report &&
      lastSubmit.report.id &&
      draftReport &&
      draftReport.id &&
      lastSubmit.report.id == draftReport.id &&
      lastSubmit.report.docRef
    ) {
      console.log('DEBUG createEmailPressed: seems this report has already been uploaded/submitted. Doing email...');
      console.log(this.props);
      this.props.emailReport(lastSubmit.report, this.props.navigation);
      return;
    }

    console.log('DEBUG createEmailPressed: submitting');
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
      city,
    };

    if (location) {
      report.address = location.address;
      report.lon = location.longitude;
      report.lat = location.latitude;
    }

    this.setState({
      didError: undefined,
    }, () => {
      this.props.submitReport(report, this.props.navigation);
    });
  };

  getLocation = async () => {
    const location = await getLocation()
      .catch((e) => {
        console.log('DEBUG getLocation error:');
        console.log(e);
      });
    this.props.expandInDraftReport({ location });
  };

  render() {
    const { showLoading } = this.state;
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
    }

    if (!dateObj) {
      dateObj = new Date();
    }

    const dayText = dateObj.toLocaleDateString('default', { weekday: 'short', month: 'long', year: 'numeric', day: 'numeric' });
    const timeText = dateObj.toLocaleTimeString('default', { hour: 'numeric', minute: 'numeric' });

    let controlsDisabled = false;
    if (!draftReport) {
      controlsDisabled = true;
    }

    const shutter = showLoading ? (<View />) : (<Image source={shutterButton} />);

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
        {!imageURIOnDisk && (
          <Camera
            style={styles.camera}
            shutter={shutter}
            onTakingPhoto={this.onTakingPhoto}
            onPhotoTaken={this.onPhotoTaken}
          />
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
              title="Create Email"
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
});

const mapDispatchToProps = dispatch => ({
  cancelReport: navigation => dispatch(cancelReport(navigation)),
  submitReport: (report, navigation) => dispatch(submitReport(report, navigation)),
  createReport: (date, photo) => dispatch(createReport(date, photo)),
  emailReport: (report, navigation) => dispatch(emailReport(report, navigation)),
  expandInDraftReport: expand => dispatch(expandInDraftReport(expand)),
  photoProgress: () => dispatch(photoProgress()),
  photoTaken: photo => dispatch(photoTaken(photo)),
});

export default connect(mapStateToProps, mapDispatchToProps)(Report);
