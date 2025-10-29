// app/_layout.tsx - Updated for Expo 53
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import { TouchableOpacity } from 'react-native';
import { CartProvider } from '../contexts/CartContext';
import { UserProvider } from '../contexts/UserContext';
import '../global.css';

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

// Set global TouchableOpacity defaults
const setGlobalDefaults = () => {
  const originalDefaultProps = TouchableOpacity.defaultProps || {};
  TouchableOpacity.defaultProps = {
    ...originalDefaultProps,
    activeOpacity: 1,
  };
};

export default function RootLayout() {
  const [loaded] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
  });

  useEffect(() => {
    // Set global TouchableOpacity defaults
    setGlobalDefaults();

    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return (
    <>
      <StatusBar style="auto" />
      <UserProvider>
      <CartProvider>
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen name="(auth)" />
          <Stack.Screen name="(tabs)" />
          <Stack.Screen name="(products)/product-details" />
          <Stack.Screen name="(profile)" />
          <Stack.Screen name="loading" />
          <Stack.Screen name="success" />
          <Stack.Screen name="+not-found" />
        </Stack>
      </CartProvider>
      </UserProvider>
    </>
  );
}