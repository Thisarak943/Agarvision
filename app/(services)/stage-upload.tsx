import { View, Text, TouchableOpacity, Image, TextInput, ScrollView } from "react-native";
import { useRouter } from "expo-router";
import * as ImagePicker from "expo-image-picker";
import { useState } from "react";
import { predictStage } from "../../services/stageApi";

export default function StageUpload() {
  const router = useRouter();

  const [image, setImage] = useState<string | null>(null);
  const [age, setAge] = useState("");
  const [diameter, setDiameter] = useState("");
  const [inoculations, setInoculations] = useState("");
  const [monthsFirst, setMonthsFirst] = useState("");
  const [monthsLast, setMonthsLast] = useState("");
  const [loading, setLoading] = useState(false);

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 1,
    });

    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };

  const handlePredict = async () => {
    try {
      if (!image) {
        alert("Please select an image first");
        return;
      }
      if (!age || !diameter || !inoculations || !monthsFirst || !monthsLast) {
        alert("Please fill all fields");
        return;
      }

      setLoading(true);

      const result = await predictStage({
        imageUri: image,
        tree_age: age,
        tree_diameter: diameter,
        inoculation_count: inoculations,
        months_since_first: monthsFirst,
        months_since_last: monthsLast,
      });

      setLoading(false);

      if (result.error) {
        alert(result.error);
        return;
      }

      router.push({
        pathname: "/(services)/stage-result",
        params: {
          result: JSON.stringify(result),
          imageUri: image,
        },
      });
    } catch (e: any) {
      setLoading(false);
      alert(e?.message || "Prediction failed");
    }
  };

  return (
    <View className="flex-1 bg-[#E6F2ED] p-5 justify-between">
      <ScrollView showsVerticalScrollIndicator={false}>
        <View className="bg-white rounded-2xl p-6 mt-6 shadow-md">
          <Text className="text-lg font-semibold mb-4">Upload Your Image</Text>

          <TouchableOpacity
            onPress={pickImage}
            className="border-2 border-dashed border-gray-400 rounded-xl p-6 items-center mb-6"
          >
            {image ? (
              <Image source={{ uri: image }} className="w-40 h-40 rounded-lg" />
            ) : (
              <Text className="text-gray-500">Select Image (Bark)</Text>
            )}
          </TouchableOpacity>

          <Text className="mb-1">Tree Age</Text>
          <TextInput
            value={age}
            onChangeText={setAge}
            placeholder="Enter age"
            keyboardType="numeric"
            className="border rounded-lg p-3 mb-4 bg-white"
          />

          <Text className="mb-1">Diameter (cm)</Text>
          <TextInput
            value={diameter}
            onChangeText={setDiameter}
            placeholder="Enter diameter"
            keyboardType="numeric"
            className="border rounded-lg p-3 mb-4 bg-white"
          />

          <Text className="mb-1">Inoculations Count</Text>
          <TextInput
            value={inoculations}
            onChangeText={setInoculations}
            placeholder="Enter count"
            keyboardType="numeric"
            className="border rounded-lg p-3 mb-4 bg-white"
          />

          <Text className="mb-1">Months Since First Inoculation</Text>
          <TextInput
            value={monthsFirst}
            onChangeText={setMonthsFirst}
            placeholder="Enter months"
            keyboardType="numeric"
            className="border rounded-lg p-3 mb-4 bg-white"
          />

          <Text className="mb-1">Months Since Last Inoculation</Text>
          <TextInput
            value={monthsLast}
            onChangeText={setMonthsLast}
            placeholder="Enter months"
            keyboardType="numeric"
            className="border rounded-lg p-3 mb-4 bg-white"
          />
        </View>
      </ScrollView>

      <TouchableOpacity
        onPress={handlePredict}
        disabled={loading}
        className={`py-4 rounded-xl mb-6 ${loading ? "bg-green-400" : "bg-green-600"}`}
      >
        <Text className="text-white text-center font-semibold text-lg">
          {loading ? "Predicting..." : "Predict"}
        </Text>
      </TouchableOpacity>
    </View>
  );
}