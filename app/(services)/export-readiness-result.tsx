import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { View, Text, TouchableOpacity } from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import Header from "../../components/ui/Header";

export default function ExportReadinessResult() {
  const router = useRouter();
  const params = useLocalSearchParams();

  const parsed = params?.result ? JSON.parse(String(params.result)) : {};

  // ✅ Matches backend response keys
  const readiness = parsed.export_readiness ?? "-";
  const primaryReason = parsed.primary_reason ?? "-";
  const additionalReason = parsed.additional_reason ?? "-";
  const tip = parsed.improvement_tip ?? "-";

  return (
    <SafeAreaView className="flex-1 bg-emerald-50">
      <Header title="Export Readiness" />

      <View className="flex-1 px-6 py-4">
        <View className="bg-white rounded-2xl border border-gray-200 p-5">
          <Text className="text-lg font-bold text-gray-900 text-center mb-4">
            Analyzed Insights
          </Text>

          <View className="border-t border-gray-200 py-4">
            <View className="flex-row justify-between">
              <Text className="text-gray-700">Export Readiness :</Text>
              <Text className="font-bold text-gray-900">{readiness}</Text>
            </View>
          </View>

          <View className="border-t border-gray-200 py-4">
            <View className="flex-row justify-between">
              <Text className="text-gray-700">Primary Reason :</Text>
              <Text className="font-bold text-gray-900 text-right w-[55%]">
                {primaryReason}
              </Text>
            </View>
          </View>

          <View className="bg-emerald-100 rounded-xl py-2 px-3 mt-3">
            <Text className="text-center text-gray-900 font-semibold">
              Additional Reason
            </Text>
          </View>
          <Text className="text-gray-900 mt-2 font-semibold">
            {additionalReason}
          </Text>

          <View className="bg-emerald-100 rounded-xl py-2 px-3 mt-5">
            <Text className="text-center text-gray-900 font-semibold">
              Improvement Tip
            </Text>
          </View>
          <Text className="text-gray-900 mt-2 font-semibold">{tip}</Text>
        </View>

        <TouchableOpacity
          onPress={() => router.push("/(tabs)")}
          className="bg-primary rounded-xl py-4 items-center mt-6"
        >
          <Text className="text-white font-semibold">Back to Home</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}