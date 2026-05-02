import { Stack } from "expo-router";
import Toast from "react-native-toast-message";

export default function ServicesLayout() {
  return (
    <>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="resin-grading" />

        {/* Your new pages */}
        <Stack.Screen name="resin-grading-upload" />
        <Stack.Screen name="resin-grading-result" />
        <Stack.Screen name="export-readiness-form" />
        <Stack.Screen name="export-readiness-result" />

        {/* Existing pages */}
        <Stack.Screen name="disease-detection" />
        <Stack.Screen name="disease-upload" />
        <Stack.Screen name="disease-result" />
        <Stack.Screen name="remedy-suggestion" />
        <Stack.Screen name="disease-history" />
        <Stack.Screen name="stage-classification" />
        <Stack.Screen name="stage-upload" />
        <Stack.Screen name="stage-result" />

        {/* Market Price (nested routes) */}
        <Stack.Screen name="market-price/index" />
        <Stack.Screen name="market-price/form" />
        <Stack.Screen name="market-price/result" />
        <Stack.Screen name="market-price/chat" />
      </Stack>

      {/* ✅ Toast added here */}
      <Toast />
    </>
  );
}