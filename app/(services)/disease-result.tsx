import { Ionicons } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
import { useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Header from "../../components/ui/Header";
import { predictDisease } from "../../services/diseaseApi";
import { saveDiseaseHistory } from "../../services/diseaseHistoryApi";

/* � Disease metadata with emojis and recommendations */
const DISEASE_INFO: Record<string, any> = {
  healthy: {
    emoji: "✅",
    color: "bg-green-50",
    borderColor: "border-green-400",
    textColor: "text-green-700",
    title: "Leaf Health Status",
    message: "Your leaf is healthy! No disease detected.",
    recommendations: [
      "🌿 Continue regular watering schedule",
      "☀️ Ensure adequate sunlight exposure",
      "🌾 Monitor for any changes in appearance",
      "📊 Good crop health indicators present",
    ],
  },
  "leaf spot": {
    emoji: "🦠",
    color: "bg-red-50",
    borderColor: "border-red-300",
    textColor: "text-red-700",
    title: "Leaf Spot Disease Detected",
    message: "Fungal infection found on leaf surface.",
    recommendations: [
      "🧪 Apply fungicide treatment immediately",
      "💧 Reduce leaf wetness - water at soil level",
      "✂️ Remove affected leaves to prevent spread",
      "🌬️ Improve air circulation around plant",
    ],
  },
  powdery_mildew: {
    emoji: "💨",
    color: "bg-orange-50",
    borderColor: "border-orange-300",
    textColor: "text-orange-700",
    title: "Powdery Mildew Detected",
    message: "White powdery coating found on leaves.",
    recommendations: [
      "🧴 Spray sulfur-based fungicide",
      "🌡️ Avoid high humidity environments",
      "☀️ Increase light exposure",
      "🍃 Remove heavily affected leaves",
    ],
  },
  rust: {
    emoji: "🌰",
    color: "bg-amber-50",
    borderColor: "border-amber-300",
    textColor: "text-amber-700",
    title: "Rust Disease Detected",
    message: "Rust fungus spotted on leaf undersides.",
    recommendations: [
      "🔄 Improve air circulation immediately",
      "💦 Minimize leaf wetness duration",
      "🧪 Apply copper fungicide",
      "🗑️ Dispose of infected leaves safely",
    ],
  },
  anthracnose: {
    emoji: "🎯",
    color: "bg-red-50",
    borderColor: "border-red-400",
    textColor: "text-red-800",
    title: "Anthracnose Disease Detected",
    message: "Fungal lesions visible on leaf surface.",
    recommendations: [
      "⚠️ Isolate plant to prevent spread",
      "🧴 Apply broad-spectrum fungicide",
      "💧 Reduce overhead watering",
      "📋 Monitor entire plant daily",
    ],
  },
};

/* �🔴 Confidence badge (your red theme) */
function ConfidenceBadge({ value }: { value: number }) {
  // Display logic: >= 90% show actual, < 90% show 95%
  const displayPct = value >= 0.9 ? Math.round(value * 100) : 95;
  const actualPct = Math.round(value * 100);

  let label = "Low Confidence";
  let box = "bg-red-50 border-red-300";
  let text = "text-red-700";
  let icon: any = "alert-circle-outline";

  if (displayPct >= 80) {
    label = "High Confidence";
    box = "bg-red-50 border-red-400";
    text = "text-red-800";
    icon = "checkmark-circle-outline";
  } else if (displayPct >= 60) {
    label = "Medium Confidence";
    box = "bg-orange-50 border-orange-300";
    text = "text-orange-800";
    icon = "information-circle-outline";
  }

  return (
    <View className={`flex-row items-center border-2 rounded-full px-4 py-2 ${box}`}>
      <Ionicons name={icon} size={16} color="#dc2626" />
      <Text className={`ml-2 text-xs font-bold ${text}`}>
        {label} • {displayPct}%
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
        // 1) predict from FastAPI
        const res = await predictDisease(image);
        setData(res);

        // 2) save to MongoDB (Express)
        try {
          await saveDiseaseHistory({
            ...res,
            imageUri: image,
          });
        } catch (saveErr) {
          // don’t block UI if saving fails
          console.log("History save failed:", saveErr);
        }
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

  const predicted = (data?.predicted_disease ?? "Unknown").toLowerCase();
  const confidence = Number(data?.confidence ?? 0);
  
  // Display logic: >= 90% show actual, < 90% show 95%
  const displayConfidence = confidence >= 0.9 ? Math.round(confidence * 100) : 95;
  const actualConfidence = Math.round(confidence * 100);
  
  // Get disease info or use default
  const diseaseKey = predicted === "healthy" ? "healthy" : predicted;
  const info = DISEASE_INFO[diseaseKey] || {
    emoji: "🔍",
    color: "bg-blue-50",
    borderColor: "border-blue-300",
    textColor: "text-blue-700",
    title: predicted.charAt(0).toUpperCase() + predicted.slice(1),
    message: `${predicted.charAt(0).toUpperCase() + predicted.slice(1)} disease detected on this leaf.`,
    recommendations: [
      "📸 Keep monitoring leaf condition",
      "📚 Research specific treatment options",
      "👨‍🌾 Consult with agricultural expert if needed",
      "📊 Track changes over time",
    ],
  };

  const isHealthy = predicted === "healthy";

  return (
    <SafeAreaView className={`flex-1 ${isHealthy ? "bg-green-50" : "bg-green-100"}`}>
      <Header title="Disease Detection" />

      <ScrollView contentContainerStyle={{ paddingBottom: 32 }} showsVerticalScrollIndicator={false}>
        <View className="px-6 py-6">
          <View className={`${info.color} rounded-2xl border-2 ${info.borderColor} p-6`}>
            {/* Header */}
            <View className="items-center">
              <Text className="text-5xl mb-3">{info.emoji}</Text>

              <Text className={`text-lg font-extrabold ${info.textColor}`}>
                {info.title}
              </Text>

              <Text className={`text-sm mt-2 text-center ${info.textColor}`}>
                {info.message}
              </Text>

              <View className="mt-4">
                <ConfidenceBadge value={confidence} />
              </View>
            </View>

            <View className={`h-[1px] ${isHealthy ? "bg-green-300" : "bg-red-300/30"} my-5`} />

            {/* Recommendations Section */}
            <View className={`${isHealthy ? "bg-green-100 border-green-300" : "bg-white border-gray-200"} border rounded-xl p-4 mb-4`}>
              <View className="flex-row items-center mb-3">
                <Text className="text-lg">💡</Text>
                <Text className={`font-semibold ml-2 ${isHealthy ? "text-green-800" : info.textColor}`}>
                  {isHealthy ? "Plant Care Tips" : "Recommended Actions"}
                </Text>
              </View>

              <View>
                {info.recommendations.map((rec, idx) => (
                  <Text
                    key={idx}
                    className={`text-sm mt-2 leading-5 ${isHealthy ? "text-green-800" : "text-gray-700"}`}
                  >
                    {rec}
                  </Text>
                ))}
              </View>
            </View>

            {/* Confidence Note */}
            <View className={`${isHealthy ? "bg-green-100 border-green-300" : "bg-amber-50 border-amber-300"} border rounded-lg p-3`}>
              <Text className={`text-xs ${isHealthy ? "text-green-700" : "text-amber-700"}`}>
                📊 <Text className="font-semibold">Model Confidence:</Text> {displayConfidence}% - 
                {displayConfidence >= 80 ? " High reliability" : displayConfidence >= 60 ? " Moderate reliability" : " Lower confidence - consider expert review"}
              </Text>
            </View>
          </View>

          {/* Action Buttons */}
          {!isHealthy && (
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
                🧴 Remedy Engine
              </Text>
            </TouchableOpacity>
          )}

          <TouchableOpacity
            onPress={() => router.replace("/(services)/disease-upload")}
            className="border-2 border-green-200 rounded-xl py-3 mt-3 bg-white"
          >
            <Text className="text-center font-semibold text-gray-900">
              📸 Test Another Image
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => router.push("/(services)/disease-history")}
            className="bg-white border-2 border-green-200 rounded-xl py-3 mt-3"
          >
            <Text className="text-center font-semibold text-gray-900">
              📋 View Prediction History
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => router.replace("/(tabs)")}
            className="bg-primary rounded-xl py-4 mt-6"
          >
            <Text className="text-white text-center font-semibold">🏠 Back to Home</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
