import { Stack } from "expo-router";

export default function ServicesLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="resin-grading" />
      <Stack.Screen name="disease-detection" />
      <Stack.Screen name="disease-upload" />
      <Stack.Screen name="disease-result" />
      <Stack.Screen name="remedy-suggestion" />
      <Stack.Screen name="disease-history" />
      <Stack.Screen name="market-price" />
      <Stack.Screen name="stage-classification" />
    </Stack>
  );
}
