import React, { Component } from 'react';
import { Platform, StyleSheet, Text, View, ScrollView, Button, Alert, Linking, Image, TouchableOpacity, SafeAreaView } from 'react-native';
import { connect } from 'react-redux';
import { headerButtonStyle } from 'app/navigation/headerStyle';
import MenuItem from 'app/components/menuItem';

const styles = StyleSheet.create({
  wrap: {
    flex: 1,
  },
  container: {
    flex: 1,
    backgroundColor: '#f7f7f7',
    paddingTop: 20,
  },
  version: {
    alignItems: 'center',
  },
  versionText: {
    fontSize: 12,
    color: '#9b9b9b',
  },
  solodigitalisButton: {
    marginTop: 5,
  },
  solodigitalisButtonText: {
    fontSize: 12,
    color: '#019864',
  },
  headerButton: headerButtonStyle,
});

const backArrowIcon = require('app/assets/img/backArrowIcon.png');
const cycleIcon = require('app/assets/img/CycleHam.png');
const faqIcon = require('app/assets/img/FAQ.png');
const howIcon = require('app/assets/img/How.png');
const whyIcon = require('app/assets/img/Why.png');

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
  }

  componentDidMount() {
    this.props.navigation.setParams({
      backPressed: this.backPressed,
    });
  }

  backPressed = () => {
    this.props.navigation.pop();
  }

  render() {

    const { navigation } = this.props;

    return (
      <SafeAreaView style={styles.wrap}>
        <ScrollView style={styles.container}>
          <MenuItem
            onPress={() => navigation.navigate('')}
            title="Why It Matters"
            icon={whyIcon}
          />
          <MenuItem
            onPress={() => navigation.navigate('HowItWorks')}
            title="How It Works"
            icon={howIcon}
          />
          <MenuItem
            onPress={() => navigation.navigate('')}
            title="About Cycle Hamilton"
            icon={cycleIcon}
          />
          <MenuItem
            onPress={() => navigation.navigate('')}
            title="FAQ"
            icon={faqIcon}
            last
          />
          <MenuItem
            onPress={() => navigation.navigate('')}
            title="Terms & Conditions"
          />
          <MenuItem
            onPress={() => navigation.navigate('')}
            title="Privacy Policy"
            last
          />
          <MenuItem
            onPress={() => navigation.navigate('')}
            title="Developer Info"
          />
          <MenuItem
            onPress={() => navigation.navigate('')}
            title="Open Source Repo"
            last
          />
          <View style={styles.version}>
            <Text style={styles.versionText}>LaneChange v1.0.0</Text>
            <TouchableOpacity
              style={styles.solodigitalisButton}
              onPress={() => this.props.navigation.navigate('')}
            >
              <Text style={styles.solodigitalisButtonText}>Developed by Solidigitalis</Text>
            </TouchableOpacity>
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

export default connect(mapStateToProps, mapDispatchToProps)(Menu);
