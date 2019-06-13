import React, {Component} from 'react';
import {Platform, StyleSheet, Text, View, Button, Alert, Linking, SafeAreaView}  from 'react-native';
import { connect } from 'react-redux';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#019864',
  },
});

const logo = require('app/assets/img/logo.png');
const cameraIconTranslucent = require('app/assets/img/cameraIconTranslucent.png');
const emailIconTranslucent = require('app/assets/img/emailIconTranslucent.png');
const sendIconTranslucent = require('app/assets/img/sendIconTranslucent.png');

class HowItWorks extends Component {
  static navigationOptions = () => ({ header: null });

  render() {
    return (
      <SafeAreaView style={styles.container}>

      </SafeAreaView>
    );
  }
}

const mapStateToProps = state => ({
  reports: state.reports,
  ui: state.ui,
});

const mapDispatchToProps = dispatch => ({
});

export default connect(mapStateToProps, mapDispatchToProps)(HowItWorks);
