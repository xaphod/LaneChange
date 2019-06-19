import React, { Component } from 'react';
import { StyleSheet, View, Image } from 'react-native';

const styles = StyleSheet.create({
  topLevel: {
    position: 'absolute',
    top: 0,
    right: 0,
    left: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.6)',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

const images = [
  require('app/assets/loading/LC-Load-1.png'),
  require('app/assets/loading/LC-Load-2.png'),
  require('app/assets/loading/LC-Load-3.png'),
  require('app/assets/loading/LC-Load-4.png'),
  require('app/assets/loading/LC-Load-5.png'),
  require('app/assets/loading/LC-Load-6.png'),
  require('app/assets/loading/LC-Load-7.png'),
  require('app/assets/loading/LC-Load-8.png'),
  require('app/assets/loading/LC-Load-9.png'),
  require('app/assets/loading/LC-Load-10.png'),
  require('app/assets/loading/LC-Load-11.png'),
  require('app/assets/loading/LC-Load-12.png'),
  require('app/assets/loading/LC-Load-13.png'),
  require('app/assets/loading/LC-Load-14.png'),
  require('app/assets/loading/LC-Load-15.png'),
  require('app/assets/loading/LC-Load-16.png'),
  require('app/assets/loading/LC-Load-17.png'),
  require('app/assets/loading/LC-Load-18.png'),
  require('app/assets/loading/LC-Load-19.png'),
  require('app/assets/loading/LC-Load-20.png'),
  require('app/assets/loading/LC-Load-21.png'),
  require('app/assets/loading/LC-Load-22.png'),
  require('app/assets/loading/LC-Load-23.png'),
  require('app/assets/loading/LC-Load-24.png'),
  require('app/assets/loading/LC-Load-25.png'),
  require('app/assets/loading/LC-Load-26.png'),
  require('app/assets/loading/LC-Load-27.png'),
  require('app/assets/loading/LC-Load-28.png'),
  require('app/assets/loading/LC-Load-29.png'),
  require('app/assets/loading/LC-Load-30.png'),
];

export default class LoadingView extends Component {
  constructor(props) {
    super(props);
    this.tick = this.tick.bind(this);
    this.state = {
      index: 0,
      timer: null,
    };
  }

  componentDidMount() {
    const timer = setInterval(this.tick, 33);
    this.setState({ timer });
  }

  componentWillUnmount() {
    clearInterval(this.state.timer);
  }

  tick() {
    this.setState({
      index: (this.state.index + 1) % 30,
    });
  }

  render() {
    return (
      <View style={styles.topLevel}>
        {!!this.props.children &&
          { ...this.props.children }
        }
        <Image source={images[this.state.index]} style={styles.image} />
      </View>
    );
  }
}
