import React, { Component } from 'react';
import { Platform, StyleSheet, Text, View, Button, Alert, Linking, SafeAreaView, Image, TouchableOpacity } from 'react-native';
import { connect } from 'react-redux';
import { submitReport, cancelReport } from 'app/actions/reports';
import DefaultButton from 'app/components/button';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f7f7f7',
  },
  headerButton: {
    paddingHorizontal: 20,
    height: 30,
    justifyContent: 'center',
  },
  camera: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'flex-end',
    backgroundColor: '#f20000',
  },
  shutterButton: {
    marginBottom: 20,
  },
  text: {
    fontSize: 16,
  },
  report: {
    height: 245,
    backgroundColor: '#f7f7f7',
  },
  reportMeta: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    height: 55,
    paddingHorizontal: 20,
    backgroundColor: '#fff',
    borderColor: '#E8E8E8',
    borderBottomWidth: 1,
  },
  addNoteButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    paddingHorizontal: 20,
    height: 60,
    backgroundColor: '#fff',
    borderColor: '#F0F0F0',
    borderWidth: 1,
    borderRadius: 6,
  },
  addNoteButtonText: {
    fontSize: 14,
    color: '#019864',
    paddingLeft: 20,
  },
  addNoteChevron: {
    fontSize: 14,
    color: '#B9B9B9',
    marginLeft: 'auto',
  },
  reportActions: {
    padding: 20,
  },
});

// Note to Marlon: oh hey there. when you `require` a .png file directly (*exactly* as below) react native will magick-in the @2x or @3x as required.
const shutterButton = require('app/assets/img/shutterButton.png');
const notesIcon = require('app/assets/img/notesIcon.png');
const trashIcon = require('app/assets/img/trashIcon.png');
const moreDots = require('app/assets/img/moreDots.png');

class Report extends Component {
  static navigationOptions = ({ navigation }) => ({
    headerTitle: 'File a Report',
    headerLeft: (
      <View style={{ flexDirection: 'row' }}>
        <TouchableOpacity
          style={styles.headerButton}
          onPress={() => navigation.state.params.trashPressed()}
        >
          <Image source={trashIcon} />
        </TouchableOpacity>
      </View>
    ),
    headerRight: (
      <View style={{ flexDirection: 'row' }}>
        <TouchableOpacity
          style={styles.headerButton}
          onPress={() => navigation.state.params.morePressed()}
        >
          <Image source={moreDots} />
        </TouchableOpacity>
      </View>
    ),
  });

  constructor(props) {
    super(props);
    this.state = {
    };

    this.trashPressed = this.trashPressed.bind(this);
    this.morePressed = this.morePressed.bind(this);
  }

  componentDidMount() {
    this.props.navigation.setParams({
      trashPressed: this.trashPressed,
      morePressed: this.morePressed,
    });
  }

  trashPressed = () => {
    Alert.alert(
      'Discard this Report?',
      'Are you sure you want to discard this report? There is no undo button.',
      [
        {
          text: 'Discard',
          onPress: () => this.props.cancelReport(this.props.navigation),
        },
        {
          text: 'Cancel',
          style: 'cancel',
        },
      ],
    );
  }

  morePressed = () => {
    this.props.navigation.navigate('Menu');
  }

  render() {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.camera}>
          <Image source={shutterButton} style={styles.shutterButton} />
        </View>
        <View style={styles.report}>
          <View style={styles.reportMeta}>
            <Text style={styles.text}>Tue, June 11, 2019</Text>
            <Text style={styles.text}>10:28 am</Text>
          </View>
          <View style={styles.reportActions}>
            <TouchableOpacity
              style={styles.addNoteButton}
              onPress={() => this.props.navigation.navigate('Notes')}
            >
              <Image source={notesIcon} />
              <Text style={styles.addNoteButtonText}>Add Note</Text>
              <Text style={styles.addNoteChevron}>&gt;</Text>
            </TouchableOpacity>
            <DefaultButton
              title="Create Email"
              onPress={() => { }}
            />
          </View>
        </View>
      </SafeAreaView>
    );
  }
}

const mapStateToProps = state => ({
  reports: state.reports,
  ui: state.ui,
});

const mapDispatchToProps = dispatch => ({
  cancelReport: navigation => dispatch(cancelReport(navigation)),
  submitReport: (report, navigation, preferredIOSClient) => dispatch(submitReport(report, navigation, preferredIOSClient)),
});

export default connect(mapStateToProps, mapDispatchToProps)(Report);
