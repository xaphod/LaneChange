import React, {Component} from 'react';
import {Platform, StyleSheet, Text, View, Button, Alert, Image, SafeAreaView, TextInput, TouchableOpacity }  from 'react-native';
import RNLocation from 'react-native-location';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import { connect } from 'react-redux';
import RNFS from 'react-native-fs';
import { HeaderButtons, HeaderButton } from 'react-navigation-header-buttons';
import { photoPath, city } from 'app/utils/constants';
import { submitReport, cancelReport } from 'app/actions/reports';
import reverseGeocode from 'app/utils/location';

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
            navigation.popToTop();
          }}
          title="Submit"
        />
      </HeaderButtons>
    ),
  });

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
    this.props.cancelReport();
    this.props.navigation.popToTop();
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
      date,
      imageURIOnDisk,
      notes,
      city,
    };

    if (location) {
      report.address = location.address;
      report.lon = location.lon;
      report.lat = location.lat;
    }

    this.props.submitReport(report);
  };

  getLocation = async () => {
    RNLocation.configure({
      distanceFilter: 15.0,
    });
    const granted = await RNLocation.requestPermission({
      ios: 'whenInUse',
      android: {
        detail: 'fine',
      },
    });
    if (!granted) {
      console.log('DEBUG createReport: location permission NOT GRANTED');
      return;
    }

    const latestLocation = await RNLocation.getLatestLocation({ timeout: 5000 });
    /* Example location returned
    {
      speed: -1,
      longitude: -0.1337,
      latitude: 51.50998,
      accuracy: 5,
      heading: -1,
      altitude: 0,
      altitudeAccuracy: -1
      floor: 0
      timestamp: 1446007304457.029
    }
    */
    // TODO: test, potentially throw away if bad timestamp, or accuracy etc

    this.setState({
      location: {
        lon: latestLocation.longitude,
        lat: latestLocation.latitude,
      },
    });

    const address = await reverseGeocode(latestLocation.latitude, latestLocation.longitude);
    this.setState((state) => {
      if (state.location.lon === latestLocation.longitude && state.location.lat === latestLocation.latitude) {
        return {
          location: {
            lon: state.location.lon,
            lat: state.location.lat,
            address,
          },
        };
      }

      console.log('DEBUG createReport: NOT updating state as the lat/lon does not match anymore');
      return {
        location: {
          lon: state.location.lon,
          lat: state.location.lat,
        },
      };
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
              <Text>lat: {this.state.location.lat} lon: {this.state.location.lon} address: {this.state.location.address}</Text>
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
  submitReport: report => dispatch(submitReport(report)),
  cancelReport: () => dispatch(cancelReport()),
});

export default connect(mapStateToProps, mapDispatchToProps)(CreateReport);
