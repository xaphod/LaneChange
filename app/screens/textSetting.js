import React, { Component } from 'react';
import { Platform, StyleSheet, Text, View, Button, Alert, TextInput, SafeAreaView, Image, TouchableOpacity } from 'react-native';
import { connect } from 'react-redux';
import { headerButtonStyle } from 'app/navigation/headerStyle';
import { photoPath } from 'app/utils/constants';
import consolelog from 'app/utils/logging';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  textInput: {
    flex: 1,
    backgroundColor: '#ffffff',
    margin: 20,
    fontSize: 16,
  },
  headerButton: headerButtonStyle,
  topRow: {
    borderBottomWidth: 1,
    borderColor: '#e8e8e8',
    flexDirection: 'row',
    padding: 20,
  },
  text: {
    fontSize: 14,
  },
});

const backArrowIcon = require('app/assets/img/backArrowIcon.png');

class TextSetting extends Component {
  static navigationOptions = ({ navigation }) => ({
    headerTitle: navigation.getParam('headerTitle', ''),
    headerLeft: (
      <View style={{ flexDirection: 'row' }}>
        <TouchableOpacity
          style={styles.headerButton}
          onPress={() => navigation.getParam('backPressed', navigation.pop)()}
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
  }

  render() {
    const { navigation } = this.props;
    const topText = navigation.getParam('topText', '');
    const onChange = navigation.getParam('onChange', () => {});
    const value = navigation.getParam('value', () => '')();

    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.topRow}>
          <Text style={styles.text}>
            {topText}
          </Text>
        </View>

        <TextInput
          style={styles.textInput}
          onChangeText={text => onChange(text)}
          value={value}
          multiline
          textAlignVertical="top"
          placeholder=""
          autoFocus
        />

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

export default connect(mapStateToProps, mapDispatchToProps)(TextSetting);
