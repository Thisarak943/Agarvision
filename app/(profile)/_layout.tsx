// app/profile/_layout.tsx
import { Stack } from 'expo-router';

export default function AuthLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="edit-profile" />
      <Stack.Screen name="order-history" />
      <Stack.Screen name="shipping-address" />
      <Stack.Screen name="payment-methods" />
      <Stack.Screen name="help-support" />
      <Stack.Screen name="settings" />
      <Stack.Screen name="change-password" />
      <Stack.Screen name="privacy-security" />
      <Stack.Screen name="my-coupons" />
      <Stack.Screen name="notification-settings" />
      <Stack.Screen name="terms-of-service" />
    </Stack>
  );
}