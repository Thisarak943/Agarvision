// components/Header.tsx
import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";

interface HeaderProps {
  title: string;
  showBackButton?: boolean;
}

const Header: React.FC<HeaderProps> = ({ title, showBackButton = true }) => {
  return (
    <View className="flex-row items-center justify-between px-6 py-4 bg-white border-b border-gray-200">
      {showBackButton ? (
        <TouchableOpacity
          onPress={() => router.back()}
          className="p-2 -ml-2"
        >
          <Ionicons name="arrow-back" size={24} color="#374151" />
        </TouchableOpacity>
      ) : (
        <View className="w-8" /> 
      )}

      <Text className="text-xl font-semibold text-gray-900">
        {title}
      </Text>

      <View className="w-8" /> 
    </View>
  );
};

export default Header;
