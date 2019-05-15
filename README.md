![CF](http://i.imgur.com/7v5ASc8.png) LAB
=================================================

## Lab 41: React Native

### Authors: Gregory Dukes, Joesph Wolfe

### Links and Resources
* [repo](https://github.com/charmedsatyr-401-advanced-javascript/lab-41)
* [front-end](http://xyz.com) (when applicable)


### Modules
#### `react`, `react-native`, `expo`, `morsee`

### Note 
* Manually edited found audio to customize dead airtime, filesize, and XXXX buzzword XXX.

### Setup
#### Download the app from the app store.

### Ongoing Issues
* Syncing audio and visual output (one hardware, one software), given no system audio files
* Android and iOS screen brightness is affected differently by similar code
* Some hardware options silently affected function calls
* Screen brightness is asynchronous, but functions to set it do not have return values, making it difficult to use them as blocking functions
* Rapidly changing styling with React state was troublesome due to `setState` object merging behind the scenes
* iOS and React audio reacted differently to similar code
* Inconsistent output on the same device without changing code!

#### Running the app
* open the app
* enter a phrase to turn into morse code
* press Return
* enjoy the show
