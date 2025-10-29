import React from "react";
import { View, Text, TouchableOpacity, Image } from "react-native";
import { Ionicons } from "@expo/vector-icons";

interface SpecialServiceCardProps {
  title: string;
  description: string;
  image: any;
  onPress?: () => void;
  badge?: string; // Optional badge text
  featured?: boolean; // Featured card styling
}

const SpecialServiceCard: React.FC<SpecialServiceCardProps> = ({ 
  title, 
  description, 
  image, 
  onPress,
  badge,
  featured = false
}) => {
  return (
    <View className="mb-8">
      <TouchableOpacity 
        className={`bg-white rounded-2xl overflow-hidden shadow-lg border ${
          featured 
            ? 'border-gray-300 shadow-emerald-100' 
            : 'border-gray-100'
        }`}
        onPress={onPress}
        activeOpacity={0.8}
        style={{
          shadowColor: featured ? '#10B981' : '#000',
          shadowOffset: {
            width: 0,
            height: 4,
          },
          shadowOpacity: featured ? 0.15 : 0.1,
          shadowRadius: 8,
          elevation: featured ? 8 : 4,
        }}
      >
        {/* Image Section */}
        <View className="relative">
          <Image
            source={image}
            className="w-full h-48"
            resizeMode="cover"
          />
          
          {/* Badge Overlay */}
          {badge && (
            <View className="absolute top-3 left-3">
              <View className="bg-emerald-500 px-3 py-1 rounded-full shadow-sm">
                <Text className="text-white text-xs font-semibold">
                  {badge}
                </Text>
              </View>
            </View>
          )}

          {/* Featured Badge */}
          {featured && (
            <View className="absolute top-3 right-3">
              <View className="bg-amber-500 px-2 py-1 rounded-full flex-row items-center">
                <Ionicons name="star" size={12} color="white" />
                <Text className="text-white text-xs font-semibold ml-1">
                  Featured
                </Text>
              </View>
            </View>
          )}

        </View>

        {/* Content Section */}
        <View className="p-5">
          {/* Header */}
          <View className="flex-row items-start justify-between mb-1">
            <View className="flex-1 mr-3">
              <Text className="text-xl font-bold text-gray-900 leading-tight">
                {title}
              </Text>
            </View>
          </View>

          {/* Description */}
          <Text className="text-gray-600 text-sm leading-relaxed mb-2">
            {description}
          </Text>

          {/* Action Row */}
          <View className="flex-row items-center justify-between pt-3 border-t border-gray-100">
            <Text className={`text-sm font-semibold ${
              featured ? 'text-emerald-600' : 'text-gray-500'
            }`}>
              Learn More
            </Text>
            <View className="flex-row items-center">
              <Text className="text-xs text-gray-400 mr-2">Tap to view</Text>
              <Ionicons 
                name="chevron-forward-circle" 
                size={20} 
                color={featured ? '#10B981' : '#D1D5DB'} 
              />
            </View>
          </View>
        </View>
      </TouchableOpacity>
    </View>
  );
};

export default SpecialServiceCard;