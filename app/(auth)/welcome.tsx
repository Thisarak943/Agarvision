// app/(auth)/welcome.tsx - Updated for Expo 53
import React, { useEffect } from 'react';
import { View, Text, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import Animated, { 
  useSharedValue, 
  useAnimatedStyle, 
  withTiming, 
  withSequence,
  withDelay 
} from 'react-native-reanimated';
import Button from '../../components/ui/Button';

export default function Welcome() {
  const opacity = useSharedValue(0);
  const translateY = useSharedValue(50);
  const logoScale = useSharedValue(0.8);

  useEffect(() => {
    opacity.value = withTiming(1, { duration: 800 });
    translateY.value = withTiming(0, { duration: 800 });
    logoScale.value = withSequence(
      withDelay(300, withTiming(1.1, { duration: 400 })),
      withTiming(1, { duration: 200 })
    );
  }, []);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      opacity: opacity.value,
      transform: [{ translateY: translateY.value }],
    };
  });

  const logoAnimatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: logoScale.value }],
    };
  });

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      <View className="flex-1 px-6 justify-between">
        <View className="flex-1 justify-center items-center">
          <Animated.View style={logoAnimatedStyle} className="mb-8">
             <Image source={require('../../assets/icons/logo.png')} />
          </Animated.View>
          
          <Animated.View style={animatedStyle} className="items-center">
            <Text className="text-4xl font-bold text-gray-900 mb-4">
              Global Trading Inc
            </Text>
            <Text className="text-lg text-gray-600 mb-2">
              Premium Corporate Solutions
            </Text>
            <Text className="text-center text-gray-500 leading-6 px-4">
              Safety Footwear and Uniforms
            </Text>
            <Text className="text-center text-gray-500 leading-6 px-4 mt-4">
              Global is an official international distributor for VF
              Imagewear Inc. The brands we represent include Red
              Kap, Horace Small, Bulwark and Wrangler. If needed,
              we can also provide customization of your garments.
            </Text>
          </Animated.View>
        </View>

        <Animated.View style={animatedStyle} className="pb-8">
          <Button
            title="Get Started"
            onPress={() => router.push('/(auth)/login')}
            className="mb-4"
          />
        </Animated.View>
      </View>
    </SafeAreaView>
  );
}