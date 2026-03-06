import { View, Text, TouchableOpacity } from "react-native";
import { useRouter } from "expo-router";

export default function StageClassification() {
  const router = useRouter();

  return (
    <View className="flex-1 bg-[#E6F2ED] p-5 justify-between">
      
      {/* Card */}
      <View className="bg-white rounded-2xl p-6 mt-10 shadow-md">
        <Text className="text-xl font-bold text-center mb-4">
          Resin Induction Stage Classifier
        </Text>

        <Text className="text-center text-gray-600 leading-6">
          Agarwood resin forms only when a tree is induced at the right stage.
          Our system analyzes key parameters like age, diameter, and inoculation
          history to determine whether a tree is{" "}
          <Text className="font-semibold">
            Too Early, Ready, or Over Mature
          </Text>{" "}
          for induction.
        </Text>

        <View className="border-b border-green-500 my-6" />

        <Text className="text-center text-gray-500">
          Make smarter decisions, reduce losses, and maximize resin production
          with AI powered insights.
        </Text>
      </View>

      {/* Button */}
      <TouchableOpacity
        onPress={() => router.push("/(services)/stage-upload")}
        className="bg-green-600 py-4 rounded-xl mb-6"
      >
        <Text className="text-white text-center font-semibold text-lg">
          Get Started
        </Text>
      </TouchableOpacity>
    </View>
  );
}
