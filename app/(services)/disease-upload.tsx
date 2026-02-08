import * as ImagePicker from "expo-image-picker";
import { router } from "expo-router";
import { useState } from "react";
import { Image, Text, TouchableOpacity, View, Alert } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Header from "../../components/ui/Header";
import { Ionicons } from "@expo/vector-icons";

export default function DiseaseUpload() {
  const [image, setImage] = useState<string | null>(null);

  const pickImage = async () => {
    const perm = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!perm.granted) {
      Alert.alert(
        "Permission needed",
        "Please allow photo access to select an image."
      );
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 1,
    });

    if (!result.canceled && result.assets?.length) {
      setImage(result.assets[0].uri);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-green-100">
      <Header title="Disease Detection" />

      <View className="flex-1 px-6 py-6">
        {/* MAIN CARD */}
        <View className="bg-white rounded-2xl border-2 border-green-200 p-6">
          <Text className="text-xl font-extrabold text-center mb-4 text-gray-900">
            Upload Leaf Image
          </Text>

          {/* UPLOAD AREA */}
          <View className="border-2 border-dashed border-green-300 bg-green-50/40 rounded-xl p-8 items-center">
            {image ? (
              <View className="relative">
                <Image source={{ uri: image }} className="w-44 h-44 rounded-xl" />

                <TouchableOpacity
                  onPress={() => setImage(null)}
                  className="absolute -top-3 -right-3 bg-white border border-gray-200 rounded-full p-2"
                >
                  <Ionicons name="close" size={16} color="#111" />
                </TouchableOpacity>
              </View>
            ) : (
              <View className="w-20 h-20 rounded-2xl bg-white border-2 border-green-200 items-center justify-center">
                <Ionicons name="camera-outline" size={38} color="#16a34a" />
              </View>
            )}

            <TouchableOpacity
              onPress={pickImage}
              className="bg-primary rounded-xl px-8 py-3 mt-5 border border-green-700/20"
            >
              <Text className="text-white font-semibold">Select</Text>
            </TouchableOpacity>

            <Text className="text-gray-500 text-xs mt-3 text-center">
              Upload a clear agarwood leaf image
            </Text>
          </View>
        </View>

        {/* CONTINUE BUTTON */}
        <TouchableOpacity
          disabled={!image}
          onPress={() =>
            router.push({
              pathname: "/(services)/disease-result",
              params: { image: image ?? "" },
            })
          }
          className={`rounded-xl py-4 mt-6 ${
            image ? "bg-primary" : "bg-gray-300"
          }`}
        >
          <Text className="text-white text-center font-semibold">Continue</Text>
        </TouchableOpacity>

        {/* TIPS SECTION */}
        <View className="mt-6 bg-white rounded-2xl border border-green-200 p-5">
          <Text className="font-semibold text-gray-800 mb-3">
            Tips for Best Results
          </Text>

          <View className="space-y-3">
            <View className="flex-row items-center">
              <Ionicons name="sunny-outline" size={18} color="#16a34a" />
              <Text className="ml-3 text-gray-600 text-sm">
                Take photos in good natural lighting
              </Text>
            </View>

            <View className="flex-row items-center">
              <Ionicons name="scan-outline" size={18} color="#16a34a" />
              <Text className="ml-3 text-gray-600 text-sm">
                Keep the leaf fully visible and in focus
              </Text>
            </View>

            <View className="flex-row items-center">
              <Ionicons name="image-outline" size={18} color="#16a34a" />
              <Text className="ml-3 text-gray-600 text-sm">
                Avoid blurry or low-resolution images
              </Text>
            </View>

            <View className="flex-row items-center">
              <Ionicons name="leaf-outline" size={18} color="#16a34a" />
              <Text className="ml-3 text-gray-600 text-sm">
                Capture only agarwood leaves (no background clutter)
              </Text>
            </View>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
}
