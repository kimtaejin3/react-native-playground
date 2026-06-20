module.exports = function (api) {
  api.cache(true);
  return {
    presets: ["babel-preset-expo"],
    // reanimated v4: worklets 플러그인은 반드시 plugins 배열의 맨 마지막
    plugins: ["react-native-worklets/plugin"],
  };
};
