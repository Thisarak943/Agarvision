import React, { useMemo } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { View, Text, TouchableOpacity, Image } from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import Header from "../../components/ui/Header";

type BackendResult = {
  predicted_class?: string;
  confidence?: number;
  predicted_index?: number;
  status?: string;
};

export default function ResinGradingResult() {
  const router = useRouter();
  const params = useLocalSearchParams();

  const imageUri = (params.imageUri as string) || null;
  const resultStr = (params.result as string) || "";

  const result: BackendResult | null = useMemo(() => {
    try {
      return resultStr ? (JSON.parse(resultStr) as BackendResult) : null;
    } catch {
      return null;
    }
  }, [resultStr]);

  const grade = result?.predicted_class ?? "N/A";
  const confidence =
    typeof result?.confidence === "number"
      ? `${Math.round(result.confidence * 100)}%`
      : "N/A";

  // You can change this later based on your own mapping logic
  const market = "N/A";

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      <Header title="Chips & Resin Grading" />

      <View className="flex-1 px-6 py-4">
        <View className="bg-white rounded-2xl border border-gray-200 p-5">
          <Text className="text-lg font-bold text-gray-900 text-center mb-4">
            Analyzed Result
          </Text>

          {/* Show uploaded image */}
          {imageUri ? (
            <View className="items-center mb-4">
              <Image
                source={{ uri: imageUri }}
                style={{ width: 160, height: 160, borderRadius: 16 }}
                resizeMode="cover"
              />
            </View>
          ) : null}

          <View className="border-t border-gray-200 py-4">
            <View className="flex-row justify-between">
              <Text className="text-gray-700">Grading Quality :</Text>
              <Text className="font-bold text-gray-900">{grade}</Text>
            </View>
          </View>

          <View className="border-t border-gray-200 py-4">
            <View className="flex-row justify-between">
              <Text className="text-gray-700">Confidence level :</Text>
              <Text className="font-bold text-gray-900">{confidence}</Text>
            </View>
          </View>

          <View className="border-t border-gray-200 py-4">
            <View className="flex-row justify-between">
              <Text className="text-gray-700">Recommended market :</Text>
              <Text className="font-bold text-gray-900">{market}</Text>
            </View>
          </View>

          {/* If something went wrong */}
          {!result ? (
            <Text className="text-red-600 text-center mt-4">
              Result not received. Please try again.
            </Text>
          ) : null}

          <Text className="text-gray-900 font-semibold text-center mt-6 mb-4">
            Check whether the resin is Export{"\n"}Ready ?
          </Text>

          <TouchableOpacity
            onPress={() => router.push("/(services)/export-readiness-form")}
            className="bg-primary rounded-xl py-3 items-center self-center px-10"
          >
            <Text className="text-white font-semibold">Check</Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity
          onPress={() => router.replace("/(services)/resin-grading-upload")}
          className="border-2 border-primary rounded-xl py-4 items-center mt-6"
        >
          <Text className="text-primary font-semibold">Upload Another Image</Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => router.push("/(tabs)")}
          className="bg-primary rounded-xl py-4 items-center mt-4"
        >
          <Text className="text-white font-semibold">Back to Home</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}