import React from 'react';
import { TouchableOpacity, Text, View, Image } from 'react-native';
import { MaterialCommunityIcons, Ionicons } from '@expo/vector-icons';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
  interpolate,
  Easing
} from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';

interface ServiceCardProps {
  title: string;
  description: string;
  icon: any; 
  onPress: () => void;
  accentColor?: string; 
  overlayIcon?: string; 
  gradient?: [string, string]; 
}

const AnimatedTouchableOpacity = Animated.createAnimatedComponent(TouchableOpacity);
const AnimatedLinearGradient = Animated.createAnimatedComponent(LinearGradient);

export default function ServiceCard({
  title,
  description,
  icon,
  onPress,
  accentColor = '#10B981',
  gradient = ['#ffffff', '#f8fafc']
}: ServiceCardProps) {
  const scale = useSharedValue(1);
  const translateX = useSharedValue(0);
  const iconScale = useSharedValue(1);
  const chevronTranslateX = useSharedValue(0);
  const overlayIconScale = useSharedValue(1);

  const cardAnimatedStyle = useAnimatedStyle(() => {
    return {
      transform: [
        { scale: scale.value },
        { translateX: translateX.value }
      ],
    };
  });

  const iconAnimatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: iconScale.value }],
    };
  });

  const chevronAnimatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateX: chevronTranslateX.value }],
      opacity: interpolate(chevronTranslateX.value, [0, 4], [0.7, 1]),
    };
  });

  const overlayIconAnimatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: overlayIconScale.value }],
    };
  });

  const backgroundAnimatedStyle = useAnimatedStyle(() => {
    const opacity = interpolate(scale.value, [1, 0.98], [1, 0.95]);
    return {
      opacity,
    };
  });

  const handlePressIn = () => {
    scale.value = withSpring(0.98, {
      damping: 15,
      stiffness: 200,
    });
    translateX.value = withTiming(2, {
      duration: 150,
      easing: Easing.out(Easing.quad)
    });
    iconScale.value = withSpring(1.05, {
      damping: 12,
      stiffness: 300,
    });
    chevronTranslateX.value = withTiming(4, {
      duration: 150,
      easing: Easing.out(Easing.quad)
    });
    overlayIconScale.value = withSpring(1.1, {
      damping: 10,
      stiffness: 400,
    });
  };

  const handlePressOut = () => {
    scale.value = withSpring(1, {
      damping: 15,
      stiffness: 200,
    });
    translateX.value = withTiming(0, {
      duration: 150,
      easing: Easing.out(Easing.quad)
    });
    iconScale.value = withSpring(1, {
      damping: 12,
      stiffness: 300,
    });
    chevronTranslateX.value = withTiming(0, {
      duration: 150,
      easing: Easing.out(Easing.quad)
    });
    overlayIconScale.value = withSpring(1, {
      damping: 10,
      stiffness: 400,
    });
  };

  return (
    <AnimatedTouchableOpacity
      style={[
        cardAnimatedStyle,
        {
          marginBottom: 12,
          borderRadius: 16,
          overflow: 'hidden',
          // Simple drop shadow like shadow-lg
          shadowColor: 'black',
          shadowOffset: {
            width: 10,
            height: 10,
          },
          shadowOpacity: 0.15,
          shadowRadius: 15,
          elevation: 10,
        }
      ]}
      onPress={onPress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
    >
      {/* Background with gradient */}
      <AnimatedLinearGradient
        colors={gradient}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={[
          backgroundAnimatedStyle,
          {
            padding: 20,
          }
        ]}
      >
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          {/* Enhanced Icon Container */}
          <Animated.View
            style={[
              iconAnimatedStyle,
              {
                position: 'relative',
                marginRight: 20,
              }
            ]}
            className={'shadow-sm'}
          >
            {/* Icon background with subtle gradient */}
            <LinearGradient
              colors={['#f8fafc', '#f1f5f9']}
              style={{
                width: 64,
                height: 64,
                borderRadius: 16,
                justifyContent: 'center',
                alignItems: 'center',
                borderWidth: 1,
                borderColor: 'rgba(0,0,0,0.05)',
              }}
            >
              <Image
                source={icon}
                style={{
                  width: 36,
                  height: 36,
                  borderRadius: 8
                }}
                resizeMode="contain"
              />
            </LinearGradient>

            {/* Animated overlay icon */}
            <Animated.View
              style={[
                overlayIconAnimatedStyle,
                {
                  position: 'absolute',
                  bottom: -4,
                  right: -4,
                  backgroundColor: 'white',
                  borderRadius: 20,
                  padding: 4,
                  borderWidth: 1,
                  borderColor: 'rgba(0,0,0,0.08)',
                  // Simple shadow for overlay icon
                  shadowColor: '#000',
                  shadowOffset: {
                    width: 0,
                    height: 2,
                  },
                  shadowOpacity: 0.1,
                  shadowRadius: 3,
                  elevation: 3,
                }
              ]}
            >
              <MaterialCommunityIcons
                name={"text-box-search-outline"}
                size={16}
                color={accentColor}
              />
            </Animated.View>
          </Animated.View>

          {/* Enhanced Text Section */}
          <View style={{ flex: 1, paddingRight: 12 }}>
            <Text
              style={{
                fontSize: 16,
                fontWeight: '600',
                color: '#1f2937',
                marginBottom: 4,
                lineHeight: 22,
              }}
              numberOfLines={1}
            >
              {title}
            </Text>
            <Text
              style={{
                fontSize: 14,
                color: '#6b7280',
                lineHeight: 20,
              }}
              numberOfLines={2}
            >
              {description}
            </Text>

          </View>

          {/* Enhanced Chevron */}
          <Animated.View style={chevronAnimatedStyle} className='shadow-sm border border-white rounded-full '>
            <View
              style={{
                backgroundColor: `EEEEEE`,
                borderRadius: 20,
                padding: 4,
              }}
            >
              <Ionicons
                name="chevron-forward"
                size={15}
                color={accentColor}
              />
            </View>
          </Animated.View>
        </View>
      </AnimatedLinearGradient>

      {/* Subtle border overlay */}
      <View
        style={{
          position: 'absolute',
          top: 0,
          left: -5,
          right: 0,
          bottom: 0,
          borderRadius: 16,
          borderWidth: 1,
          borderColor: '#93F6D5',
          pointerEvents: 'none',
        }}
      />
    </AnimatedTouchableOpacity>
  );
}