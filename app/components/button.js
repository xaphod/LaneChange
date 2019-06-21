import React, { Component } from 'react';
import { Platform, StyleSheet, Text, View, Button, Alert, Linking, TouchableOpacity } from 'react-native';
import { disabledColor } from 'app/utils/constants';

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
    fontSize: 18,
  },
  buttonStyleDisabled: {
    borderColor: disabledColor,
  },
});

export default class DefaultButton extends Component {
  render() {
    let buttonStyleEnabled = styles.button;
    const { solid } = this.props;
    if (!solid) {
      buttonStyleEnabled = {
        ...buttonStyleEnabled,
        ...styles.buttonOutline,
      };
    }
    let buttonStyleDisabled = buttonStyleEnabled;
    buttonStyleDisabled = {
      ...buttonStyleDisabled,
      ...styles.buttonStyleDisabled,
    };

    const controlsDisabled = this.props.disabled;

    return (
      <TouchableOpacity
        style={controlsDisabled ? buttonStyleDisabled : buttonStyleEnabled}
        onPress={() => this.props.onPress()}
        disabled={controlsDisabled}
      >
        {!!this.props.children &&
          { ...this.props.children }
        }
        <Text style={controlsDisabled ? { ...styles.buttonText, color: disabledColor } : styles.buttonText}>{this.props.title}</Text>
      </TouchableOpacity>
    );
  }
}
