import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Header from "../../components/ui/Header";

export default function DiseaseDetection() {
  return (
    <SafeAreaView className="flex-1 bg-green-100">
      <Header title="Disease Detection" />

      {/* Scroll content */}
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 20 }} // ✅ reduced padding
      >
        <View className="px-6 pt-6">
          {/* MAIN CARD */}
          <View className="bg-white rounded-2xl border-2 border-green-200 p-6 items-center shadow-sm">
            {/* ICON BOX */}
            <View className="w-20 h-20 rounded-2xl bg-green-50 border-2 border-green-300 items-center justify-center">
              <Ionicons name="leaf-outline" size={42} color="#16a34a" />
            </View>

            <Text className="text-xl font-extrabold mt-4 text-gray-900">
              Leaf Disease Detection
            </Text>

            <Text className="text-gray-600 text-center mt-3 leading-5">
              Upload an agarwood leaf image and let our AI detect common leaf
              diseases early—before they affect tree health and resin quality.
            </Text>

            {/* DIVIDER */}
            <View className="h-[1px] bg-green-400/50 w-full my-5" />

            {/* INFO BOX */}
            <View className="w-full bg-green-50 border-2 border-green-200 rounded-xl p-4">
              <Text className="text-green-900 font-semibold text-center">
                Analysis Includes
              </Text>
              <Text className="text-green-900/80 text-center text-xs mt-2 leading-4">
                Detected disease • confidence level • recommended remedies
              </Text>
            </View>

            {/* NOTE */}
            <Text className="text-gray-500 text-center text-xs mt-4">
              Tip: Use good lighting and a focused leaf image for best accuracy.
            </Text>
          </View>
        </View>

        {/* BUTTONS INSIDE SCROLL */}
        <View className="px-6 pt-12 pb-6">
          {/* GET STARTED */}
          <TouchableOpacity
            onPress={() => router.push("/(services)/disease-upload")}
            className="bg-primary rounded-xl py-4"
          >
            <Text className="text-white text-center font-semibold">
              Get Started
            </Text>
          </TouchableOpacity>

          {/* HISTORY */}
          <TouchableOpacity
            onPress={() => router.push("/(services)/disease-history")}
            className="bg-white border-2 border-green-200 rounded-xl py-4 mt-3"
          >
            <Text className="text-center font-semibold text-gray-900">
              View Prediction History
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
