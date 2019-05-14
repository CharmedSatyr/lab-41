import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { TextInput } from 'react-native';

import { Permissions } from 'expo';
import { Brightness } from 'expo';

import { encode, decode } from 'morsee';

export default class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      bright: true,
      permissions: null,
    };
  }
  setBright = async () => {
    Brightness.setBrightnessAsync(1);
  };
  thing = async () => {
    try {
      if (this.state.permissions === 'granted') {
        let b;
        setInterval(async () => {
          if (this.state.bright) {
            b = await Brightness.getBrightnessAsync();
            console.log(b);
            Brightness.setBrightnessAsync(0);
            this.setState({ bright: !this.state.bright });
          } else if (!this.state.bright) {
            b = await Brightness.getBrightnessAsync();
            console.log(b);
            Brightness.setBrightnessAsync(1);
            this.setState({ bright: !this.state.bright });
          }
        }, 10000);
      }
    } catch (err) {
      console.log(err);
    }
  };

  handleSubmit = () => {
    console.log(this.state.text);
    console.log(encode(this.state.text));
  };
  async componentDidMount() {
    const { status } = await Permissions.askAsync(Permissions.SYSTEM_BRIGHTNESS);
    this.setState({ permissions: status }, () => {
      console.log('STATUS:', status);
      this.thing();
    });
  }
  render() {
    return (
      <View style={styles.container}>
        <Text>I have a lovely bunch of coconuts.</Text>
        <Text>Deedley-dee!</Text>
        <Text>There they are standing in the road...</Text>
        <TextInput
          style={{ height: 40, borderColor: 'gray', borderWidth: 1 }}
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
