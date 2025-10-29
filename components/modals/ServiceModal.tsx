import React from "react";
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from "@expo/vector-icons";
import Animated, { FadeIn } from "react-native-reanimated";

interface ServiceModalProps {
  visible: boolean;
  onClose: () => void;
  title: string;
  content: React.ReactNode;
}

export default function ServiceModal({
  visible,
  onClose,
  title,
  content,
}: ServiceModalProps) {
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
            <Text className="text-xl font-bold text-gray-900">{title}</Text>
            <TouchableOpacity onPress={onClose}>
              <Ionicons name="close" size={24} color="#6B7280" />
            </TouchableOpacity>
          </View>
        </View>

        {/* Scrollable Content */}
        <ScrollView className="flex-1 px-6 py-6">
          <Animated.View entering={FadeIn.delay(200)}>
            {content}
          </Animated.View>
        </ScrollView>
      </SafeAreaView>
    </Modal>
  );
}
