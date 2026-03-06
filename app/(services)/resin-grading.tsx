import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import Header from "../../components/ui/Header";

export default function ResinGrading() {
  const router = useRouter();

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      {/* Top header (your existing shared header) */}
      <Header title="Chips & Resin Grading" />

      <ScrollView
        className="flex-1 px-6 py-4"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 24 }}
      >
        {/* Main card */}
        <View className="bg-white rounded-2xl border border-gray-200 p-6">
          {/* Icon */}
          <View className="items-center mt-4">
            <View className="w-16 h-16 rounded-2xl bg-gray-100 items-center justify-center">
              <Ionicons name="calendar-outline" size={32} color="#111827" />
            </View>
          </View>

          {/* Title */}
          <Text className="text-lg font-bold text-gray-900 text-center mt-6">
            Export Quality Check on{"\n"}Agarwood Resin
          </Text>

          {/* Subtitle */}
          <Text className="text-gray-600 text-center mt-4 leading-5">
            Turn your photo into export{"\n"}ready insights.
          </Text>

          {/* Divider (green line like Figma) */}
          <View className="h-[2px] bg-primary mt-8 mb-6" />

          {/* Bottom text */}
          <Text className="text-gray-600 text-center leading-5">
            Upload your agarwood resin and instantly{"\n"}
            discover its quality grade and ideal{"\n"}
            marketplace.
          </Text>
        </View>

        {/* Button */}
        <TouchableOpacity
          onPress={() => router.push("/(services)/resin-grading-upload")}
          className="bg-primary rounded-xl py-4 items-center mt-6"
          activeOpacity={0.9}
        >
          <Text className="text-white font-semibold text-base">Get started</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}
