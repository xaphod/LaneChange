import React, { Component } from 'react';
import { Platform, StyleSheet, Text, View, ScrollView, Button, Alert, Linking, Image, TouchableOpacity, SafeAreaView } from 'react-native';
import { connect } from 'react-redux';
import { headerButtonStyle } from 'app/navigation/headerStyle';
import MenuItem from 'app/components/menuItem';
import { openTerms, openPrivacy, openSolodigitalis, openSource } from 'app/utils/constants';
import { deleteAllData, deleteClear } from 'app/actions/reports';
import LoadingView from 'app/components/loadingview';

const styles = StyleSheet.create({
  wrap: {
    flex: 1,
    backgroundColor: '#f7f7f7',
  },
  scrollview: {
    backgroundColor: '#f7f7f7',
  },
  container: {
    flex: 1,
    backgroundColor: '#f7f7f7',
    paddingTop: 20,
    paddingBottom: 20,
  },
  version: {
    alignItems: 'center',
  },
  versionText: {
    fontSize: 12,
    lineHeight: 20,
    color: '#979797',
  },
  headerButton: headerButtonStyle,
});

const backArrowIcon = require('app/assets/img/backArrowIcon.png');
const notesIcon = require('app/assets/img/notesIcon.png');

class Menu extends Component {
  static navigationOptions = ({ navigation }) => ({
    headerTitle: 'Info',
    headerLeft: (
      <View style={{ flexDirection: 'row' }}>
        <TouchableOpacity
          style={styles.headerButton}
          onPress={() => navigation.state.params.backPressed()}
        >
          <Image source={backArrowIcon} />
        </TouchableOpacity>
      </View>
    ),
    headerRight: undefined,
  });

  constructor(props) {
    super(props);
    this.state = {
    };

    this.backPressed = this.backPressed.bind(this);
    this.deleteUserData = this.deleteUserData.bind(this);
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    const { reports } = nextProps;
    if (reports && reports.inProgress) {
      return {
        ...prevState,
        showLoading: true,
      };
    }
    const newState = prevState;

    if (reports && reports.deleteAllData) {
      nextProps.deleteClear();
      const { deleteAllDataError } = reports;
      if (deleteAllDataError) {
        Alert.alert(
          'Error deleting data',
          deleteAllDataError.message,
          [
            {
              text: 'OK',
            },
          ],
        );
      } else {
        Alert.alert(
          'All data deleted',
          'All of your data on this device and in the Cloud was deleted.',
          [
            {
              text: 'OK',
            },
          ],
        );
      }
    }

    return {
      ...newState,
      showLoading: undefined,
    };
  }

  componentDidMount() {
    this.props.navigation.setParams({
      backPressed: this.backPressed,
    });
  }

  backPressed = () => {
    this.props.navigation.pop();
  }

  deleteUserData = () => {
    Alert.alert(
      'Delete all of your data?',
      'WARNING, READ CAREFULLY: You are about to permanently and irrevocably delete all of your LaneChange data, on this device and stored in the Cloud. This includes photos, report notes, locations, and more -- which means that any emails you sent via LaneChange will contain dead links. Are you really sure you want to do this?',
      [
        {
          text: '💣 NUKE FROM ORBIT 💥',
          onPress: () => this.props.deleteUserData(),
          style: 'destructive',
        },
        {
          text: 'Cancel',
          style: 'cancel',
        },
      ],
    );
  }

  render() {
    const { navigation } = this.props;
    const { showLoading } = this.state;

    return (
      <SafeAreaView style={styles.wrap}>
        <ScrollView style={styles.scrollview}>
          <View style={styles.container}>
            <MenuItem
              onPress={() => navigation.navigate('')}
              title="Why It Matters"
              icon={notesIcon}
            />
            <MenuItem
              onPress={() => navigation.navigate('HowItWorks')}
              title="How It Works"
              icon={notesIcon}
            />
            <MenuItem
              onPress={() => navigation.navigate('')}
              title="FAQ"
              icon={notesIcon}
              last
            />

            <MenuItem
              onPress={() => openTerms()}
              title="Terms & Conditions"
            />
            <MenuItem
              onPress={() => openPrivacy()}
              title="Privacy Policy"
              last
            />

            <MenuItem
              onPress={() => openSolodigitalis()}
              title="Developer Info"
            />
            <MenuItem
              onPress={() => openSource()}
              title="Open-source repo (GitHub)"
              last
            />

            <MenuItem
              onPress={() => this.deleteUserData()}
              title="Delete my data..."
              textProps={{ color: 'red' }}
              last
            />

            <View style={styles.version}>
              <Text style={styles.versionText}>LaneChange v1.0.0</Text>
              <Text style={styles.versionText}>Developed by Solodigitalis in #hamont</Text>
            </View>
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
  deleteUserData: () => dispatch(deleteAllData()),
  deleteClear: () => dispatch(deleteClear()),
});

export default connect(mapStateToProps, mapDispatchToProps)(Menu);
