import React, { Component } from 'react';
import { Platform, StyleSheet, Text, View, Button, Alert, TextInput, SafeAreaView, Image, TouchableOpacity } from 'react-native';
import { connect } from 'react-redux';
import { headerButtonStyle } from 'app/navigation/headerStyle';
import { setNotes } from 'app/actions/reports';
import { photoPath } from 'app/utils/constants';

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
    width: '100%',
    height: 90,
    borderBottomWidth: 1,
    borderColor: '#e8e8e8',
    flexDirection: 'row',
  },
  image: {
    width: 90,
    height: 90,
  },
  rightTopRow: {
    marginLeft: 20,
    marginRight: 20,
    justifyContent: 'center',
  },
  dateText: {
    fontSize: 16,
  },
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
    const { reports } = this.props;
    const { draftReport } = reports;
    const { notes, photo, date } = draftReport;
    let imageURIOnDisk;
    let dayText;
    let timeText;
    if (photo) {
      const { filename } = photo;
      imageURIOnDisk = `file://${photoPath()}/${filename}`;
    }
    if (date) {
      const dateObj = new Date(date);
      dayText = dateObj.toLocaleDateString('default', { weekday: 'long', month: 'long', year: 'numeric', day: 'numeric' });
      timeText = dateObj.toLocaleTimeString('default', { hour: 'numeric', minute: 'numeric' });
    }

    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.topRow}>
          <Image
            style={styles.image}
            resizeMode="contain"
            source={{ uri: imageURIOnDisk }}
          />
          <View style={styles.rightTopRow}>
            <Text style={styles.dateText}>
              {`${dayText}\n${timeText}`}
            </Text>
          </View>

        </View>

        <TextInput
          style={styles.textInput}
          onChangeText={notes => this.props.setNotes(notes)}
          value={notes}
          multiline
          textAlignVertical="top"
          placeholder="Describe the situation..."
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
  setNotes: notes => dispatch(setNotes(notes)),
});

export default connect(mapStateToProps, mapDispatchToProps)(Notes);
