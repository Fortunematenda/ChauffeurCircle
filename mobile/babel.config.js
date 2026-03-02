module.exports = function (api) {
  api.cache(true);
  return {
    presets: [require("babel-preset-expo")],
    plugins: ["react-native-reanimated/plugin"],
  };
};
