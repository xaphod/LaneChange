import React, {Component} from 'react';
import {Platform, StyleSheet, Text, View, Button, Alert, Linking, SafeAreaView}  from 'react-native';
import { connect } from 'react-redux';
import Camera from 'app/components/camera';
import { createReport } from 'app/actions/reports';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
  },
  camera: {
    flex: 1,
  },
});

// this.props.navigation.navigate('Camera')
class Home extends Component {
  static navigationOptions = () => ({ header: null });

  constructor(props) {
    super(props);

    this.state = {
      takingPhoto: false,
    };

    this.onTakingPhoto = this.onTakingPhoto.bind(this);
    this.onPhotoTaken = this.onPhotoTaken.bind(this);
    this.navigateOnDraftReport = this.navigateOnDraftReport.bind(this);
  }

  componentDidMount() {
    this.navigateOnDraftReport();
  }

  navigateOnDraftReport = () => {
    const { reports } = this.props;
    const { draftReport } = reports;
    const { navigation } = this.props;
    if (draftReport && navigation) {
      navigation.navigate('CreateReport');
    }
  };

  onTakingPhoto = () => {
    this.setState({
      takingPhoto: true,
    });
  };

  onPhotoTaken = (photo) => {
    if (!photo) {
      // TODO: some sort of error display to user
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
    console.log(`DEBUG home: onPhotoTaken, uri is ${photo.uri}`);
    this.props.createReport(Date(), photo);
    this.navigateOnDraftReport();
    this.setState({
      takingPhoto: false,
    });
  };

  render() {
    return (
      <SafeAreaView style={styles.container}>
        <Camera
          style={styles.camera}
          onTakingPhoto={this.onTakingPhoto}
          onPhotoTaken={this.onPhotoTaken}
        >
          {!!this.state.takingPhoto && 
            <Text style={{ color: 'white' }}>Please wait...</Text>
          }
        </Camera>
      </SafeAreaView>
    );
  }
}

const mapStateToProps = state => ({
  reports: state.reports,
});

const mapDispatchToProps = dispatch => ({
  createReport: (date, photo) => dispatch(createReport(date, photo)),
});

export default connect(mapStateToProps, mapDispatchToProps)(Home);
