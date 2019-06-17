import React, {Component} from 'react';
import {Platform, StyleSheet, Text, View, Button, Alert, Image, SafeAreaView, TextInput, TouchableOpacity }  from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import { connect } from 'react-redux';
import RNFS from 'react-native-fs';
import { HeaderButtons, HeaderButton } from 'react-navigation-header-buttons';
import { photoPath, city } from 'app/utils/constants';
import { submitReport, cancelReport, emailReport } from 'app/actions/reports';
import { getLocation } from 'app/utils/location';
import { IOSPreferredMailClient } from 'app/utils/mail';

// TODO: user picks preferred
const preferredIOSClient = IOSPreferredMailClient.GMAIL;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#cccccc',
  },
  scrollview: {
    padding: 23,
  },
  imageContainer: {
    width: '100%',
    height: 300,
    paddingBottom: 23,
  },
  image: {
    width: '100%',
    height: '100%',
  },
  section: {
    paddingBottom: 23,
  },
  textinput: {
    width: '100%',
    height: 200,
    backgroundColor: '#ffffff',
  },
});

class CreateReport extends Component {
  static navigationOptions = ({ navigation }) => ({
    headerTitle: 'Create a Report',
    headerLeft: (
      <HeaderButtons>
        <HeaderButtons.Item
          onPress={() => {
            navigation.state.params.cancel();
          }}
          title="Cancel"
        />
      </HeaderButtons>
    ),
    headerRight: (
      <HeaderButtons>
        <HeaderButtons.Item
          onPress={() => {
            navigation.state.params.submit();
          }}
          title="Submit"
        />
      </HeaderButtons>
    ),
  });

  static getDerivedStateFromProps(nextProps, prevState) {
    const { didError } = prevState;
    const { reports } = nextProps;
    const { lastSubmit, draftReport, inProgress } = reports;
    if (inProgress || !lastSubmit || !lastSubmit.report) {
      return {
        ...prevState,
      };
    }
    const { report, error, didEmail } = lastSubmit;
    const newState = prevState;

    console.log(`createReport getDerivedStateFromProps - report.id=${report.id}, didError=${didError}, error is`);
    console.log(error);

    if (
      draftReport &&
      draftReport.id &&
      lastSubmit.id &&
      lastSubmit.id === draftReport.id &&
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
    } else if (
      report.docRef &&
      !didEmail
    ) {
      console.log('DEBUG getDerivedStateFromProps: firing email action');
      nextProps.emailReport(lastSubmit.report, nextProps.navigation, preferredIOSClient);
    }

    return {
      ...newState,
    };
  }

  constructor(props) {
    super(props);
    this.state = {
      didError: false,
    };

    this.getLocation = this.getLocation.bind(this);
    this.submit = this.submit.bind(this);
    this.cancel = this.cancel.bind(this);
  }

  componentDidMount() {
    this.props.navigation.setParams({
      submit: this.submit,
      cancel: this.cancel,
    });
  }

  getLocation = async () => {
    const location = await getLocation()
      .catch((e) => {
        console.log('createReport getLocation error:');
        console.log(e);
      });
    this.setState({
      location,
    }, () => {
      if (!location) {
        const bodyStr = Platform.select({
          ios: 'Please ensure this app has access to your location, and that Location Services are turned on. Please also check your internet connection.',
          android: 'Please ensure that Location is turned on with high accuracy enabled. Please also check your internet connection.',
        });
        Alert.alert(
          'Could not get location',
          bodyStr,
          [
            { text: 'OK' },
          ],
        );
      }
    });
  };

  cancel = () => {
    console.log('DEBUG createReport: cancelling');
    this.props.cancelReport(this.props.navigation);
  };

  submit = () => {
    const { reports } = this.props;
    const { draftReport, lastSubmit, inProgress } = reports;

    if (inProgress && inProgress.type) {
      console.log('DEBUG createReport: submit DEBOUNCE');
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
      console.log('DEBUG createReport: seems this report has already been uploaded/submitted. Doing email...');
      console.log(this.props);
      this.props.emailReport(lastSubmit.report, this.props.navigation, preferredIOSClient);
      return;
    }

    console.log('DEBUG createReport: submitting');
    const { photo, date } = draftReport;
    const { filename } = photo;
    const imageURIOnDisk = `file://${photoPath()}/${filename}`;
    const { notes, location } = this.state;
    const report = {
      ...draftReport,
      date,
      imageURIOnDisk,
      notes,
      city,
    };

    if (location) {
      report.address = location.address;
      report.lon = location.longitude;
      report.lat = location.latitude;
    }

    // TODO: show some progress / waiting view

    this.setState({
      didError: undefined,
    }, () => {
      this.props.submitReport(report, this.props.navigation);
    });
  };

  render() {
    // console.log('props:');
    // console.log(this.props);
    const { reports } = this.props;
    const { draftReport } = reports;
    if (!draftReport) {
      return (<SafeAreaView />);
    }

    const { photo, date } = draftReport;
    const dateText = `Created: ${date}`;
    const { filename } = photo;
    const imageURIOnDisk = `file://${photoPath()}/${filename}`;
    console.log(`DEBUG createReport render: imageURIOnDisk is ${imageURIOnDisk}`);

    return (
      <SafeAreaView style={styles.container}>
        <KeyboardAwareScrollView style={styles.scrollview}>
          <View style={styles.imageContainer}>
            <Image
              style={styles.image}
              resizeMode="contain"
              source={{ uri: imageURIOnDisk }}
            />
          </View>
          <View style={styles.section}>
            <Text>{dateText}</Text>
          </View>
          <View style={styles.section}>
            <Text>Notes</Text>
            <TextInput
              style={styles.textinput}
              onChangeText={text => this.setState({ notes: text })}
              value={this.state.notes}
              multiline
              textAlignVertical="top"
            />
          </View>
          <View style={styles.section}>
            {!!this.state.location &&
              <Text>lat: {this.state.location.latitude} lon: {this.state.location.longitude} address: {this.state.location.address}</Text>
            }
            {!this.state.location &&
              <TouchableOpacity onPress={() => { this.getLocation(); }}>
                <Text>Get location</Text>
              </TouchableOpacity>
            }
          </View>
          <View style={styles.section} />
        </KeyboardAwareScrollView>
      </SafeAreaView>
    );
  }
}

const mapStateToProps = state => ({
  reports: state.reports,
});

const mapDispatchToProps = dispatch => ({
  submitReport: (report, navigation) => dispatch(submitReport(report, navigation)),
  cancelReport: navigation => dispatch(cancelReport(navigation)),
  emailReport: (report, navigation, preferredIOSClient) => dispatch(emailReport(report, navigation, preferredIOSClient)),
});

export default connect(mapStateToProps, mapDispatchToProps)(CreateReport);
