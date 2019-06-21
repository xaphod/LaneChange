import React, { Component } from 'react';
import { Platform, StyleSheet, Text, View, ScrollView, Button, Alert, Linking, Image, TouchableOpacity, SafeAreaView } from 'react-native';
import { connect } from 'react-redux';
import { headerButtonStyle } from 'app/navigation/headerStyle';
import MenuItem from 'app/components/menuItem';
import LoadingView from 'app/components/loadingview';
import { setChosenCity } from 'app/actions/cities';

const styles = StyleSheet.create({
  wrap: {
    flex: 1,
    backgroundColor: '#f7f7f7',
  },
  scrollview: {
    backgroundColor: '#f7f7f7',
  },
  container: {
    flex: 1,
    backgroundColor: '#f7f7f7',
    paddingTop: 20,
    paddingBottom: 20,
  },
  version: {
    alignItems: 'center',
  },
  versionText: {
    fontSize: 12,
    lineHeight: 20,
    color: '#979797',
  },
  headerButton: headerButtonStyle,
});

const backArrowIcon = require('app/assets/img/backArrowIcon.png');

class Cities extends Component {
  static navigationOptions = ({ navigation }) => ({
    headerTitle: 'Cities',
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
    const { showLoading } = this.state;
    const { cities } = this.props.cities;
    const { chosenCity } = this.props.cities;
    console.log('DEBUG cities screen: chosenCity is');
    console.log(chosenCity);
    const cityElements = cities.map((cityMapped, index) => {
      const city = JSON.parse(JSON.stringify(cityMapped));
      const { name } = city;
      let retval = (
        <MenuItem
          key={name}
          title={name}
          onPress={() => this.props.setChosenCity(city)}
        />
      );
      if (city.name === chosenCity.name) {
        retval = React.cloneElement(retval, { selected: true });
      }
      if (cities.length - 1 === index) {
        retval = React.cloneElement(retval, { last: true });
      }
      return retval;
    });

    return (
      <SafeAreaView style={styles.wrap}>
        <ScrollView style={styles.scrollview}>
          <View style={styles.container}>
            {cityElements}

            <View style={styles.version}>
              <Text style={styles.versionText}>Want your city added? Email us at</Text>
              <TouchableOpacity onPress={() => {
                Linking.openURL('mailto://lanechange@solodigitalis.com')
                  .catch(() => {});
              }}>
                <Text style={styles.versionText}>lanechange@solodigitalis.com</Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
        {!!showLoading && (
          <LoadingView />
        )}
      </SafeAreaView>
    );
  }
}

const mapStateToProps = state => ({
  cities: state.cities,
});

const mapDispatchToProps = dispatch => ({
  setChosenCity: city => dispatch(setChosenCity(city)),
});

export default connect(mapStateToProps, mapDispatchToProps)(Cities);
