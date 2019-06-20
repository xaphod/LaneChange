import React, { Component } from 'react';
import { Platform, StyleSheet, Text, View, Button, Alert, Image, Linking, TouchableOpacity } from 'react-native';

const styles = StyleSheet.create({
  menuItem: {
    height: 60,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginBottom: 1,
    backgroundColor: '#fff',
  },
  menuItemIcon: {
    marginRight: 20,
  },
  menuItemText: {
    color: '#000',
    fontSize: 16,
  },
  chevronIcon: {
    marginLeft: 'auto',
  },
  menuItemLast: {
    marginBottom: 20,
  },
  selected: {
    backgroundColor: '#019864',
  },
});

const chevronIcon = require('app/assets/img/chevronIcon.png');

export default class MenuItem extends Component {
  render() {
    let menuItemStyle = styles.menuItem;
    const { last, selected } = this.props;
    if (last) {
      menuItemStyle = {
        ...menuItemStyle,
        ...styles.menuItemLast,
      };
    }

    if (selected) {
      menuItemStyle = {
        ...menuItemStyle,
        ...styles.selected,
      };
    }

    let textStyle;
    if (selected) {
      textStyle = { ...styles.menuItemText, color: '#fff', ...this.props.textProps };
    } else {
      textStyle = { ...styles.menuItemText, ...this.props.textProps };
    }

    const { icon } = this.props;
    const { title } = this.props;
    const { onPress } = this.props;

    return (
      <TouchableOpacity
        style={menuItemStyle}
        onPress={() => {
          onPress();
        }}
      >
        {!!icon && (
          <Image source={icon} style={styles.menuItemIcon} />
        )
        }
        <Text style={textStyle}>{title}</Text>
        <Image source={chevronIcon} style={styles.chevronIcon} />
      </TouchableOpacity>
    );
  }
}