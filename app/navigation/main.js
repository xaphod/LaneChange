import React from 'react';
import { createStackNavigator, createAppContainer } from 'react-navigation';
import * as Screens from 'app/screens';

// const staticContentNavigationOptions = ({ navigation }) => {
//   const header = getHeader(navigation, '', 'HomePicker');
//   return { ...header };
// };

const stack = createStackNavigator({
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
}, {
  initialRouteName: 'Start',
  // mode: 'modal',
});

export default createAppContainer(stack);
