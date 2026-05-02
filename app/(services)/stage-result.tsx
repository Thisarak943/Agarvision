import { View, Text, TouchableOpacity, Image, ScrollView } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";

function buildExplanation(predictedLabel?: string) {
  const label = (predictedLabel || "").toLowerCase();

  if (label.includes("too") || label.includes("early")) {
    return [
      "The tree is still in the early stage.",
      "Resin development may not be sufficient yet.",
      "Consider waiting more months after inoculation."
    ];
  }

  if (label.includes("ready")) {
    return [
      "The tree is ready stage.",
      "Bark image and numeric data indicate suitable maturity.",
      "You can continue to grading/export readiness checks."
    ];
  }

  if (label.includes("over") || label.includes("mature")) {
    return [
      "The tree may be over-mature.",
      "Optimal induction timing may have passed.",
      "Consider reassessing tree condition and timing."
    ];
  }

  return ["Prediction generated. Check confidence/probabilities for details."];
}

export default function StageResult() {
  const router = useRouter();
  const params = useLocalSearchParams();

  const imageUri = params.imageUri ? String(params.imageUri) : null;

  let parsed: any = null;
  try {
    parsed = params.result ? JSON.parse(String(params.result)) : null;
  } catch {
    parsed = null;
  }

  const stage = parsed?.predicted_label || "N/A";
  const confidence = typeof parsed?.confidence === "number" ? parsed.confidence : 0;
  const probabilities = parsed?.probabilities || null;

  const bullets = buildExplanation(stage);

  return (
    <View className="flex-1 bg-[#E6F2ED]">
      <View className="bg-white h-20 px-6 flex-row items-center justify-center border-b border-gray-200">
        <TouchableOpacity onPress={() => router.back()} className="absolute left-6">
          <Text className="text-3xl text-gray-800">‹</Text>
        </TouchableOpacity>

        <Text className="text-xl font-semibold text-black">
          Resin Induction Stage Result
        </Text>
      </View>

      <ScrollView className="flex-1 px-5 pt-5" showsVerticalScrollIndicator={false}>
        {imageUri ? (
          <View className="bg-white rounded-3xl p-5 mt-2 shadow-lg border border-green-200">
            <Text className="text-lg font-semibold mb-4 text-gray-900">
              Uploaded Image
            </Text>

            <Image
              source={{ uri: imageUri }}
              className="w-full h-56 rounded-2xl"
              resizeMode="cover"
            />
          </View>
        ) : null}

        <View className="bg-white rounded-3xl p-6 mt-5 shadow-lg border border-green-200">
          <Text className="text-lg font-bold text-center text-gray-900 mb-4">
            Predicted Stage
          </Text>

          <View className="bg-green-50 rounded-2xl border border-green-200 py-6 px-4 items-center mb-5">
            <Text className="text-2xl font-bold text-green-800 text-center">
              {stage}
            </Text>

            <Text className="text-gray-600 mt-2 text-center">
              Confidence: {(confidence * 100).toFixed(2)}%
            </Text>
          </View>

          <View className="h-[2px] w-full bg-green-300 mb-5 rounded" />

          <Text className="font-semibold mb-3 text-gray-900">
            Explanation
          </Text>

          {bullets.map((b, idx) => (
            <Text key={idx} className="text-gray-700 mb-2 leading-6">
              • {b}
            </Text>
          ))}

          {probabilities ? (
            <>
              <View className="h-[1px] w-full bg-gray-200 my-5" />

              <Text className="font-semibold mb-3 text-gray-900">
                Probabilities
              </Text>

              {Object.entries(probabilities).map(([k, v]) => (
                <Text key={k} className="text-gray-700 mb-2">
                  • {k}: {(Number(v) * 100).toFixed(2)}%
                </Text>
              ))}
            </>
          ) : null}
        </View>

        <View className="h-28" />
      </ScrollView>

      <View className="px-5 pb-5 pt-3 bg-[#E6F2ED]">
        <TouchableOpacity
          onPress={() => router.replace("/(services)/stage-upload")}
          className="border border-green-600 py-4 rounded-xl mb-3 bg-white"
        >
          <Text className="text-green-700 text-center font-semibold text-lg">
            Try Again
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => router.push("/")}
          className="bg-green-600 py-4 rounded-xl shadow-md"
        >
          <Text className="text-white text-center font-semibold text-lg">
            Back to Home
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}