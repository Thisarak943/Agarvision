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
    // ✅ request permission (iOS sometimes needs explicit)
    const perm = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!perm.granted) {
      Alert.alert("Permission needed", "Please allow photo access to select an image.");
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      // ✅ VERSION-SAFE: works even if MediaType is not available
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 1,
    });

    if (!result.canceled && result.assets?.length) {
      setImage(result.assets[0].uri);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-green-50">
      <Header title="Disease Detection" />

      <View className="flex-1 px-6 py-6">
        <View className="bg-white rounded-2xl border border-gray-200 p-6">
          <Text className="text-lg font-bold text-center mb-4">
            Upload Your Image
          </Text>

          <View className="border border-dashed border-gray-500 rounded-xl p-8 items-center">
            {image ? (
              <View className="relative">
                <Image source={{ uri: image }} className="w-44 h-44 rounded-lg" />
                <TouchableOpacity
                  onPress={() => setImage(null)}
                  className="absolute -top-3 -right-3 bg-gray-200 rounded-full p-2"
                >
                  <Ionicons name="close" size={16} color="#111" />
                </TouchableOpacity>
              </View>
            ) : (
              <Ionicons name="camera-outline" size={54} color="#999" />
            )}

            <TouchableOpacity
              onPress={pickImage}
              className="bg-primary rounded-lg px-8 py-3 mt-5"
            >
              <Text className="text-white font-semibold">Select</Text>
            </TouchableOpacity>

            <Text className="text-gray-500 text-xs mt-3 text-center">
              Upload a clear agarwood leaf image
            </Text>
          </View>
        </View>

        <TouchableOpacity
          disabled={!image}
          onPress={() =>
            router.push({
              pathname: "/(services)/disease-result",
              params: { image: image ?? "" },
            })
          }
          className={`rounded-xl py-4 mt-6 ${image ? "bg-primary" : "bg-gray-300"}`}
        >
          <Text className="text-white text-center font-semibold">Continue</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}
