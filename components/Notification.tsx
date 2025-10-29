// components/Notification.tsx
import React, { useEffect } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Animated, { 
  useSharedValue, 
  useAnimatedStyle, 
  withTiming, 
  withSequence,
  runOnJS
} from 'react-native-reanimated';

interface NotificationProps {
  type: 'success' | 'error' | 'info';
  title: string;
  message: string;
  visible: boolean;
  onClose: () => void;
  duration?: number;
}

export default function Notification({
  type,
  title,
  message,
  visible,
  onClose,
  duration = 4000
}: NotificationProps) {
  const translateY = useSharedValue(-100);
  const opacity = useSharedValue(0);

  useEffect(() => {
    if (visible) {
      translateY.value = withTiming(0, { duration: 300 });
      opacity.value = withTiming(1, { duration: 300 });

      const timer = setTimeout(() => {
        hideNotification();
      }, duration);

      return () => clearTimeout(timer);
    }
  }, [visible]);

  const hideNotification = () => {
    translateY.value = withSequence(
      withTiming(-100, { duration: 300 }),
      withTiming(-100, { duration: 0 }, () => runOnJS(onClose)())
    );
    opacity.value = withTiming(0, { duration: 300 });
  };

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateY: translateY.value }],
      opacity: opacity.value,
    };
  });

  const getStyles = () => {
    switch (type) {
      case 'success':
        return { bg: 'bg-green-50', border: 'border-green-200', text: 'text-green-800', icon: 'checkmark-circle' };
      case 'error':
        return { bg: 'bg-red-50', border: 'border-red-200', text: 'text-red-800', icon: 'alert-circle' };
      default:
        return { bg: 'bg-blue-50', border: 'border-blue-200', text: 'text-blue-800', icon: 'information-circle' };
    }
  };

  const styles = getStyles();

  if (!visible) return null;

  return (
    <Animated.View
      style={animatedStyle}
      className={`absolute top-12 left-4 right-4 z-50 ${styles.bg} ${styles.border} border rounded-xl p-4 shadow-lg`}
    >
      <View className="flex-row items-start justify-between">
        <View className="flex-row items-start flex-1">
          <Ionicons 
            name={styles.icon as any} 
            size={20} 
            color={type === 'success' ? '#059669' : type === 'error' ? '#DC2626' : '#2563EB'} 
            style={{ marginRight: 12, marginTop: 2 }} 
          />
          <View className="flex-1">
            <Text className={`font-semibold mb-1 ${styles.text}`}>{title}</Text>
            <Text className={`text-sm ${styles.text} opacity-80`}>{message}</Text>
          </View>
        </View>
        <TouchableOpacity onPress={hideNotification} className="ml-2">
          <Ionicons name="close" size={20} color="#6B7280" />
        </TouchableOpacity>
      </View>
    </Animated.View>
  );
}