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
  menuItemRightText: {
    color: '#000',
    fontSize: 12,
    marginLeft: 'auto',
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
    if (selected) {
      menuItemStyle = {
        ...menuItemStyle,
        ...styles.selected,
      };
    }
    if (last) {
      menuItemStyle = {
        ...menuItemStyle,
        ...styles.menuItemLast,
      };
    }

    let textStyle, rightTextStyle;
    if (selected) {
      textStyle = { ...styles.menuItemText, color: '#fff', ...this.props.textProps };
      rightTextStyle = { ...styles.menuItemRightText, color: '#fff', ...this.props.rightTextProps };
    } else {
      textStyle = { ...styles.menuItemText, ...this.props.textProps };
      rightTextStyle = { ...styles.menuItemRightText, ...this.props.rightTextProps };
    }

    const {
      icon,
      title,
      onPress,
      noChevron,
      rightTitle,
    } = this.props;

    return (
      <TouchableOpacity
        style={menuItemStyle}
        onPress={() => {
          onPress();
        }}
      >
        {!!icon && (
          <Image source={icon} style={styles.menuItemIcon} />
        )}
        <Text style={textStyle}>{title}</Text>
        {(!rightTitle && !noChevron) && (
          <Image source={chevronIcon} style={styles.chevronIcon} />
        )}
        {!!rightTitle && (
          <Text style={rightTextStyle}>{rightTitle}</Text>
        )}
      </TouchableOpacity>
    );
  }
}