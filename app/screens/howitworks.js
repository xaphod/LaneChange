import React, { Component } from 'react';
import { Platform, StyleSheet, Text, View, Button, Alert, Linking, Image, SafeAreaView, ScrollView } from 'react-native';
import { connect } from 'react-redux';
import DefaultButton from 'app/components/button';
import { navigateToReport } from 'app/actions/ui';
import showTermsAlert from 'app/utils/termsPopup';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#019864',
  },
  logoWrap: {
    alignItems: 'center',
    marginTop: 40,
    marginBottom: 30,
  },
  reportButton: {
    margin: 20,
    marginTop: 'auto',
  },
  stepWrap: {
    marginHorizontal: 30,
    paddingTop: 20,
    marginBottom: 30,
  },
  step: {
    flexDirection: 'row',
    paddingBottom: 20,
    marginBottom: 20,
    borderBottomColor: '#4DB792',
    borderBottomWidth: 1,
  },
  stepLast: {
    flexDirection: 'row',
    paddingBottom: 0,
    marginBottom: 0,
  },
  icon: {
    marginRight: 30,
    marginTop: 5,
  },
  stepTextWrap: {
    flex: 1,
    flexGrow: 1,
  },
  stepHeader: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 5,
  },
  stepText: {
    fontSize: 14,
    lineHeight: 18,
    color: '#B3E0D0',
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
        <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
          <View style={styles.logoWrap}>
            <Image source={logo} style={styles.logo} />
          </View>
          <View style={styles.stepWrap}>
            <View style={styles.step}>
              <Image source={cameraIconTranslucent} style={styles.icon} />
              <View style={styles.stepTextWrap}>
                <Text style={styles.stepHeader}>Take a Photo</Text>
                <Text style={styles.stepText}>Add the location & a note (optional)</Text>
              </View>
            </View>
            <View style={styles.step}>
              <Image source={emailIconTranslucent} style={styles.icon} />
              <View style={styles.stepTextWrap}>
                <Text style={styles.stepHeader}>Create an Email</Text>
                <Text style={styles.stepText}>Your photo, location, and notes are uploaded to LaneChange, then your email app opens with everything filled out for you.</Text>
              </View>
            </View>
            <View style={styles.stepLast}>
              <Image source={sendIconTranslucent} style={styles.icon} />
              <View style={styles.stepTextWrap}>
                <Text style={styles.stepHeader}>Send to City Hall</Text>
                <Text style={styles.stepText}>Use your email app to send the report!</Text>
              </View>
            </View>
          </View>
          <View style={styles.reportButton}>
            <DefaultButton
              title="Get Started"
              onPress={() => {
                if (!this.props.ui.termsAlertShown) {
                  showTermsAlert(() => {
                    this.props.navigateToReport();
                    this.props.navigation.navigate('Report');
                  });
                } else {
                  this.props.navigation.navigate('Report');
                }
              }}
              solid
            />
          </View>
        </ScrollView>
      </SafeAreaView>
    );
  }
}

const mapStateToProps = state => ({
  reports: state.reports,
  ui: state.ui,
});

const mapDispatchToProps = dispatch => ({
  navigateToReport: () => dispatch(navigateToReport()),
});

export default connect(mapStateToProps, mapDispatchToProps)(HowItWorks);
