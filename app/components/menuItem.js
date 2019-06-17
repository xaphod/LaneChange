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
  menuItemIcon: {},
  menuItemText: {
    marginLeft: 20,
    color: '#000',
    fontSize: 16,
  },
  menuItemChevron: {
    fontSize: 14,
    color: '#B9B9B9',
    marginLeft: 'auto',
  },
  menuItemLast: {
    marginBottom: 20,
  }
});

export default class MenuItem extends Component {
  render() {
    let menuItemStyle = styles.menuItem;
    const { last } = this.props;
    if (last) {
      menuItemStyle = {
        ...menuItemStyle,
        ...styles.menuItemLast,
      };
    }
    return (
      <TouchableOpacity
        style={menuItemStyle}
        onPress={() => {
          this.props.onPress();
        }}
      >
        {!!this.props.icon &&
          <Image source={this.props.icon} style={styles.menuItemIcon} />
        }
        <Text style={styles.menuItemText}>{this.props.title}</Text>
        <Text style={styles.menuItemChevron}>&gt;</Text>
      </TouchableOpacity>
    );
  }
}