import { router, useLocalSearchParams } from "expo-router";
import { useEffect, useRef, useState } from "react";
import { Text, TouchableOpacity, View, ActivityIndicator } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Header from "../../components/ui/Header";
import { predictDisease } from "../../services/diseaseApi";

export default function DiseaseResult() {
  const { image } = useLocalSearchParams<{ image?: string }>();
  const [data, setData] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const ran = useRef(false);

  useEffect(() => {
    if (ran.current) return;
    ran.current = true;

    if (!image) {
      setError("No image received. Please upload again.");
      return;
    }

    (async () => {
      try {
        const res = await predictDisease(image);
        setData(res);
      } catch (e: any) {
        setError(e?.message || "Prediction failed. Please try again.");
      }
    })();
  }, [image]);

  if (error) {
    return (
      <SafeAreaView className="flex-1 bg-green-50">
        <Header title="Disease Detection" />
        <View className="flex-1 px-6 py-10">
          <View className="bg-white rounded-2xl border border-gray-200 p-6">
            <Text className="text-red-600 font-semibold mb-3">Error</Text>
            <Text className="text-gray-700">{error}</Text>

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

  if (!data) {
    return (
      <SafeAreaView className="flex-1 bg-green-50">
        <Header title="Disease Detection" />
        <View className="flex-1 justify-center items-center">
          <ActivityIndicator size="large" color="#16a34a" />
          <Text className="mt-4 text-gray-600">Analyzing image...</Text>
          <Text className="mt-1 text-gray-400 text-xs">
            (First prediction may take longer)
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-green-50">
      <Header title="Disease Detection" />

      <View className="px-6 py-6">
        <View className="bg-white rounded-2xl border border-gray-200 p-6">
          <Text className="text-lg font-bold text-center mb-6">Detected!</Text>

          <Text className="text-gray-700">
            Detected Disease:{" "}
            <Text className="font-semibold">{data.predicted_disease}</Text>
          </Text>

          <View className="h-[1px] bg-gray-200 my-4" />

          <Text className="text-gray-700">
            Model Confidence:{" "}
            <Text className="font-semibold">
              {Math.round((data.confidence ?? 0) * 100)}%
            </Text>
          </Text>

          <TouchableOpacity
            onPress={() =>
              router.push({
                pathname: "/(services)/remedy-suggestion",
                params: { data: JSON.stringify(data) },
              })
            }
            className="bg-primary rounded-xl py-3 mt-6"
          >
            <Text className="text-white text-center font-semibold">
              Remedy Engine
            </Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity
          onPress={() => router.replace("/(tabs)")}
          className="bg-primary rounded-xl py-4 mt-6"
        >
          <Text className="text-white text-center font-semibold">
            Back to Home
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}
