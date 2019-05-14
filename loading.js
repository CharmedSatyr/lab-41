import React from 'react';
import { AppLoading } from 'expo';

const Loading = props => (
  <AppLoading
    autoHideSplash={false}
    startAsync={props.loadAssets}
    onFinish={props.onFinish}
    onError={console.warn}
  />
);

export default Loading;
