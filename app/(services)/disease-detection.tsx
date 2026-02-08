import { router } from "expo-router";
import { Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Header from "../../components/ui/Header";
import { Ionicons } from "@expo/vector-icons";

export default function DiseaseDetection() {
  return (
    <SafeAreaView className="flex-1 bg-green-50">
      <Header title="Disease Detection" />

      <View className="flex-1 px-6 justify-center">
        <View className="bg-white rounded-2xl border border-gray-200 p-6 items-center">
          <Ionicons name="leaf-outline" size={64} color="#111" />

          <Text className="text-lg font-bold mt-4">
            Disease Detection
          </Text>

          <Text className="text-gray-600 text-center mt-4">
            Agarwood trees are vulnerable to diseases that affect growth and resin
            quality. This AI-powered feature helps detect leaf diseases early.
          </Text>

          <View className="h-[1px] bg-green-500 w-full my-6" />

          <Text className="text-gray-500 text-center">
            Upload a clear leaf image to get instant diagnosis and treatment
            suggestions.
          </Text>
        </View>

        <TouchableOpacity
          onPress={() => router.push("/(services)/disease-upload")}
          className="bg-primary rounded-xl py-4 mt-6"
        >
          <Text className="text-white text-center font-semibold">
            Get Started
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}
