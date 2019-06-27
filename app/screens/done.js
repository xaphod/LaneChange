import React, { Component } from 'react';
import { AppState, ScrollView, StyleSheet, Text, View, Share, TouchableOpacity, Image, SafeAreaView } from 'react-native';
import { connect } from 'react-redux';
import DefaultButton from 'app/components/button';
import { shareTextAppLink } from 'app/utils/constants';
import consolelog from 'app/utils/logging';
import { shortenLink } from 'app/utils/firebase';
import LoadingView from 'app/components/loadingview';

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
    padding: 10,
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
    lineHeight: 34,
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
    margin: 10,
    marginRight: 20,
    flexDirection: 'row',
  },
});

const logo = require('app/assets/img/logo.png');

class Done extends Component {
  static navigationOptions = () => ({ header: null });

  constructor(props) {
    super(props);
    this.onShare = this.onShare.bind(this);
    this.state = {
      appState: AppState.currentState,
      dateShown: JSON.stringify(new Date()),
    };
    AppState.addEventListener('change', this._handleAppStateChange);
  }

  componentDidMount() {
    AppState.addEventListener('change', this._handleAppStateChange);
  }

  componentWillUnmount() {
    AppState.removeEventListener('change', this._handleAppStateChange);
  }

  onShare = async () => {
    try {
      const { reports, ui } = this.props;
      const { shareText } = ui;
      const { lastSubmit } = reports;
      let result;
      this.setState({ showLoading: true });
      if (lastSubmit && lastSubmit.report && lastSubmit.report.imageLink) {
        consolelog('onShare - calling shortenLink');
        const shortLink = await shortenLink(lastSubmit.report.imageLink);
        const text = `${shareText}\n${shortLink}`;
        consolelog(`onShare - text=${text}`);
        result = await Share.share({ message: text });
      } else {
        result = await Share.share({ message: shareTextAppLink() });
      }
      this.setState({ showLoading: false });
      if (result.action !== Share.dismissedAction) {
        this.props.navigation.pop();
      }
    } catch (e) {
      this.setState({ showLoading: false });
    }
  };

  _handleAppStateChange = (nextAppState) => {
    const { appState, dateShown } = this.state;
    const { navigation } = this.props;
    this.setState(
      { appState: nextAppState },
      () => {
        if (
          appState.match(/inactive|background/) &&
          nextAppState === 'active'
        ) {
          const dateShownObj = new Date(JSON.parse(dateShown));
          const secondsSinceShown = Math.floor(Date.now() / 1000) - Math.floor(dateShownObj / 1000);
          consolelog(`App has come to the foreground! secondsSinceshown:${secondsSinceShown}`);
          if (secondsSinceShown > 180) {
            navigation.pop();
          }
        }
      },
    );
  };

  render() {
    const { reports } = this.props;
    const { lastSubmit } = reports;
    const { report } = lastSubmit;
    const numberOfSubmittedReportsStr = `You've sent ${report.id} reports.`;
    const { showLoading } = this.state;

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
              title="Share this report"
              onPress={() => this.onShare()}
              solid
            />
          </View>
        </ScrollView>
        {!!showLoading && (
          <LoadingView />
        )}
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
