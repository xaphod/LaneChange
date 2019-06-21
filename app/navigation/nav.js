import React from 'react';
import { connect } from 'react-redux';
import { createStackNavigator, createAppContainer } from 'react-navigation';
import 'react-native-gesture-handler';
import mainNavigator from './main';
// import { BackHandler } from 'react-native';

const createContainer = (initialRouteName) => {
  const main = mainNavigator(initialRouteName);
  return createAppContainer(main);
};

let AppContainer = null;

class Nav extends React.Component {
  // componentDidMount() {
  //   BackHandler.addEventListener('hardwareBackPress', () => {
  //     const { dispatch, navigation, nav } = this.props;
  //     if (nav.routes.length === 1 && (nav.routes[0].routeName === 'Home')) {
  //       consolelog('DEBUG nav.js: back press ignored');
  //       return false;
  //     }
  //     dispatch({ type: 'Navigation/BACK' });
  //     return true;
  //   });
  // }

  // componentWillUnmount() {
  //   BackHandler.removeEventListener('hardwareBackPress');
  // }

  constructor(props) {
    super(props);

    let initialRouteName = 'Start';
    const { ui } = props;
    if (ui && ui.startScreenShown) {
      initialRouteName = 'Report';
    }
    AppContainer = createContainer(initialRouteName);
  }

  render() {
    return (<AppContainer />);
  }
}

const mapStateToProps = state => ({
  reports: state.reports,
  ui: state.ui,
});

const mapDispatchToProps = dispatch => ({
});

export default connect(mapStateToProps, mapDispatchToProps)(Nav);
