import { useLocalSearchParams, useRouter } from "expo-router";
import { useMemo } from "react";
import { Image, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Header from "../../components/ui/Header";

type BackendResult = {
  predicted_class?: string;
  confidence?: number;
  predicted_index?: number;
  recommended_market?: string;
  market_reason?: string;
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
  const market = result?.recommended_market ?? "N/A";
  const marketReason = result?.market_reason ?? "";

  return (
    <SafeAreaView className="flex-1 bg-emerald-50">
      <Header title="Resin & Chips Grading" />

      <View className="flex-1 px-6 py-4">
        <View className="bg-white rounded-2xl border border-gray-200 p-5">
          <Text className="text-lg font-bold text-gray-900 text-center mb-4">
            Analyzed Result
          </Text>

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
            <ResultRow label="Grading Quality" value={grade} />
          </View>

          <View className="border-t border-gray-200 py-4">
            <ResultRow label="Confidence level" value={confidence} />
          </View>

          <View className="border-t border-gray-200 py-4">
            <ResultRow label="Recommended market" value={market} />
          </View>

          {marketReason ? (
            <Text className="text-gray-700 text-sm leading-5 mt-1">
              {marketReason}
            </Text>
          ) : null}

          {!result ? (
            <Text className="text-red-600 text-center mt-4">
              Result not received. Please try again.
            </Text>
          ) : null}

          <View className="bg-emerald-50 border border-emerald-200 rounded-2xl px-4 py-4 mt-6 mb-4">
            <Text className="text-gray-900 font-semibold text-center text-lg leading-6">
              Check whether the resin is Export Ready?
            </Text>
          </View>

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

function ResultRow({ label, value }: { label: string; value: string }) {
  return (
    <View className="flex-row items-start justify-between">
      <Text className="text-gray-700 flex-shrink-0 mr-4">{label}</Text>
      <Text className="font-bold text-gray-900 text-right flex-1">
        {value}
      </Text>
    </View>
  );
}
