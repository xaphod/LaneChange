import React, { Component } from 'react';
import { Platform, StyleSheet, Text, View, ScrollView, Button, Alert, Linking, Image, TouchableOpacity, SafeAreaView } from 'react-native';
import { connect } from 'react-redux';
import { registerFirebaseAuthHandler } from 'app/utils/firebase';
import { retrieveCities } from 'app/actions/cities';

class Cities extends Component {
  constructor(props) {
    super(props);
    this.retrieveCities = this.retrieveCities.bind(this);
    registerFirebaseAuthHandler(async (user) => {
      await this.retrieveCities();
    });
  }

  retrieveCities = async () => {
    if (this.props.cities.retrievedCities || this.props.cities.retreivingCities) {
      console.log('DEBUG cites/retrieveCities: no-op, already retrieved/retrieving');
      return;
    }
    this.props.retrieveCities();
  };

  render() {
    return null;
  }
}

const mapStateToProps = state => ({
  cities: state.cities,
});

const mapDispatchToProps = dispatch => ({
  retrieveCities: () => dispatch(retrieveCities()),
});

export default connect(mapStateToProps, mapDispatchToProps)(Cities);
