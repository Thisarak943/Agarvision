import React, { useState } from "react";
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Image,
  Dimensions,
} from "react-native";
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from "@expo/vector-icons";
import Animated, { FadeIn, FadeInDown } from "react-native-reanimated";

const { width } = Dimensions.get('window');

interface SpecialServiceModalProps {
  visible: boolean;
  onClose: () => void;
  title: string;
  images: any[];
  specifications: Array<{
    label: string;
    value: string;
  }>;
  content: React.ReactNode;
}

export default function SpecialServiceModal({
  visible,
  onClose,
  title,
  images,
  specifications,
  content,
}: SpecialServiceModalProps) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const handleScroll = (event: any) => {
    const scrollPosition = event.nativeEvent.contentOffset.x;
    const index = Math.round(scrollPosition / width);
    setCurrentImageIndex(index);
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
    >
      <SafeAreaView className="flex-1 bg-gray-50">
        {/* Header */}
        <View className="px-6 py-4 bg-white border-b border-gray-100">
          <View className="flex-row items-center justify-between">
            <Text className="text-xl font-bold text-gray-900 flex-1 mr-4" numberOfLines={1}>
              {title}
            </Text>
            <TouchableOpacity onPress={onClose}>
              <Ionicons name="close" size={24} color="#6B7280" />
            </TouchableOpacity>
          </View>
        </View>

        {/* Scrollable Content */}
        <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
          {/* Image Slider */}
          {images && images.length > 0 && (
            <Animated.View entering={FadeIn.delay(100)} className="mb-6">
              <ScrollView
                horizontal
                pagingEnabled
                showsHorizontalScrollIndicator={false}
                onScroll={handleScroll}
                scrollEventThrottle={16}
              >
                {images.map((image, index) => (
                  <View key={index} style={{ width }}>
                    <Image
                      source={image}
                      style={{ 
                        width: width, 
                        height: 250,
                        resizeMode: 'cover'
                      }}
                    />
                  </View>
                ))}
              </ScrollView>

              {/* Image Indicators */}
              {images.length > 1 && (
                <View className="flex-row justify-center mt-4 px-6">
                  {images.map((_, index) => (
                    <View
                      key={index}
                      className={`h-2 w-2 rounded-full mx-1 ${
                        index === currentImageIndex 
                          ? 'bg-primary' 
                          : 'bg-gray-300'
                      }`}
                    />
                  ))}
                </View>
              )}
            </Animated.View>
          )}

          <View className="px-6">
            {/* Specifications Section */}
            {specifications && specifications.length > 0 && (
              <Animated.View entering={FadeInDown.delay(200)} className="mb-6">
                <Text className="text-xl font-bold text-gray-900 mb-4">Specifications</Text>
                <View className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
                  {specifications.map((spec, index) => (
                    <View 
                      key={index} 
                      className={`flex-row justify-between items-center py-3 ${
                        index !== specifications.length - 1 ? 'border-b border-gray-100' : ''
                      }`}
                    >
                      <Text className="text-gray-600 flex-1 mr-4">{spec.label}</Text>
                      <Text className="text-gray-900 font-medium text-right flex-1">
                        {spec.value}
                      </Text>
                    </View>
                  ))}
                </View>
              </Animated.View>
            )}

            {/* Content Section */}
            <Animated.View entering={FadeInDown.delay(300)}>
              <Text className="text-xl font-bold text-gray-900 mb-4">Details</Text>
              <View className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 mb-6">
                {content}
              </View>
            </Animated.View>
          </View>

          <View className="h-8" />
        </ScrollView>
      </SafeAreaView>
    </Modal>
  );
}