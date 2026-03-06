import { View, Text, TouchableOpacity, Image, ScrollView } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";

function buildExplanation(predictedLabel?: string) {
  const label = (predictedLabel || "").toLowerCase();

  if (label.includes("too") || label.includes("early")) {
    return [
      "The model predicts the tree is still in the early stage.",
      "Resin development may not be sufficient yet.",
      "Consider waiting more months after inoculation."
    ];
  }

  if (label.includes("ready")) {
    return [
      "The model predicts the tree is ready stage.",
      "Bark image + numeric data indicate suitable maturity.",
      "You can continue to grading/export readiness checks."
    ];
  }

  if (label.includes("over") || label.includes("mature")) {
    return [
      "The model predicts the tree may be over-mature.",
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
    <View className="flex-1 bg-[#E6F2ED] p-5 justify-between">
      <ScrollView showsVerticalScrollIndicator={false}>
        {imageUri ? (
          <View className="bg-white rounded-2xl p-4 mt-6 shadow-md">
            <Text className="text-lg font-semibold mb-3">Uploaded Image</Text>
            <Image
              source={{ uri: imageUri }}
              className="w-full h-56 rounded-xl"
              resizeMode="cover"
            />
          </View>
        ) : null}

        <View className="bg-white rounded-2xl p-6 mt-6 shadow-md">
          <Text className="text-lg font-bold text-center mb-4">Predicted Stage</Text>

          <Text className="text-center mb-2">
            <Text className="font-semibold">Stage : </Text>
            {stage}
          </Text>

          <Text className="text-center mb-4">
            <Text className="font-semibold">Confidence : </Text>
            {(confidence * 100).toFixed(2)}%
          </Text>

          <View className="border-b border-gray-200 mb-4" />

          <Text className="font-semibold mb-2">Explanation :</Text>
          {bullets.map((b, idx) => (
            <Text key={idx} className="text-gray-700 mb-1">
              • {b}
            </Text>
          ))}

          {probabilities ? (
            <>
              <View className="border-b border-gray-200 my-4" />
              <Text className="font-semibold mb-2">Probabilities :</Text>
              {Object.entries(probabilities).map(([k, v]) => (
                <Text key={k} className="text-gray-700 mb-1">
                  • {k}: {(Number(v) * 100).toFixed(2)}%
                </Text>
              ))}
            </>
          ) : null}
        </View>
      </ScrollView>

      <View className="mb-6">
        <TouchableOpacity
          onPress={() => router.replace("/(services)/stage-upload")}
          className="border border-green-600 py-4 rounded-xl mb-3"
        >
          <Text className="text-green-700 text-center font-semibold text-lg">
            Try Again
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => router.push("/")}
          className="bg-green-600 py-4 rounded-xl"
        >
          <Text className="text-white text-center font-semibold text-lg">
            Back to Home
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}