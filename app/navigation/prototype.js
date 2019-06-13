import React from 'react';
import { createStackNavigator, createAppContainer } from 'react-navigation';
import Home from 'app/screens/old/home';
import CreateReport from 'app/screens/old/createReport';

// const staticContentNavigationOptions = ({ navigation }) => {
//   const header = getHeader(navigation, '', 'HomePicker');
//   return { ...header };
// };

const stack = createStackNavigator({
  // real screens
  Home: {
    screen: Home,
  },
  CreateReport: {
    screen: CreateReport,
  },
}, {
  initialRouteName: 'Home',
  // mode: 'modal',
});

export default createAppContainer(stack);