import React, { Component } from 'react';
import { Platform, StyleSheet, Text, View, Button, Alert, Linking, SafeAreaView, Image, TouchableOpacity } from 'react-native';
import { connect } from 'react-redux';
import { submitReport, cancelReport, createReport } from 'app/actions/reports';
import DefaultButton from 'app/components/button';
import Camera from 'app/components/camera';
import { photoPath } from 'app/utils/constants';

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
  image: {
    flex: 1,
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

  constructor(props) {
    super(props);
    this.state = {
    };

    this.trashPressed = this.trashPressed.bind(this);
    this.morePressed = this.morePressed.bind(this);
  }

  componentDidMount() {
    this.props.navigation.setParams({
      trashPressed: this.trashPressed,
      morePressed: this.morePressed,
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
    this.setState({
      takingPhoto: true,
    });
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
      this.setState({
        takingPhoto: false,
      });
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
    this.setState({
      takingPhoto: undefined,
    });
  };

  render() {
    const shutter = (<Image source={shutterButton} />);
    const { takingPhoto } = this.state;
    // TODO: use takingPhoto to show a wait animation
    const { reports } = this.props;
    const { draftReport } = reports;
    let imageURIOnDisk;
    let dayText;
    let timeText;
    if (draftReport && draftReport.photo) {
      const { photo, date } = draftReport;
      const { filename } = photo;
      imageURIOnDisk = `file://${photoPath()}/${filename}`;
      if (date) {
        const dateObj = new Date(date);
        dayText = dateObj.toLocaleDateString('default', { weekday: 'short', month: 'long', year: 'numeric', day: 'numeric' });
        timeText = dateObj.toLocaleTimeString('default', { hour: 'numeric', minute: 'numeric' });
      }
    }

    let controlsDisabled = false;
    if (!draftReport) {
      controlsDisabled = true;
    }

    return (
      <SafeAreaView style={styles.container}>
        {!!imageURIOnDisk && (
          <Image
            style={styles.image}
            resizeMode="contain"
            source={{ uri: imageURIOnDisk }}
          />
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
            <Text style={styles.text}>{dayText}</Text>
            <Text style={styles.text}>{timeText}</Text>
          </View>
          <View style={styles.reportActions}>
            <TouchableOpacity
              style={styles.addNoteButton}
              onPress={() => this.props.navigation.navigate('Notes')}
              disabled={controlsDisabled}
            >
              <Image source={notesIcon} opacity={controlsDisabled ? 0.2 : 1.0} />
              <Text
                style={controlsDisabled ? { ...styles.addNoteButtonText, color: '#dddddd' } : styles.addNoteButtonText}
              >
                Add Note
              </Text>
              <Text style={styles.addNoteChevron}>&gt;</Text>
            </TouchableOpacity>
            <DefaultButton
              title="Create Email"
              onPress={() => { }}
              disabled={controlsDisabled}
            />
          </View>
        </View>
      </SafeAreaView>
    );
  }
}

const mapStateToProps = state => ({
  reports: state.reports,
  ui: state.ui,
});

const mapDispatchToProps = dispatch => ({
  cancelReport: navigation => dispatch(cancelReport(navigation)),
  submitReport: (report, navigation, preferredIOSClient) => dispatch(submitReport(report, navigation, preferredIOSClient)),
  createReport: (date, photo) => dispatch(createReport(date, photo)),
});

export default connect(mapStateToProps, mapDispatchToProps)(Report);
