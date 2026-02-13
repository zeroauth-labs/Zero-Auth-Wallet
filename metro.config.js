const { getDefaultConfig } = require('expo/metro-config');
const { withNativeWind } = require('nativewind/metro');

/** @type {import('expo/metro-config').MetroConfig} */
const config = getDefaultConfig(__dirname);

// config.resolver.assetExts.push('zkey', 'wasm');
// config.resolver.extraNodeModules = require('node-libs-react-native');

module.exports = withNativeWind(config, { input: './global.css' });
