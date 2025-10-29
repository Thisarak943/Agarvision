// app/index.tsx
import { Redirect } from 'expo-router';
import { configureReanimatedLogger, ReanimatedLogLevel } from 'react-native-reanimated';

configureReanimatedLogger({
  level: ReanimatedLogLevel.warn, // only warnings and errors
  strict: false, // disables "Reading from `value`" logs
});

export default function Index() {
  // return <Redirect href="/(auth)/welcome" />;
  return <Redirect href="/(tabs)" />;
}