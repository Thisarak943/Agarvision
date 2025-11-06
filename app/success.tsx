// app/success.tsx
import React, { useEffect } from 'react';
import { View, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import Animated, { 
  useSharedValue, 
  useAnimatedStyle, 
  withTiming, 
  withSequence,
  withDelay,
  Easing
} from 'react-native-reanimated';
import Button from '../components/ui/Button';
import { Ionicons } from '@expo/vector-icons';

export default function Success() {
  const opacity = useSharedValue(0);
  const scale = useSharedValue(0.5);
  const checkScale = useSharedValue(0);

  useEffect(() => {
    opacity.value = withTiming(1, { duration: 600 });
    scale.value = withTiming(1, { duration: 600, easing: Easing.out(Easing.back(1.5)) });
    
    checkScale.value = withSequence(
      withDelay(400, withTiming(1.2, { duration: 300 })),
      withTiming(1, { duration: 200 })
    );
  }, []);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      opacity: opacity.value,
      transform: [{ scale: scale.value }],
    };
  });

  const checkAnimatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: checkScale.value }],
    };
  });

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      <View className="flex-1 justify-center items-center px-6">
        <Animated.View style={animatedStyle} className="items-center">
          <Animated.View style={checkAnimatedStyle} className="mb-8">
            <View className="w-24 h-24 bg-primary rounded-full justify-center items-center">
              <Ionicons name="checkmark" size={48} color="white" />
            </View>
          </Animated.View>
          
          <Text className="text-3xl font-bold text-gray-900 mb-4">
            Congratulations!
          </Text>
          
          <Text className="text-gray-600 text-center mb-8 leading-6">
            Your account has been successfully created. Welcome to AgarVision!
          </Text>

          <Button
            title="Go to Dashboard"
            onPress={() => router.replace('/(tabs)')}
            className="w-full"
          />
        </Animated.View>
      </View>
    </SafeAreaView>
  );
}