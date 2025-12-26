// app/(profile)/_layout.tsx
import { Stack } from 'expo-router';

export default function ProfileLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="user-profile" />
      <Stack.Screen name="settings" />
      <Stack.Screen name="edit-profile" />
      <Stack.Screen name="shipping-address" />
      <Stack.Screen name="payment-methods" />
      <Stack.Screen name="change-password" />
      <Stack.Screen name="privacy-security" />
      <Stack.Screen name="notification-settings" />
      <Stack.Screen name="help-support" />
      <Stack.Screen name="terms-of-service" />
      <Stack.Screen name="info-center" />
      <Stack.Screen name="info" /> {/* ✅ NEW dynamic file */}
    </Stack>
  );
}
