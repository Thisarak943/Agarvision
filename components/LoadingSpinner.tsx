// components/LoadingSpinner.tsx
import React, { useEffect } from 'react';
import { View } from 'react-native';
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming
} from 'react-native-reanimated';

export default function LoadingSpinner({ size = 40, color = '#10B981' }) {
  const rotation = useSharedValue(0);

  useEffect(() => {
    rotation.value = withRepeat(
      withTiming(360, { duration: 1000, easing: Easing.linear }),
      -1
    );
  }, [rotation]);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ rotate: `${rotation.value}deg` }],
    };
  });

  return (
    <View className="justify-center items-center">
      <Animated.View
        style={[
          animatedStyle,
          {
            width: size,
            height: size,
            borderWidth: 3,
            borderColor: `${color}20`,
            borderTopColor: color,
            borderRadius: size / 2,
          }
        ]}
      />
    </View>
  );
}