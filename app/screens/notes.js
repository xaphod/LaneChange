import React, {Component} from 'react';
import {Platform, StyleSheet, Text, View, Button, Alert, Linking, SafeAreaView}  from 'react-native';
import { connect } from 'react-redux';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
  },
});

const backArrowIcon = require('app/assets/img/backArrowIcon.png');

class Notes extends Component {
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

export default connect(mapStateToProps, mapDispatchToProps)(Notes);
