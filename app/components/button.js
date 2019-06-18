import React, { Component } from 'react';
import { Platform, StyleSheet, Text, View, Button, Alert, Linking, TouchableOpacity } from 'react-native';

const styles = StyleSheet.create({
  button: {
    justifyContent: 'center',
    alignItems: 'center',
    height: 70,
    backgroundColor: '#fff',
    borderRadius: 6,
  },
  buttonOutline: {
    borderColor: '#019864',
    borderWidth: 1,
  },
  buttonText: {
    color: '#019864',
    fontSize: 16,
  },
});

export default class DefaultButton extends Component {
  render() {
    let buttonStyle = styles.button;
    const { solid } = this.props;
    if (!solid) {
      buttonStyle = {
        ...buttonStyle,
        ...styles.buttonOutline,
      };
    }
    return (
      <TouchableOpacity
        style={buttonStyle}
        onPress={() => this.props.onPress()}
      >
        {!!this.props.children &&
          { ...this.props.children }
        }
        <Text style={styles.buttonText}>{this.props.title}</Text>
      </TouchableOpacity>
    );
  }
}
