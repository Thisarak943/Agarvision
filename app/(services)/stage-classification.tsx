import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { Text, TouchableOpacity, View } from "react-native";
import { PremiumServiceGuard } from "../../components/PremiumServiceGuard";

export default function StageClassification() {
  const router = useRouter();

  return (
    <PremiumServiceGuard serviceName="Stage Classification">
      <View className="flex-1 bg-[#E6F2ED]">

      {/* Header */}
      <View className="bg-white h-20 px-6 flex-row items-center justify-center border-b border-gray-200">
        <TouchableOpacity
          onPress={() => router.back()}
          className="absolute left-6"
        >
          <MaterialCommunityIcons name="arrow-left" size={26} color="#1f2937" />
        </TouchableOpacity>

        <Text className="text-xl font-semibold text-black">
          Resin Induction Stage Classifier
        </Text>
      </View>

      <View className="flex-1 px-6 pt-6 justify-between">

        {/* Card */}
        <View className="bg-white rounded-3xl p-7 shadow-lg border border-green-200 items-center">

        {/* Icon Container */}
        <View className="bg-green-100 p-5 rounded-2xl mb-5">
          <MaterialCommunityIcons name="layers-outline" size={40} color="#16a34a" />
        </View>

        {/* Card Title */}
        <Text className="text-xl font-bold text-center text-gray-800 mb-3">
          Resin Induction Stage Classifier
        </Text>

          {/* Description */}
          <Text className="text-gray-600 text-center leading-6 mb-6">
            Agarwood resin forms only when a tree is induced at the right stage.
            Our system analyzes parameters such as tree age, trunk diameter, and
            inoculation history to determine whether a tree is{" "}
            <Text className="font-semibold">Too Early</Text>,{" "}
            <Text className="font-semibold">Ready</Text>, or{" "}
            <Text className="font-semibold">Over Mature</Text>.
          </Text>

          {/* Divider */}
          <View className="h-[2px] w-full bg-green-400 mb-6 rounded" />

          {/* Analysis Box */}
          <View className="w-full bg-green-50 rounded-2xl border border-green-200 py-6 px-4 items-center mb-6">
            <Text className="text-lg font-bold text-green-900 mb-3">
              Analysis Includes
            </Text>

            <Text className="text-green-800 text-center leading-6">
              bark image validation • tree age • trunk diameter • inoculation history
            </Text>
          </View>

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
      </View>
    </PremiumServiceGuard>
  );
}