// components/ui/Input.tsx
import React, { useState } from 'react';
import { View, TextInput, Text, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Animated, { useSharedValue, useAnimatedStyle, withTiming } from 'react-native-reanimated';

interface InputProps {
  label: string;
  placeholder: string;
  value: string;
  onChangeText: (text: string) => void;
  secureTextEntry?: boolean;
  keyboardType?: 'default' | 'email-address' | 'numeric' | 'phone-pad';
  autoCapitalize?: 'none' | 'sentences' | 'words' | 'characters';
  error?: string;
}

export default function Input({
  label,
  placeholder,
  value,
  onChangeText,
  secureTextEntry = false,
  keyboardType = 'default',
  autoCapitalize = 'none',
  error
}: InputProps) {
  const [isFocused, setIsFocused] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  
  const borderColor = useSharedValue('#E5E7EB');
  
  const animatedStyle = useAnimatedStyle(() => {
    return {
      borderColor: borderColor.value,
    };
  });

  const handleFocus = () => {
    setIsFocused(true);
    borderColor.value = withTiming('#10B981');
  };

  const handleBlur = () => {
    setIsFocused(false);
    borderColor.value = withTiming(error ? '#EF4444' : '#E5E7EB');
  };

  return (
    <View className="mb-4">
      <Text className="text-gray-700 text-sm font-medium mb-2">{label}</Text>
      <Animated.View 
        style={animatedStyle}
        className="border-2 rounded-xl bg-white"
      >
        <View className="flex-row items-center">
          <TextInput
            className="flex-1 px-4 py-4 text-gray-900 font-medium"
            placeholder={placeholder}
            placeholderTextColor="#9CA3AF"
            value={value}
            onChangeText={onChangeText}
            onFocus={handleFocus}
            onBlur={handleBlur}
            secureTextEntry={secureTextEntry && !showPassword}
            keyboardType={keyboardType}
            autoCapitalize={autoCapitalize}
          />
          {secureTextEntry && (
            <TouchableOpacity
              onPress={() => setShowPassword(!showPassword)}
              className="px-4"
            >
              <Ionicons
                name={showPassword ? 'eye-off' : 'eye'}
                size={20}
                color="#9CA3AF"
              />
            </TouchableOpacity>
          )}
        </View>
      </Animated.View>
      {error && (
        <Text className="text-red-500 text-sm mt-1">{error}</Text>
      )}
    </View>
  );
}