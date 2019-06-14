import React, { Component } from 'react';
import { Platform, StyleSheet, Text, View, Button, Alert, Linking, SafeAreaView, Image, TouchableOpacity } from 'react-native';
import { connect } from 'react-redux';
import { headerButtonStyle } from 'app/navigation/headerStyle';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  headerButton: headerButtonStyle,
});

const backArrowIcon = require('app/assets/img/backArrowIcon.png');

class Notes extends Component {
  static navigationOptions = ({ navigation }) => ({
    headerTitle: 'Add Note',
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
        <Text>Notes!</Text>
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

export default connect(mapStateToProps, mapDispatchToProps)(Notes);
