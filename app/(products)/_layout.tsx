// app/(products)/_layout.tsx
import { Stack } from 'expo-router';
import { Platform } from 'react-native';

export default function ProductsLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: true,
        animation: Platform.select({ ios: 'slide_from_right', android: 'fade' }),
        headerTitleAlign: 'center',
      }}
    >
      <Stack.Screen
        name="[category]"
        options={{
          title: 'Product',
        }}
      />
    </Stack>
  );
}
