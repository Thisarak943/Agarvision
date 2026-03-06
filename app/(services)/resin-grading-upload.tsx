import React, { useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { View, Text, TouchableOpacity, Image, Alert, ActivityIndicator } from "react-native";
import { useRouter } from "expo-router";
import * as ImagePicker from "expo-image-picker";
import Header from "../../components/ui/Header";
import { Ionicons } from "@expo/vector-icons";
import { predictResinGrading } from "../../services/resinGradingApi";

export default function ResinGradingUpload() {
  const router = useRouter();
  const [imageUri, setImageUri] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const pickImage = async () => {
    const perm = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!perm.granted) return;

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 1,
    });

    if (!result.canceled) {
      setImageUri(result.assets[0].uri);
    }
  };

  const clearImage = () => setImageUri(null);

  const analyzeImage = async () => {
    if (!imageUri) return;

    try {
      setLoading(true);

      // call backend
      const result = await predictResinGrading(imageUri);

      // go to result page with response + image
      router.push({
        pathname: "/(services)/resin-grading-result",
        params: {
          imageUri,
          result: JSON.stringify(result),
        },
      });
    } catch (e: any) {
      Alert.alert("Network error", e?.message ?? "Failed to analyze image");
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      <Header title="Chips & Resin Grading" />

      <View className="flex-1 px-6 py-4">
        <View className="bg-white rounded-2xl border border-gray-200 p-5 flex-1">
          <Text className="text-lg font-bold text-gray-900 text-center mb-4">
            Upload Your Image
          </Text>

          <View className="border border-dashed border-gray-400 rounded-2xl p-6 items-center justify-center flex-1">
            {imageUri ? (
              <View className="w-full items-center">
                <View className="w-full items-end">
                  <TouchableOpacity
                    onPress={clearImage}
                    className="w-9 h-9 rounded-full bg-gray-200 items-center justify-center"
                    disabled={loading}
                  >
                    <Ionicons name="close" size={18} color="#111827" />
                  </TouchableOpacity>
                </View>

                <Image
                  source={{ uri: imageUri }}
                  style={{ width: 180, height: 180, borderRadius: 16 }}
                  resizeMode="cover"
                />
              </View>
            ) : (
              <View className="items-center">
                <View className="w-28 h-28 rounded-2xl bg-gray-200 items-center justify-center mb-4">
                  <Ionicons name="camera-outline" size={40} color="#111827" />
                </View>

                <TouchableOpacity
                  onPress={pickImage}
                  className="bg-primary rounded-xl px-10 py-3"
                  disabled={loading}
                >
                  <Text className="text-white font-semibold">Select</Text>
                </TouchableOpacity>

                <Text className="text-gray-600 text-center mt-4">
                  Upload your image{"\n"}(image of your agarwood resin)
                </Text>
              </View>
            )}
          </View>
        </View>

        <TouchableOpacity
          onPress={analyzeImage}
          disabled={!imageUri || loading}
          className={`rounded-xl py-4 items-center mt-5 ${
            imageUri && !loading ? "bg-primary" : "bg-gray-300"
          }`}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text className="text-white font-semibold text-base">
              Analyze Image
            </Text>
          )}
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}