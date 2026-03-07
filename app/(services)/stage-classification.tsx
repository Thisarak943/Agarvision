import { View, Text, TouchableOpacity } from "react-native";
import { useRouter } from "expo-router";
import { Layers } from "lucide-react-native";

export default function StageClassification() {

  const router = useRouter();

  return (
    <View className="flex-1 bg-[#E6F2ED] px-6 pt-6 justify-between">

      {/* Page Title */}
      <View className="mb-4">
        <Text className="text-center text-2xl font-semibold text-gray-800">
          Resin Induction
        </Text>
        <Text className="text-center text-lg text-gray-600">
          Stage Classifier
        </Text>
      </View>

      {/* Card */}
      <View className="bg-white rounded-3xl p-7 shadow-lg border border-green-200 items-center">

        {/* Icon Container */}
        <View className="bg-green-100 p-5 rounded-2xl mb-5">
          <Layers size={40} color="#16a34a" />
        </View>

        {/* Card Title */}
        <Text className="text-xl font-bold text-center text-gray-800 mb-3">
          Resin Induction Stage Classifier
        </Text>

        {/* Description */}
        <Text className="text-gray-600 text-center leading-6">
          Agarwood resin forms only when a tree is induced at the right stage.
          Our system analyzes parameters such as tree age, trunk diameter, and
          inoculation history to determine whether a tree is{" "}
          <Text className="font-semibold">Too Early</Text>,{" "}
          <Text className="font-semibold">Ready</Text>, or{" "}
          <Text className="font-semibold">Over Mature</Text>.
        </Text>

        {/* Divider */}
        <View className="h-[2px] w-full bg-green-400 mt-6 mb-6 rounded" />

        {/* Bottom text */}
        <Text className="text-gray-500 text-center">
          Make smarter decisions, reduce losses, and maximize resin production
          with AI powered insights.
        </Text>

      </View>

      {/* Button Section */}
      <View className="mb-6 mt-6">

        <TouchableOpacity
          onPress={() => router.push("/(services)/stage-upload")}
          className="bg-green-600 py-4 rounded-xl shadow-md"
        >
          <Text className="text-white text-center font-semibold text-lg">
            Get Started
          </Text>
        </TouchableOpacity>

      </View>

    </View>
  );
}