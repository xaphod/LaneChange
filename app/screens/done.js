import React, { Component } from 'react';
import { Platform, ScrollView, StyleSheet, Text, View, Share, Alert, Linking, TouchableOpacity, Image, SafeAreaView } from 'react-native';
import { connect } from 'react-redux';
import DefaultButton from 'app/components/button';
import { shareText } from 'app/utils/constants';
import consolelog from 'app/utils/logging';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#019864',
  },
  logoWrap: {
    alignItems: 'center',
    marginBottom: 20,
  },
  button: {
    margin: 20,
    marginTop: 'auto',
  },
  logo: {
  },
  doneButton: {
  },
  doneButtonText: {
    fontSize: 16,
    color: '#fff',
  },
  doneWrap: {
    padding: 20,
    justifyContent: 'center',
  },
  doneHeader: {
    textAlign: 'center',
    color: '#fff',
    fontSize: 48,
    lineHeight: 60,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  doneSubHeader: {
    textAlign: 'center',
    color: '#fff',
    fontSize: 24,
  },
  doneText: {
    textAlign: 'center',
    color: '#fff',
    fontSize: 18,
    lineHeight: 28,
    paddingHorizontal: 20,
  },
  doneSpacer: {
    backgroundColor: '#4DB792',
    height: 1,
    marginVertical: 20,
  },
  buttonContainer: {
    margin: 20,
    marginRight: 30,
    flexDirection: 'row',
  },
});

const logo = require('app/assets/img/logo.png');

class Done extends Component {
  static navigationOptions = () => ({ header: null });

  constructor(props) {
    super(props);
    this.onShare = this.onShare.bind(this);
  }

  onShare = async () => {
    try {
      const result = await Share.share({ message: shareText() });
      consolelog('asdfasdfasdf');
      consolelog(result);
      if (result.action !== Share.dismissedAction) {
        this.props.navigation.pop();
      }
    } catch (e) { }
  };

  render() {
    const { reports } = this.props;
    const { lastSubmit } = reports;
    const { report } = lastSubmit;
    const numberOfSubmittedReportsStr = `You've sent ${report.id} reports.`;

    return (
      <SafeAreaView style={styles.container}>
        <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
          <View style={styles.buttonContainer}>
            <View style={{ flex: 1 }} />
            <TouchableOpacity
              style={styles.doneButton}
              onPress={() => this.props.navigation.pop()}
            >
              <Text style={styles.doneButtonText}>Done</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.logoWrap}>
            <Image source={logo} style={styles.logo} />
          </View>
          <View style={styles.doneWrap}>
            <Text style={styles.doneHeader}>You did it!</Text>
            <Text style={styles.doneSubHeader}>{numberOfSubmittedReportsStr}</Text>
            <Text style={styles.doneSubHeader}>Keep up the good work!</Text>
            <View style={styles.doneSpacer} />
            <Text style={styles.doneText}>This report will help city officials make better decisions about the future developments of our roads.</Text>
          </View>
          <View style={styles.button}>
            <DefaultButton
              title="Share LaneChange"
              onPress={() => this.onShare()}
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
});

export default connect(mapStateToProps, mapDispatchToProps)(Done);
