// app/loading.tsx
import { router } from 'expo-router';
import React, { useEffect } from 'react';
import { Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming
} from 'react-native-reanimated';

export default function Loading() {
  const opacity = useSharedValue(0);
  const scale = useSharedValue(0.8);
  const rotation = useSharedValue(0);

  useEffect(() => {
    // Fade in animation
    opacity.value = withTiming(1, { duration: 500 });
    scale.value = withTiming(1, { duration: 500 });

    // Rotation animation for hourglass
    rotation.value = withRepeat(
      withTiming(360, { duration: 2000, easing: Easing.linear }),
      -1,
      false // not reversing
    );

    // Navigate to home after 3 seconds
    const timer = setTimeout(() => {
      router.replace('/(tabs)');
    }, 3000);

    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      opacity: opacity.value,
      transform: [{ scale: scale.value }],
    };
  });

  const hourglassStyle = useAnimatedStyle(() => {
    return {
      transform: [{ rotate: `${rotation.value % 360}deg` }],
    };
  });

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      <View className="flex-1 justify-center items-center px-6">
        <Animated.View style={animatedStyle} className="items-center">
          <Animated.View style={hourglassStyle} className="mb-8">
            <View className="w-30 h-30 rounded-2xl justify-center items-center">
              <Text className="text-white text-8xl">⏳</Text>
            </View>
          </Animated.View>

          <Text className="text-2xl font-bold text-primary mb-4">
            Just a moment
          </Text>

          <Text className="text-gray-600 text-center">
            Setting up your account...
          </Text>
        </Animated.View>
      </View>
    </SafeAreaView>
  );
}