import React from 'react';
// import { BackHandler } from 'react-native';

import MainNavigation from './main';

export default class Nav extends React.Component {
  // componentDidMount() {
  //   BackHandler.addEventListener('hardwareBackPress', () => {
  //     const { dispatch, navigation, nav } = this.props;
  //     if (nav.routes.length === 1 && (nav.routes[0].routeName === 'Home')) {
  //       console.log('DEBUG nav.js: back press ignored');
  //       return false;
  //     }
  //     dispatch({ type: 'Navigation/BACK' });
  //     return true;
  //   });
  // }

  // componentWillUnmount() {
  //   BackHandler.removeEventListener('hardwareBackPress');
  // }

  render() {
    return (
      <MainNavigation />
    );
  }
}
