import { router, useLocalSearchParams } from "expo-router";
import {
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Header from "../../components/ui/Header";
import { Ionicons } from "@expo/vector-icons";

export default function RemedySuggestion() {
  const { data } = useLocalSearchParams<{ data?: string }>();

  if (!data) {
    return (
      <SafeAreaView className="flex-1 bg-green-100">
        <Header title="Disease Detection" />
        <View className="flex-1 px-6 py-10">
          <View className="bg-white rounded-2xl border-2 border-red-200 p-6">
            <Text className="text-red-600 font-semibold mb-2">Error</Text>
            <Text className="text-gray-700">
              No disease data received. Please try again.
            </Text>

            <TouchableOpacity
              onPress={() => router.replace("/(services)/disease-upload")}
              className="bg-primary rounded-xl py-4 mt-6"
            >
              <Text className="text-white text-center font-semibold">
                Try Again
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </SafeAreaView>
    );
  }

  const parsed = JSON.parse(data);
  const disease = parsed.predicted_disease;
  const remedies: string[] = parsed.remedies ?? [];

  return (
    <SafeAreaView className="flex-1 bg-green-100">
      <Header title="Disease Detection" />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 32 }}
      >
        <View className="px-6 py-6">
          <View className="bg-white rounded-2xl border-2 border-green-200 p-6">
            {/* 🔴 HIGHLIGHTED DISEASE BOX */}
            <View className="bg-red-50 border-2 border-red-300 rounded-xl p-4 mb-5">
              <View className="flex-row items-center">
                <Ionicons
                  name="alert-circle-outline"
                  size={22}
                  color="#dc2626"
                />
                <Text className="ml-2 text-red-800 font-bold">
                  Detected Disease
                </Text>
              </View>

              <Text className="text-red-700 font-semibold mt-2">
                {disease}
              </Text>
            </View>

            {/* TITLE */}
            <Text className="text-lg font-bold text-center mb-4">
              Remedy Suggestions
            </Text>

            <View className="h-[1px] bg-green-500/30 mb-4" />

            {/* INSTRUCTIONS */}
            <Text className="font-semibold text-gray-800 mb-2">
              Recommended Actions
            </Text>

            {remedies.length ? (
              <View className="border border-gray-200 rounded-xl overflow-hidden">
                {remedies.map((r, i) => (
                  <View
                    key={i}
                    className={`px-4 py-3 flex-row ${
                      i !== remedies.length - 1
                        ? "border-b border-gray-200"
                        : ""
                    }`}
                  >
                    <Text className="font-bold text-gray-900 mr-2">
                      {i + 1}.
                    </Text>
                    <Text className="text-gray-700 flex-1">
                      {r}
                    </Text>
                  </View>
                ))}
              </View>
            ) : (
              <View className="bg-gray-50 border border-gray-200 rounded-xl p-4">
                <Text className="text-gray-500">
                  No remedies available for this disease.
                </Text>
              </View>
            )}

            {/* 🔴 IMPORTANT NOTICE */}
            <View className="mt-5 bg-red-50 border-2 border-red-200 rounded-xl p-4">
              <View className="flex-row items-start">
                <Ionicons
                  name="warning-outline"
                  size={20}
                  color="#dc2626"
                />
                <View className="ml-3 flex-1">
                  <Text className="text-red-700 font-bold mb-1">
                    Important Notice
                  </Text>
                  <Text className="text-red-600 text-sm leading-5">
                    These remedies are generated based on visual leaf analysis.
                    Effectiveness may vary depending on image quality and lighting setup when you capture image.
                  </Text>
                  <Text className="text-red-600 text-sm mt-2 leading-5">
                    For serious infections, consult an agricultural specialist
                    before applying treatments.
                  </Text>
                </View>
              </View>
            </View>
          </View>

          {/* ACTION BUTTONS */}
          <TouchableOpacity
            onPress={() => router.replace("/(services)/disease-upload")}
            className="border-2 border-green-200 rounded-xl py-4 mt-6"
          >
            <Text className="text-center font-semibold">
              Test Another Image
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => router.replace("/(tabs)")}
            className="bg-primary rounded-xl py-4 mt-4"
          >
            <Text className="text-white text-center font-semibold">
              Back to Home
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
