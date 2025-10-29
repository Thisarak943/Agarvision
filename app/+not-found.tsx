// app/+not-found.tsx
import React from 'react';
import { View, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import Button from '../components/ui/Button';

export default function NotFoundScreen() {
  return (
    <SafeAreaView className="flex-1 bg-gray-50 justify-center items-center px-6">
      <Text className="text-6xl mb-4">🔍</Text>
      <Text className="text-2xl font-bold text-gray-900 mb-2">Page Not Found</Text>
      <Text className="text-gray-600 text-center mb-8">
        The page you're looking for doesn't exist.
      </Text>
      <Button
        title="Go Home"
        onPress={() => router.replace('/(tabs)')}
      />
    </SafeAreaView>
  );
}