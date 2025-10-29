
// babel.config.js - Updated for Expo 53
module.exports = function (api) {
  api.cache(true);
  return {
    presets: [
      ["babel-preset-expo", { jsxImportSource: "nativewind" }]
    ],
    plugins: [
      "react-native-worklets/plugin",
    ],
  };
};