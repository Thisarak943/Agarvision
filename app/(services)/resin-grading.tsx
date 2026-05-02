import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
//import { PremiumServiceGuard } from "../../components/PremiumServiceGuard";
import Header from "../../components/ui/Header";

export default function ResinGrading() {
  const router = useRouter();

  return (
    //<PremiumServiceGuard serviceName="Resin & Chips Grading">
    <SafeAreaView className="flex-1 bg-emerald-50">
      <Header title="Resin & Chips Grading" />

      <View className="flex-1 px-5 py-4 justify-between">
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 20 }}
        >
          <View
            className="bg-white rounded-3xl border border-emerald-200 p-6"
            style={{
              shadowColor: "#22C55E",
              shadowOpacity: 0.12,
              shadowRadius: 10,
              shadowOffset: { width: 0, height: 4 },
              elevation: 4,
            }}
          >
            <View className="items-center mt-2">
               <View className="w-24 h-24 rounded-3xl bg-emerald-50 border border-emerald-200 items-center justify-center">
              <Ionicons name="cube-outline" size={42} color="#16A34A" />
            </View>
          </View> 

            <Text className="text-2xl font-bold text-gray-900 text-center mt-6">
              Resin Quality Grading
            </Text>

            <Text className="text-gray-600 text-center mt-4 leading-7 text-base">
              Upload an agarwood resin image and let the system evaluate
              its quality grade for better export and market decisions.
            </Text>

            <View className="h-[2px] bg-emerald-200 mt-8 mb-6" />

            <View className="bg-emerald-50 border border-emerald-200 rounded-2xl px-5 py-5">
              <Text className="text-center text-emerald-900 font-bold text-xl">
                Analysis Includes
              </Text>

              <Text className="text-center text-emerald-800 mt-4 leading-7 text-base">
                quality grade • export suitability • market-oriented insights
              </Text>
            </View>

            <Text className="text-center text-gray-500 mt-6 leading-6 text-base">
              Tip: Use a clear, well-lit resin image for more accurate grading results.
            </Text>
          </View>
        </ScrollView>

        <TouchableOpacity
          onPress={() => router.push("/(services)/resin-grading-upload")}
          className="bg-primary rounded-2xl py-5 items-center mt-4"
          activeOpacity={0.9}
        >
          <Text className="text-white font-bold text-xl">Get Started</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
    //</PremiumServiceGuard>
  );
}