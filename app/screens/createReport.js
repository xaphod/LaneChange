import React, {Component} from 'react';
import {Platform, StyleSheet, Text, View, Button, Alert, Image, SafeAreaView, TextInput, TouchableOpacity }  from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import { connect } from 'react-redux';
import RNFS from 'react-native-fs';
import { HeaderButtons, HeaderButton } from 'react-navigation-header-buttons';
import { photoPath, city } from 'app/utils/constants';
import { submitReport, cancelReport } from 'app/actions/reports';
import { getLocation } from 'app/utils/location';

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
    const { reports } = nextProps;
    const { lastSubmit } = reports;
    if (!lastSubmit) {
      return {
        ...prevState,
        submitting: null,
      };
    }

    const { error, report } = lastSubmit;
    const { lastReportIDAlerted, submitting } = prevState;
    console.log(`createReport getDerivedStateFromProps - report.id=${report.id}, lastReportIDAlerted=${lastReportIDAlerted}, error is`);
    console.log(error);

    if (error && error.message && report.id !== lastReportIDAlerted) {
      if (submitting) {
        return {
          ...prevState,
          submitting: null,
        };
      }
      Alert.alert(
        'Uh oh',
        error.message,
        [
          {
            text: 'OK',
          },
        ],
      );

      return {
        ...prevState,
        lastReportIDAlerted: report.id,
      };
    }
    return {
      ...prevState,
      submitting: null,
    };
}

  constructor(props) {
    super(props);
    this.state = {
      notes: null,
      location: null,
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

  cancel = () => {
    console.log('DEBUG createReport: cancelling');
    this.props.cancelReport(this.props.navigation);
  };

  submit = () => {
    console.log('DEBUG createReport: submitting');
    const { reports } = this.props;
    const { draftReport } = reports;
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
      lastReportIDAlerted: null,
      submitting: true,
    }, () => {
      this.props.submitReport(report, this.props.navigation);
    });
  };

  getLocation = async () => {
    const location = await getLocation();
    this.setState({
      location,
    }, () => {
      if (!location) {
        const bodyStr = Platform.select({
          ios: 'Please ensure this app has access to your location, and that Location Services are turned on.',
          android: 'Please ensure that Location is turned on with high accuracy enabled.',
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
              <TouchableOpacity onPress={() => { this.getLocation() }}>
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
});

export default connect(mapStateToProps, mapDispatchToProps)(CreateReport);
