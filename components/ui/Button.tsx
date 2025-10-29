// components/ui/Button.tsx - Updated for React 19
import React from 'react';
import { Pressable, Text, ActivityIndicator } from 'react-native';
import Animated, { useSharedValue, useAnimatedStyle, withSpring } from 'react-native-reanimated';

interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'outline';
  loading?: boolean;
  disabled?: boolean;
  className?: string;
}

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export default function Button({ 
  title, 
  onPress, 
  variant = 'primary', 
  loading = false, 
  disabled = false,
  className = ''
}: ButtonProps) {
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: scale.value }],
    };
  });

  const handlePressIn = () => {
    scale.value = withSpring(0.95);
  };

  const handlePressOut = () => {
    scale.value = withSpring(1);
  };

  const getVariantStyles = () => {
    switch (variant) {
      case 'secondary':
        return 'bg-gray-200 border border-gray-300';
      case 'outline':
        return 'bg-transparent border border-primary';
      default:
        return 'bg-primary';
    }
  };

  const getTextStyles = () => {
    switch (variant) {
      case 'secondary':
        return 'text-gray-700';
      case 'outline':
        return 'text-primary';
      default:
        return 'text-white';
    }
  };

  return (
    <AnimatedPressable
      style={animatedStyle}
      onPress={onPress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      disabled={disabled || loading}
      className={`py-4 px-6 rounded-xl ${getVariantStyles()} ${disabled ? 'opacity-50' : ''} ${className}`}
    >
      {loading ? (
        <ActivityIndicator color={variant === 'primary' ? 'white' : '#10B981'} />
      ) : (
        <Text className={`text-center font-semibold text-base ${getTextStyles()}`}>
          {title}
        </Text>
      )}
    </AnimatedPressable>
  );
}