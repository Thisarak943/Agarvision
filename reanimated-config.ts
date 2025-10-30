// reanimated-config.ts
// This file should be imported before any other imports that use Reanimated

import { configureReanimatedLogger, ReanimatedLogLevel } from 'react-native-reanimated';

// Type declarations for global objects
declare global {
  var __reanimatedLoggerConfig: any;
}

// Set up global logger config before Reanimated tries to use it
if (typeof global.__reanimatedLoggerConfig === 'undefined') {
  global.__reanimatedLoggerConfig = {
    level: 'warn',
    strict: false,
  };
}

// Configure the official logger
configureReanimatedLogger({
  level: ReanimatedLogLevel.warn,
  strict: false,
});