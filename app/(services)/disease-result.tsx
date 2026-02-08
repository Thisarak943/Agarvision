import { router, useLocalSearchParams } from "expo-router";
import { useEffect, useRef, useState } from "react";
import {
  Text,
  TouchableOpacity,
  View,
  ActivityIndicator,
  ScrollView,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Header from "../../components/ui/Header";
import { predictDisease } from "../../services/diseaseApi";
import { Ionicons } from "@expo/vector-icons";

/* 🔴 UPDATED CONFIDENCE BADGE ONLY */
function ConfidenceBadge({ value }: { value: number }) {
  const pct = Math.round((value ?? 0) * 100);

  let label = "Low Confidence";
  let box = "bg-red-50 border-red-300";
  let text = "text-red-700";
  let icon: any = "alert-circle-outline";

  if (pct >= 80) {
    label = "High Confidence";
    box = "bg-red-50 border-red-400";
    text = "text-red-800";
    icon = "checkmark-circle-outline";
  } else if (pct >= 60) {
    label = "Medium Confidence";
    box = "bg-orange-50 border-orange-300";
    text = "text-orange-800";
    icon = "information-circle-outline";
  }

  return (
    <View className={`flex-row items-center border-2 rounded-full px-4 py-2 ${box}`}>
      <Ionicons name={icon} size={16} color="#dc2626" />
      <Text className={`ml-2 text-xs font-bold ${text}`}>
        {label} • {pct}%
      </Text>
    </View>
  );
}

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
      <SafeAreaView className="flex-1 bg-green-100">
        <Header title="Disease Detection" />
        <View className="flex-1 px-6 py-10">
          <View className="bg-white rounded-2xl border-2 border-green-200 p-6">
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
      <SafeAreaView className="flex-1 bg-green-100">
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

  const predicted = data?.predicted_disease ?? "Unknown";
  const confidence = Number(data?.confidence ?? 0);
  const top1 = data?.top2?.top1;
  const top2 = data?.top2?.top2;
  const gap = data?.top2?.gap;

  const allProbs = data?.all_probabilities
    ? Object.entries(data.all_probabilities).map(([k, v]: any) => ({
        label: k,
        prob: Number(v),
      }))
    : [];

  allProbs.sort((a, b) => b.prob - a.prob);

  return (
    <SafeAreaView className="flex-1 bg-green-100">
      <Header title="Disease Detection" />

      <ScrollView
        contentContainerStyle={{ paddingBottom: 32 }}
        showsVerticalScrollIndicator={false}
      >
        <View className="px-6 py-6">
          <View className="bg-white rounded-2xl border-2 border-green-200 p-6">
            {/* Header */}
            <View className="items-center">
              <View className="w-16 h-16 rounded-2xl bg-green-50 border-2 border-green-200 items-center justify-center">
                <Ionicons name="pulse-outline" size={28} color="#16a34a" />
              </View>

              <Text className="text-lg font-extrabold mt-4">
                Prediction Result
              </Text>

              <View className="mt-3">
                <ConfidenceBadge value={confidence} />
              </View>
            </View>

            <View className="h-[1px] bg-green-500/30 my-5" />

            <Text className="text-gray-700">
              Detected Disease:{" "}
              <Text className="font-semibold">{predicted}</Text>
            </Text>

            <Text className="text-gray-700 mt-2">
              Model Confidence:{" "}
              <Text className="font-semibold">
                {Math.round(confidence * 100)}%
              </Text>
            </Text>

            {(top1 || top2) && (
              <View className="mt-5 bg-green-50 border border-green-200 rounded-xl p-4">
                <Text className="font-semibold mb-2">Top Predictions</Text>
                {top1 && (
                  <Text className="text-sm">
                    1) {top1.label} • {Math.round(top1.prob * 100)}%
                  </Text>
                )}
                {top2 && (
                  <Text className="text-sm mt-1">
                    2) {top2.label} • {Math.round(top2.prob * 100)}%
                  </Text>
                )}
                {gap !== undefined && (
                  <Text className="text-xs text-gray-500 mt-2">
                    Confidence gap: {Math.round(gap * 100)}%
                  </Text>
                )}
              </View>
            )}

            {allProbs.length > 0 && (
              <View className="mt-5">
                <Text className="font-semibold mb-2">
                  Probability Breakdown
                </Text>

                <View className="border border-gray-200 rounded-xl overflow-hidden">
                  {allProbs.map((p, idx) => (
                    <View
                      key={p.label}
                      className={`px-4 py-3 ${
                        idx !== allProbs.length - 1
                          ? "border-b border-gray-200"
                          : ""
                      }`}
                    >
                      <View className="flex-row justify-between mb-1">
                        <Text className="text-sm">{p.label}</Text>
                        <Text className="text-sm font-semibold">
                          {Math.round(p.prob * 100)}%
                        </Text>
                      </View>
                      <View className="h-2 bg-gray-200 rounded-full overflow-hidden">
                        <View
                          style={{ width: `${p.prob * 100}%` }}
                          className="h-2 bg-green-500"
                        />
                      </View>
                    </View>
                  ))}
                </View>
              </View>
            )}

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

            <TouchableOpacity
              onPress={() => router.replace("/(services)/disease-upload")}
              className="border-2 border-green-200 rounded-xl py-3 mt-3"
            >
              <Text className="text-center font-semibold">
                Test Another Image
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
      </ScrollView>
    </SafeAreaView>
  );
}
