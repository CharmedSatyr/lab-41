import React from 'react';
import { /* StyleSheet, */ Text, TextInput, View } from 'react-native';
import { Brightness, Permissions } from 'expo';
import { AppLoading } from 'expo';
import { encode } from 'morsee';

import soundLibrary from './sound-library';
import Player from './player';

const dark = '#111';
const light = '#eee';
const interval = 50;

export default class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      brightness: null, // get and restore original brightness
      loop: false, // If true, loop the message
      permissions: null,
      soundReady: false,
      text: '',
      backgroundColor: light,
    };
  }

  loadAssets = () => {
    const sounds = Player.load(soundLibrary);
    return Promise.all([...sounds]);
  };

  bright = async () => {
    try {
      Brightness.setBrightnessAsync(1);
      return await Brightness.getBrightnessAsync();
    } catch (err) {
      console.error(err);
    }
  };

  dash = (encoded, j) => {
    Player.playSound('long');
    this.setState({ backgroundColor: light, color: dark });
    setTimeout(() => {
      this.playMorse(encoded, j);
      this.setState({ backgroundColor: dark, color: light });
    }, 3 * interval);
  };

  dot = (encoded, j) => {
    Player.playSound('short');
    this.setState({ backgroundColor: light, color: dark });
    setTimeout(() => {
      this.playMorse(encoded, j);
      this.setState({ backgroundColor: dark, color: light });
    }, interval);
  };

  space = (encoded, j) => {
    setTimeout(() => this.playMorse(encoded, j), 3 * interval);
  };

  finish = () => {
    console.log('FINISHED!');
    Brightness.setBrightnessAsync(this.state.brightness);
    setInterval(() => {
      this.setState({ backgroundColor: light, color: dark });
    }, interval);
  };

  playMorse = (encoded, i = 0) => {
    if (i >= encoded.length) {
      this.finish();
      return;
    }

    const j = i + 1;
    const char = encoded[i];
    console.log('I:', i, ', J:', j, ', CHAR:', encoded[i]);

    if (char === '.') {
      this.dot(encoded, j);
    } else if (char === '-') {
      this.dash(encoded, j);
    } else if (char === ' ') {
      this.space(encoded, j);
    }
  };

  toMorse = text => {
    console.log('TEXT:', this.state.text);
    const encoded = encode(text);
    console.log('ENCODED:', encoded);
    return encoded;
  };

  handleSubmit = async e => {
    e.preventDefault();
    const encoded = this.toMorse(this.state.text);
    this.setState({ backgroundColor: dark, color: light });
    const result = await this.bright();
    // This should be 1, but many issues with battery conservation!
    if (result !== undefined) {
      this.playMorse(encoded);
    }
  };

  toggleSoundReady = () => {
    this.setState({ soundReady: !this.state.soundReady });
  };

  async componentDidMount() {
    try {
      const brightness = await Brightness.getBrightnessAsync();
      const { status } = await Permissions.askAsync(Permissions.SYSTEM_BRIGHTNESS);
      this.setState({ brightness, permissions: status }, () => {
        console.log('BRIGHTNESS:', brightness);
        console.log('STATUS:', status);
      });
    } catch (err) {
      console.error(err);
    }
  }

  render() {
    if (!this.state.soundReady) {
      return (
        <AppLoading
          autoHideSplash={true}
          startAsync={this.loadAssets}
          onFinish={this.toggleSoundReady}
          onError={console.warn}
        />
      );
    } else {
      return (
        <View
          style={{
            alignItems: 'center',
            backgroundColor: this.state.backgroundColor,
            color: this.state.color,
            flex: 1,
            justifyContent: 'center',
            padding: 1,
          }}
        >
          <Text
            style={{
              backgroundColor: this.state.backgroundColor,
              color: this.state.color,
              fontSize: 20,
              fontWeight: 'bold',
              marginBottom: 20,
              padding: 1,
            }}
          >
            Morse Code Translator
          </Text>
          <TextInput
            style={{
              backgroundColor: this.state.backgroundColor,
              borderColor: 'gray',
              borderRadius: 4,
              borderWidth: 1,
              color: this.state.color,
              height: 40,
              padding: 1,
              width: 100,
            }}
            onChangeText={text => this.setState({ text })}
            onSubmitEditing={this.handleSubmit}
            placeholder={'SOS'}
            value={this.state.text}
          />
          <Text
            style={{
              backgroundColor: this.state.backgroundColor,
              color: this.state.color,
              fontWeight: 'bold',
              marginTop: 20,
              padding: 1,
            }}
          >
            {encode(this.state.text)}
          </Text>
        </View>
      );
    }
  }
}
