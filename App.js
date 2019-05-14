import React from 'react';
import { StyleSheet, Text, TextInput, View } from 'react-native';
import { AppLoading, Brightness, Font, Permissions } from 'expo';
import { encode } from 'morsee';

import soundLibrary from './sound-library';
import Player from './player';

export default class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      brightness: null, // get and restore original brightness
      interval: 60,
      loop: false, // If true, loop the message
      permissions: null,
      soundReady: false,
      text: 'SOS',
    };
  }

  loadAssets = () => {
    const sounds = Player.load(soundLibrary);
    return Promise.all([...sounds]);
  };

  bright = () => {
    Brightness.setBrightnessAsync(1);
    return Brightness.getBrightnessAsync();
  };

  dim = () => {
    Brightness.setBrightnessAsync(0);
    return Brightness.getBrightnessAsync();
  };

  flashMorse = async (encoded, i = 0) => {
    const result = await this.dim();
    const { interval } = this.state;
    console.log('I:', i);
    if (result !== 1) {
      const j = i + 1;
      if (i >= encoded.length) {
        console.log('FINISHED!');
        return;
      }
      const char = encoded[i];
      console.log('CHAR:', encoded[i]);

      if (char === '.') {
        console.log('.');
        const result = await this.bright();
        Player.playSound('short');
        if (result === 1) {
          setTimeout(() => this.flashMorse(encoded, j), interval);
        }
      }

      if (char === '-') {
        console.log('-');
        const result = await this.bright();
        Player.playSound('long');
        if (result === 1) {
          setTimeout(() => this.flashMorse(encoded, j), 3 * interval);
        }
      }

      if (char === ' ') {
        console.log(' / ');
        setTimeout(() => this.flashMorse(encoded, j), 3 * interval);
      }
    }
  };

  toMorse = text => {
    console.log('TEXT:', this.state.text);
    const encoded = encode(text);
    console.log('ENCODED:', encoded);
    return encoded;
  };

  handleSubmit = async e => {
    if (e) {
      e.preventDefault();
    }
    try {
      const encoded = this.toMorse(this.state.text);
      const result = await this.dim();
      if (result !== undefined) {
        this.flashMorse(encoded);
      }
    } catch (err) {
      console.error(err);
    }
  };

  async componentDidMount() {
    const { status } = await Permissions.askAsync(Permissions.SYSTEM_BRIGHTNESS);
    this.setState({ permissions: status }, () => {
      console.log('STATUS:', status);
      this.handleSubmit();
    });
  }

  render() {
    if (!this.state.soundReady) {
      return (
        <AppLoading
          startAsync={this.loadAssets}
          onFinish={() => this.setState({ soundReady: true })}
          onError={console.warn}
        />
      );
    }

    return (
      <View style={styles.container}>
        <Text>I have a lovely bunch of coconuts!</Text>
        <Text>(Deedley-dee!)</Text>
        <Text>There they are a-standing in the road!</Text>
        <Text>(Dum dum dum...)</Text>
        <TextInput
          style={{ height: 40, borderColor: 'gray', borderWidth: 1, borderRadius: 4, width: 100 }}
          onChangeText={text => this.setState({ text })}
          value={this.state.text}
          onSubmitEditing={this.handleSubmit}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
