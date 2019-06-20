import React, { Component } from 'react';
import { Platform, StyleSheet, Text, View, Share, Alert, Linking, Image, SafeAreaView } from 'react-native';
import { connect } from 'react-redux';
import DefaultButton from 'app/components/button';
import { shareText } from 'app/utils/constants';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#019864',
  },
  logoWrap: {
    alignItems: 'center',
    paddingVertical: 60,
  },
  button: {
    padding: 20,
    marginTop: 'auto',
  },
  logo: {
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
      console.log('asdfasdfasdf');
      console.log(result);
      if (result.action !== Share.dismissedAction) {
        this.props.navigation.pop();
      }
    } catch (e) {}
  };

  render() {
    const { reports } = this.props;
    const { lastSubmit } = reports;
    const { report } = lastSubmit;
    const numberOfSubmittedReportsStr = `You've sent ${report.id} reports.`;

    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.logoWrap}>
          <Image source={logo} style={styles.logo} />
        </View>
        <View>
          <Text>{numberOfSubmittedReportsStr}</Text>
        </View>
        <View style={styles.button}>
          <DefaultButton
            title="Share"
            onPress={() => this.onShare()}
            solid
          />
          <DefaultButton
            title="Done"
            onPress={() => this.props.navigation.pop()}
            solid
          />
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
});

export default connect(mapStateToProps, mapDispatchToProps)(Done);
