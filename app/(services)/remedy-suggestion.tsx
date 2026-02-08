import { router, useLocalSearchParams } from "expo-router";
import { Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Header from "../../components/ui/Header";

export default function RemedySuggestion() {
  const { data } = useLocalSearchParams<{ data: string }>();
  const parsed = JSON.parse(data!);

  return (
    <SafeAreaView className="flex-1 bg-green-50">
      <Header title="Disease Detection" />

      <View className="px-6 py-6">
        <View className="bg-white rounded-2xl border border-gray-200 p-6">
          <Text className="text-lg font-bold text-center mb-6">
            Remedy Suggestion
          </Text>

          <Text className="text-gray-700">
            Detected Disease:{" "}
            <Text className="font-semibold">
              {parsed.predicted_disease}
            </Text>
          </Text>

          <View className="h-[1px] bg-gray-200 my-4" />

          <Text className="font-semibold text-gray-800 mb-2">
            Instructions:
          </Text>

          {parsed.remedies?.length ? (
            parsed.remedies.map((r: string, i: number) => (
              <Text key={i} className="text-gray-700 mt-1">
                • {r}
              </Text>
            ))
          ) : (
            <Text className="text-gray-500">
              No remedies available.
            </Text>
          )}
        </View>

        <TouchableOpacity
          onPress={() => router.replace("/(services)/disease-detection")}
          className="border border-primary rounded-xl py-4 mt-6"
        >
          <Text className="text-primary text-center font-semibold">
            Try Again
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
    </SafeAreaView>
  );
}
