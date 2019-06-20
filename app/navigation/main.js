import React from 'react';
import { createStackNavigator } from 'react-navigation';
import * as Screens from 'app/screens';
import { headerNavigationOptions } from 'app/navigation/headerStyle';

// const staticContentNavigationOptions = ({ navigation }) => {
//   const header = getHeader(navigation, '', 'HomePicker');
//   return { ...header };
// };

export default mainNavigator = initialRouteName => createStackNavigator({
  // real screens
  Start: {
    screen: Screens.Start,
  },
  Report: {
    screen: Screens.Report,
  },
  Notes: {
    screen: Screens.Notes,
  },
  HowItWorks: {
    screen: Screens.HowItWorks,
  },
  Menu: {
    screen: Screens.Menu,
  },
  Done: {
    screen: Screens.Done,
  },
  Cities: {
    screen: Screens.Cities,
  },
}, {
  initialRouteName,
  // mode: 'modal',
  defaultNavigationOptions: {
    ...headerNavigationOptions,
  },
});
