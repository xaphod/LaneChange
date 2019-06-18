import React, { Component } from 'react';
import { Platform, StyleSheet, Text, View, Button, Alert, Linking, TouchableOpacity, SafeAreaView, Image } from 'react-native';
import { connect } from 'react-redux';
import { navigateToReport } from 'app/actions/ui';
import DefaultButton from 'app/components/button';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#019864',
  },
  bottom: {
    marginTop: 'auto',
    paddingHorizontal: 20,
  },
  reportButton: {
    marginTop: 10,
  },
  introText: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
    paddingHorizontal: 40,
    paddingTop: 240,
    zIndex: 2,
  },
  logo: {
    position: 'absolute',
    top: 100,
    left: -50,
    zIndex: 1,
  },
  links: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 20,
  },
  linkButton: {
    color: '#fff',
    fontSize: 16,
    textDecorationLine: 'underline',
    textDecorationStyle: 'solid',
    textDecorationColor: '#fff',
  },
});

// Note to Marlon: oh hey there. when you `require` a .png file directly (*exactly* as below) react native will magick-in the @2x or @3x as required.
const logoShadow = require('app/assets/img/logoShadow.png');

class Start extends Component {
  static navigationOptions = () => ({ header: null });

  render() {
    return (
      <SafeAreaView style={styles.container}>

        <Text style={styles.introText}>Lane Change makes it easy to inform City Hall of bike lane obstructions</Text>

        <Image source={logoShadow} style={styles.logo} />

        <View style={styles.bottom}>
          <View style={styles.links}>

            <TouchableOpacity
              style={styles.linkButton}
              onPress={() => this.props.navigation.navigate('HowItWorks')}
            >
              <Text style={styles.linkButton}>How it Works</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.linkButton}
              onPress={() => this.props.navigation.navigate('WhyItMatters')}
            >
              <Text style={styles.linkButton}>Why it Matters</Text>
            </TouchableOpacity>

          </View>
          <View style={styles.reportButton}>
            <DefaultButton
              title="Create a Report"
              onPress={() => {
                this.props.navigateToReport(this.props.navigation);
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
  navigateToReport: navigation => dispatch(navigateToReport(navigation)),
});

export default connect(mapStateToProps, mapDispatchToProps)(Start);
