import React, {Component} from 'react';
import {Platform, StyleSheet, Text, View, Button, Alert, Linking, SafeAreaView}  from 'react-native';
import { connect } from 'react-redux';
import { navigateToReport } from 'app/actions/ui';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
});

class Start extends Component {
  static navigationOptions = () => ({ header: null });

  render() {
    return (
      <SafeAreaView style={styles.container}>
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
