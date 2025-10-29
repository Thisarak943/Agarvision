// components/CategoryCard.tsx
import React from 'react';
import { TouchableOpacity, Text, View, Image } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
  interpolate,
  Easing
} from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient'; // You'll need to install this

interface CategoryCardProps {
  title: string;
  icon: string;
  onPress: () => void;
  gradient?: [string, string]; // Optional gradient colors
  backgroundColor?: string; // Fallback background color
}

const AnimatedTouchableOpacity = Animated.createAnimatedComponent(TouchableOpacity);
const AnimatedLinearGradient = Animated.createAnimatedComponent(LinearGradient);

export default function CategoryCard({
  title,
  icon,
  onPress,
  gradient = ['#ffffff', '#f8fafc'],
  backgroundColor = '#ffffff'
}: CategoryCardProps) {
  const scale = useSharedValue(1);
  const rotate = useSharedValue(0);
  const shadowOpacity = useSharedValue(0.1);
  const iconScale = useSharedValue(1);

  const cardAnimatedStyle = useAnimatedStyle(() => {
    return {
      transform: [
        { scale: scale.value },
        { rotateZ: `${rotate.value}deg` }
      ],
    };
  });

  const shadowAnimatedStyle = useAnimatedStyle(() => {
    return {
      shadowOpacity: shadowOpacity.value,
      elevation: interpolate(shadowOpacity.value, [0.1, 0.3], [2, 8]),
    };
  });

  const iconAnimatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: iconScale.value }],
    };
  });

  const backgroundAnimatedStyle = useAnimatedStyle(() => {
    const opacity = interpolate(scale.value, [1, 0.95], [1, 0.9]);
    return {
      opacity,
    };
  });

  const handlePressIn = () => {
    scale.value = withSpring(0.95, {
      damping: 15,
      stiffness: 150,
      mass: 1,
    });
    rotate.value = withTiming(1, { duration: 200, easing: Easing.out(Easing.quad) });
    shadowOpacity.value = withTiming(0.3, { duration: 200 });
    iconScale.value = withSpring(1.1, {
      damping: 12,
      stiffness: 200,
    });
  };

  const handlePressOut = () => {
    scale.value = withSpring(1, {
      damping: 15,
      stiffness: 150,
      mass: 1,
    });
    rotate.value = withTiming(0, { duration: 200, easing: Easing.out(Easing.quad) });
    shadowOpacity.value = withTiming(0.1, { duration: 200 });
    iconScale.value = withSpring(1, {
      damping: 12,
      stiffness: 200,
    });
  };

  return (
    <AnimatedTouchableOpacity
      style={[cardAnimatedStyle, shadowAnimatedStyle]}
      onPress={onPress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      className="rounded-2xl overflow-hidden border-2 border-white"
    >
      {/* Background with gradient or solid color */}
      <AnimatedLinearGradient
        colors={gradient}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={[
          backgroundAnimatedStyle,
          {
            paddingHorizontal: 20,
            paddingVertical: 18,
            alignItems: 'center',
            justifyContent: 'center',
            minHeight: 140,
          }
        ]}
      >
        {/* Icon container with enhanced styling */}
        <Animated.View
          style={iconAnimatedStyle}
          className="w-20 h-20 rounded-2xl justify-center items-center mb-4 backdrop-blur-sm"
        >
          <View className="w-20 h-20 justify-center items-center">
            <Image
              source={icon}
              className="w-16 h-16"
              style={{
                tintColor: undefined // Preserve original icon colors
              }}
            />
          </View>
        </Animated.View>

        {/* Subtle accent line */}
        <View className="w-8 h-0.5 bg-primary/30 rounded-full -mt-4 mb-3" />

        {/* Title with better typography */}
        <Text className="text-gray-800 font-bold text-center text-base leading-5 tracking-wide">
          {title}
        </Text>


      </AnimatedLinearGradient>

      {/* Subtle border overlay */}
      <View
        className="absolute inset-0 rounded-2xl border border-white/50 pointer-events-none"
        style={{
          borderWidth: 1,
        }}
      />
    </AnimatedTouchableOpacity>
  );
}