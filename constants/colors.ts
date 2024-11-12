/**
 * Below are the colors that are used in the app. The colors are defined in the light and dark mode.
 * There are many other ways to style your app. For example, [Nativewind](https://www.nativewind.dev/), [Tamagui](https://tamagui.dev/), [unistyles](https://reactnativeunistyles.vercel.app), etc.
 */

// Defined only for options that can't be passed through nativewind.
// For now light and dark are the same
const colorScheme = {
  tabBarActiveTintColor: '#ffffff',
  tabBarInactiveTintColor: '#aaaaaa',
  tabBarBackgroundColor: '#662D91',
};

export const Colors = {
  light: { ...colorScheme },
  dark: { ...colorScheme },
};
