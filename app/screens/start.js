import React, { Component } from 'react';
import { Platform, StyleSheet, Text, View, Dimensions, Alert, Linking, TouchableOpacity, SafeAreaView, Image } from 'react-native';
import { connect } from 'react-redux';
import { navigateToReport } from 'app/actions/ui';
import DefaultButton from 'app/components/button';
import showTermsAlert from 'app/utils/termsPopup';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#019864',
  },
  bottom: {
    marginTop: 'auto',
    padding: 20,
  },
  reportButton: {
    marginTop: 10,
  },
  introText: {
    fontSize: 28,
    fontWeight: 'bold',
    lineHeight: 38,
    color: '#fff',
    textAlign: 'center',
    paddingHorizontal: 30,
    marginTop: -120,
  },
  logo: {
    marginLeft: -185,
  },
  links: {
    flexDirection: 'row',
    justifyContent: 'center',
    padding: 20,
  },
  linkButton: {
    color: '#fff',
    fontSize: 18,
    textDecorationLine: 'underline',
    textDecorationStyle: 'solid',
    textDecorationColor: '#fff',
  },
  logoContainer: {
    marginTop: 40,
    flexDirection: 'row',
    justifyContent: 'center',
  },
});

// Note to Marlon: oh hey there. when you `require` a .png file directly (*exactly* as below) react native will magick-in the @2x or @3x as required.
const logoShadow = require('app/assets/img/logoShadow.png');

class Start extends Component {
  static navigationOptions = () => ({ header: null });

  render() {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.logoContainer}>
          <Image source={logoShadow} style={styles.logo} />
        </View>
        <Text style={styles.introText}>
          LaneChange reports obstructed bike lanes & sidewalks to your city
        </Text>

        <View style={styles.bottom}>
          <View style={styles.links}>

            <TouchableOpacity
              style={styles.linkButton}
              onPress={() => this.props.navigation.navigate('HowItWorks')}
            >
              <Text style={styles.linkButton}>How it Works</Text>
            </TouchableOpacity>

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
        </View>

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

export default connect(mapStateToProps, mapDispatchToProps)(Start);
