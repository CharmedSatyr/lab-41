import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { TextInput } from 'react-native';

import { Permissions } from 'expo';
import { Brightness } from 'expo';

import { encode } from 'morsee';

export default class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      brightness: null, // get and restore original brightness
      interval: 250,
      loop: false, // If true, loop the message
      permissions: null,
      text: null,
    };
  }
  dim = () => {
    Brightness.setBrightnessAsync(0);
    return Brightness.getBrightnessAsync();
  };
  bright = () => {
    Brightness.setBrightnessAsync(1);
    return Brightness.getBrightnessAsync();
  };
  flashMorse = async (encoded, i = 0) => {
    const result = await this.dim();
    const { interval } = this.state;
    console.log('I:', i);
    if (result !== undefined) {
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
        if (result !== undefined) {
          setTimeout(() => this.flashMorse(encoded, j), interval);
        }
      }

      if (char === '-') {
        console.log('-');
        const result = await this.bright();
        if (result !== undefined) {
          setTimeout(() => this.flashMorse(encoded, j), 3 * interval);
        }
      }

      if (char === ' ') {
        console.log('[space]');
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
    try {
      // e.preventDefault();
      // const encoded = this.toMorse(this.state.text);
      const encoded = this.toMorse('SOS');
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
    return (
      <View style={styles.container}>
        <Text>I have a lovely bunch of coconuts.</Text>
        <Text>Deedley-dee!</Text>
        <Text>There they are standing in the road...</Text>
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
