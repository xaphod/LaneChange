import React, { Component } from 'react';
import { Platform, StyleSheet, Text, View, ScrollView, Button, Alert, Linking, Image, TouchableOpacity, SafeAreaView } from 'react-native';
import { connect } from 'react-redux';
import { headerButtonStyle } from 'app/navigation/headerStyle';
import MenuItem from 'app/components/menuItem';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f7f7f7',
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
    return (
      <SafeAreaView style={styles.container}>
        <ScrollView style={styles.container}>
          <MenuItem
            onPress={() => this.props.navigation.navigate('HowItWorks')}
            title="How It Works"
            last
          />
          <MenuItem
            onPress={() => this.props.navigation.navigate('HowItWorks')}
            title="How It Works"
          />
          <MenuItem
            onPress={() => this.props.navigation.navigate('HowItWorks')}
            title="How It Works"
          />
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
