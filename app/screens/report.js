import React, {Component} from 'react';
import {Platform, StyleSheet, Text, View, Button, Alert, Linking, SafeAreaView, Image}  from 'react-native';
import { connect } from 'react-redux';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f7f7f7',
  },
});

// Note to Marlon: oh hey there. when you `require` a .png file directly (*exactly* as below) react native will magick-in the @2x or @3x as required.
const shutterButton = require('app/assets/img/shutterButton.png');
const trashIcon = require('app/assets/img/trashIcon.png');
const notesIcon = require('app/assets/img/notesIcon.png');
const moreDots = require('app/assets/img/moreDots.png');

class Report extends Component {
  static navigationOptions = () => ({ header: null });

  render() {
    return (
      <SafeAreaView style={styles.container}>
        <Text>Reports screen</Text>
        <Image source={shutterButton} />
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

export default connect(mapStateToProps, mapDispatchToProps)(Report);
