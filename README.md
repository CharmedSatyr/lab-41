![CF](http://i.imgur.com/7v5ASc8.png) LAB
=================================================

## Lab 41: React Native

### Authors: Gregory Dukes, Joseph Wolfe

### Links and Resources
* [GitHub](https://github.com/charmedsatyr-401-advanced-javascript/lab-41)
* [![Build Status](https://travis-ci.com/charmedsatyr-401-advanced-javascript/lab-41.svg?branch=master)](https://travis-ci.com/charmedsatyr-401-advanced-javascript/lab-41)

### Modules
```
.
├── App.js
├── app.json
├── App.test.js
├── assets
│   ├── icon.png
│   ├── sounds
│   │   ├── beep-07.aup
│   │   ├── beep-07_data
│   │   │   └── e00
│   │   │       └── d00
│   │   │           ├── e0000c4b.au
│   │   │           └── e0000db6.au
│   │   ├── beep-07.mp3
│   │   ├── long.mp3
│   │   ├── Read.txt
│   │   ├── short.mp3
│   │   └── sos-morse-code.mp3
│   └── splash.png
├── babel.config.js
├── package.json
├── package-lock.json
├── player.js
├── README.md
└── sound-library.js
```

### Summary
This application uses React Native, Expo, and the Morsee library to covert text to Morse code. When a user types input into the app's text field, a version of that text encoded into Morse code will appear below the input box. When the user submits the text using the appropriate button on their mobile device's keyboard, the device's screen will be set to maximum brightness, and the device will beep the Morse code version of the user input in sync with text color and background color changes intended to simulate a flashing light. When the playback has completed, the screen will dim to its original brightness level.

#### Implementation Note
Because looping through a series of characters is generally synchronous and would not have allowed each sound/flash to have been played for the required length, `App.js` uses Morsee to convert user input to Morse code and then calls a `playMorse` function recursively on the encoded text. Paired with `setTimeout`, the recursive calls produce an effect that approximates asynchronous playback.

The authors are indebted to [Antenna.io](https://antenna.io/blog/2019/05/preload-and-replay-sounds-in-react-native-expo) for a tutorial on dynamically preloading external sound files in Expo.

#### Custom Sound Files
The original sound files from the beeps were distributed by [Sound Jay](https://www.soundjay.com/beep-sounds-7.html) and manually edited in Audacity to customize file size and beep length and to remove dead airtime.

#### Issues
Syncing audio and visual output to a recognizable pattern of Morse code with playback intervals of exactly 50ms on both iOS and Android devices was the single biggest challenge our team faced.

Others included:
* The screen brightness hardware API is asynchronous, but functions to set it do not have return values, making it difficult to use them as blocking functions
* Buzzing hardcoded to 500ms on iOS (preventing integration of that hardware API)
* Lack of generic system audio (beeps)
* Some hardware options (e.g., Low Battery Mode) silently affected function calls
* iOS and Android audio and screen brightness reacted differently to similar code
* Inconsistent output on the same device without changing code
* Due to the 50ms intervals between recursive function calls, rapidly changing styling with React state was troublesome due to `setState` object merging behind the scenes

#### Future Development
Short-term development goals would be to give users the ability to play a message on loop. Longer-term development goals would include using device cameras and microphones to translate "seen" or "heard" Morse code into user-readable text. 

The application could also use some refactoring and tests.

### Setup
* Download the Expo Client app for your mobile device

#### Running the app
* `npm run start`
* Scan the QR code that appears in your terminal or in a pop-up browser window with your phone camera (iOS) or Expo app (Android)
* Open the Expo Client app if it is not open already and await the JavaScript bundle build/download
* In the text input field, enter a phrase to turn into Morse code and submit it.
* Enjoy the show!
