import { View, Text, TouchableOpacity } from "react-native";
import { useRouter } from "expo-router";
import { Layers } from "lucide-react-native";

export default function StageClassification() {

  const router = useRouter();

  return (
    <View className="flex-1 bg-[#E6F2ED] p-6 justify-between">

      {/* Card */}
      <View className="bg-white rounded-2xl p-8 mt-10 shadow-lg items-center">

        {/* Icon */}
        <View className="mb-6">
          <Layers size={60} color="#2f2f2f" />
        </View>

        {/* Title */}
        <Text className="text-xl font-bold text-center mb-4">
          Resin Induction Stage Classifier
        </Text>

        {/* Description */}
        <Text className="text-gray-600 text-center leading-6">
          Agarwood resin forms only when a tree is induced at the right stage.
          Our system analyzes key parameters like age, diameter, and inoculation
          history to determine whether a tree is {" "}
          <Text className="font-semibold">Too Early</Text>,{" "}
          <Text className="font-semibold">Ready</Text>, or{" "}
          <Text className="font-semibold">Over Mature</Text> for induction.
        </Text>

        {/* Divider */}
        <View className="h-[2px] w-full bg-green-500 mt-6 mb-6 rounded" />

        {/* Bottom Text */}
        <Text className="text-gray-500 text-center">
          Make smarter decisions, reduce losses, and maximize resin production
          with AI powered insights.
        </Text>

      </View>

      {/* Button */}
      <TouchableOpacity
        onPress={() => router.push("/(services)/stage-upload")}
        className="bg-green-600 py-4 rounded-xl mb-8"
      >
        <Text className="text-white text-center font-semibold text-lg">
          Get Started
        </Text>
      </TouchableOpacity>

    </View>
  );
}