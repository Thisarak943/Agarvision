// components/ui/Card.tsx
import React from 'react';
import { View } from 'react-native';
import Animated, { useSharedValue, useAnimatedStyle, withSpring } from 'react-native-reanimated';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  onPress?: () => void;
}

export default function Card({ children, className = '', onPress }: CardProps) {
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: scale.value }],
    };
  });

  const handlePressIn = () => {
    if (onPress) {
      scale.value = withSpring(0.98);
    }
  };

  const handlePressOut = () => {
    if (onPress) {
      scale.value = withSpring(1);
    }
  };

  if (onPress) {
    return (
      <Animated.View
        style={animatedStyle}
        onTouchStart={handlePressIn}
        onTouchEnd={handlePressOut}
        className={`bg-white rounded-xl shadow-sm border border-gray-100 ${className}`}
      >
        {children}
      </Animated.View>
    );
  }

  return (
    <View className={`bg-white rounded-xl shadow-sm border border-gray-100 ${className}`}>
      {children}
    </View>
  );
}