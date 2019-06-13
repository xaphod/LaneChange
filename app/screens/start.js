import React, {Component} from 'react';
import {Platform, StyleSheet, Text, View, Button, Alert, Linking, SafeAreaView, Image}  from 'react-native';
import { connect } from 'react-redux';
import { navigateToReport } from 'app/actions/ui';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#019864',
  },
});

// Note to Marlon: oh hey there. when you `require` a .png file directly (*exactly* as below) react native will magick-in the @2x or @3x as required.
const logoShadow = require('app/assets/img/logoShadow.png');

class Start extends Component {
  static navigationOptions = () => ({ header: null });

  render() {
    return (
      <SafeAreaView style={styles.container}>
        <Image source={logoShadow} />
        <Button onPress={ () => {
          this.props.navigateToReport(this.props.navigation);
        }} title="button" />
      </SafeAreaView>
    );
  }
}

const mapStateToProps = state => ({
  reports: state.reports,
  ui: state.ui,
});

const mapDispatchToProps = dispatch => ({
  navigateToReport: navigation => dispatch(navigateToReport(navigation)),
});

export default connect(mapStateToProps, mapDispatchToProps)(Start);
