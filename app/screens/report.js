import React, {Component} from 'react';
import {Platform, StyleSheet, Text, View, Button, Alert, Linking, SafeAreaView, Image, TouchableOpacity}  from 'react-native';
import { connect } from 'react-redux';
import { submitReport, cancelReport } from 'app/actions/reports';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f7f7f7',
  },
  headerButton: {
    paddingHorizontal: 15,
    height: 30,
    justifyContent: 'center',
  },
});

// Note to Marlon: oh hey there. when you `require` a .png file directly (*exactly* as below) react native will magick-in the @2x or @3x as required.
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

  render() {
    return (
      <SafeAreaView style={styles.container}>
        <Text>Reports screen</Text>
        <Image source={shutterButton} />
        <Button
          title="Add Notes"
          onPress={() => this.props.navigation.navigate('Notes')}
        />
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
});

export default connect(mapStateToProps, mapDispatchToProps)(Report);
