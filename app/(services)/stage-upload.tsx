import { View, Text, TouchableOpacity, Image, TextInput, ScrollView } from "react-native";
import { useRouter } from "expo-router";
import * as ImagePicker from "expo-image-picker";
import { useState } from "react";
import { predictStage } from "../../services/stageApi";
import Toast from "react-native-toast-message";

export default function StageUpload() {
  const router = useRouter();

  const [image, setImage] = useState<string | null>(null);

  const [age, setAge] = useState("");
  const [diameter, setDiameter] = useState("");
  const [inoculations, setInoculations] = useState("");
  const [monthsFirst, setMonthsFirst] = useState("");
  const [monthsLast, setMonthsLast] = useState("");

  const [imageError, setImageError] = useState("");
  const [ageError, setAgeError] = useState("");
  const [diameterError, setDiameterError] = useState("");
  const [inoculationsError, setInoculationsError] = useState("");
  const [monthsFirstError, setMonthsFirstError] = useState("");
  const [monthsLastError, setMonthsLastError] = useState("");

  const [loading, setLoading] = useState(false);

  const isNumeric = (value: string) => value.trim() !== "" && !isNaN(Number(value));

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 1,
    });

    if (!result.canceled) {
      setImage(result.assets[0].uri);
      setImageError("");
    }
  };

  const validateImage = () => {
    if (!image) {
      setImageError("Please select an image.");
      return false;
    }
    setImageError("");
    return true;
  };

  const validateAge = (value: string) => {
    if (!value.trim()) {
      setAgeError("Tree age is required.");
      return false;
    }

    if (!isNumeric(value)) {
      setAgeError("Tree age must be numeric.");
      return false;
    }

    const ageNum = Number(value);

    if (ageNum < 0) {
      setAgeError("Tree age cannot be negative.");
      return false;
    }

    if (ageNum < 5) {
      setAgeError("Tree age must be 5 or above.");
      return false;
    }

    setAgeError("");
    return true;
  };

  const validateDiameter = (value: string) => {
    if (!value.trim()) {
      setDiameterError("Diameter is required.");
      return false;
    }

    if (!isNumeric(value)) {
      setDiameterError("Diameter must be numeric.");
      return false;
    }

    const diameterNum = Number(value);

    if (diameterNum < 0) {
      setDiameterError("Diameter cannot be negative.");
      return false;
    }

    setDiameterError("");
    return true;
  };

  const validateInoculations = (value: string, first = monthsFirst, last = monthsLast) => {
    if (!value.trim()) {
      setInoculationsError("Inoculation count is required.");
      return false;
    }

    if (!isNumeric(value)) {
      setInoculationsError("Inoculation count must be numeric.");
      return false;
    }

    const inocNum = Number(value);

    if (inocNum < 0) {
      setInoculationsError("Inoculation count cannot be negative.");
      return false;
    }

    if (!Number.isInteger(inocNum)) {
      setInoculationsError("Inoculation count must be a whole number.");
      return false;
    }

    if (inocNum < 1 || inocNum > 4) {
      setInoculationsError("Inoculation count must be between 1 and 4.");
      return false;
    }

    if (
      inocNum === 1 &&
      first.trim() !== "" &&
      last.trim() !== "" &&
      isNumeric(first) &&
      isNumeric(last) &&
      Number(first) !== Number(last)
    ) {
      setInoculationsError(
        "If inoculation count is 1, months since first and last inoculation must be the same."
      );
      return false;
    }

    setInoculationsError("");
    return true;
  };

  const validateMonthsFirst = (value: string, last = monthsLast, inoc = inoculations, ageValue = age) => {
    if (!value.trim()) {
      setMonthsFirstError("Months since first inoculation is required.");
      return false;
    }

    if (!isNumeric(value)) {
      setMonthsFirstError("Months since first inoculation must be numeric.");
      return false;
    }

    const firstNum = Number(value);

    if (firstNum < 0) {
      setMonthsFirstError("Months since first inoculation cannot be negative.");
      return false;
    }

    if (ageValue.trim() !== "" && isNumeric(ageValue)) {
      const maxMonths = Number(ageValue) * 12;

      if (firstNum >= maxMonths) {
        setMonthsFirstError(
          "Months since first inoculation must be less than tree age in months."
        );
        return false;
      }
    }

    if (last.trim() !== "" && isNumeric(last)) {
      const lastNum = Number(last);

      if (firstNum < lastNum) {
        setMonthsFirstError(
          "Months since first inoculation must be greater than or equal to months since last inoculation."
        );
        return false;
      }
    }

    if (
      inoc.trim() !== "" &&
      isNumeric(inoc) &&
      Number(inoc) === 1 &&
      last.trim() !== "" &&
      isNumeric(last) &&
      firstNum !== Number(last)
    ) {
      setMonthsFirstError(
        "If inoculation count is 1, months since first and last inoculation must be the same."
      );
      return false;
    }

    setMonthsFirstError("");
    return true;
  };

  const validateMonthsLast = (value: string, first = monthsFirst, inoc = inoculations, ageValue = age) => {
    if (!value.trim()) {
      setMonthsLastError("Months since last inoculation is required.");
      return false;
    }

    if (!isNumeric(value)) {
      setMonthsLastError("Months since last inoculation must be numeric.");
      return false;
    }

    const lastNum = Number(value);

    if (lastNum < 0) {
      setMonthsLastError("Months since last inoculation cannot be negative.");
      return false;
    }

    if (ageValue.trim() !== "" && isNumeric(ageValue)) {
      const maxMonths = Number(ageValue) * 12;

      if (lastNum >= maxMonths) {
        setMonthsLastError(
          "Months since last inoculation must be less than tree age in months."
        );
        return false;
      }
    }

    if (first.trim() !== "" && isNumeric(first)) {
      const firstNum = Number(first);

      if (lastNum > firstNum) {
        setMonthsLastError(
          "Months since last inoculation cannot be greater than months since first inoculation."
        );
        return false;
      }
    }

    if (
      inoc.trim() !== "" &&
      isNumeric(inoc) &&
      Number(inoc) === 1 &&
      first.trim() !== "" &&
      isNumeric(first) &&
      lastNum !== Number(first)
    ) {
      setMonthsLastError(
        "If inoculation count is 1, months since first and last inoculation must be the same."
      );
      return false;
    }

    setMonthsLastError("");
    return true;
  };

  const validateAll = () => {
    const imageValid = validateImage();
    const ageValid = validateAge(age);
    const diameterValid = validateDiameter(diameter);
    const inoculationsValid = validateInoculations(inoculations, monthsFirst, monthsLast);
    const monthsFirstValid = validateMonthsFirst(monthsFirst, monthsLast, inoculations, age);
    const monthsLastValid = validateMonthsLast(monthsLast, monthsFirst, inoculations, age);

    return (
      imageValid &&
      ageValid &&
      diameterValid &&
      inoculationsValid &&
      monthsFirstValid &&
      monthsLastValid
    );
  };

  const handlePredict = async () => {
    try {
      const isValid = validateAll();
      if (!isValid) return;

      setLoading(true);

      const result = await predictStage({
        imageUri: image as string,
        tree_age: age,
        tree_diameter: diameter,
        inoculation_count: inoculations,
        months_since_first: monthsFirst,
        months_since_last: monthsLast,
      });

      setLoading(false);

      if (result.error) {
        Toast.show({
          type: "error",
          text1: "Invalid Image",
          text2: result.error,
          position: "top",
          visibilityTime: 8000,
        });
        return;
   }

      router.push({
        pathname: "/(services)/stage-result",
        params: {
          result: JSON.stringify(result),
          imageUri: image as string,
        },
      });
    } catch (e: any) {
      setLoading(false);
      Toast.show({
            type: "error",
            text1: "Prediction Failed",
            text2: e?.message || "Prediction failed",
            position: "top",
            visibilityTime: 8000,
            });
    }
  };

  return (
    <View className="flex-1 bg-[#E6F2ED]">
      <View className="bg-white h-20 px-6 flex-row items-center justify-center border-b border-gray-200">
        <TouchableOpacity onPress={() => router.back()} className="absolute left-6">
          <Text className="text-3xl text-gray-800">‹</Text>
        </TouchableOpacity>

        <Text className="text-xl font-semibold text-black">
          Resin Induction Stage Classifier
        </Text>
      </View>

      <ScrollView className="flex-1 px-5 pt-5" showsVerticalScrollIndicator={false}>
        <View className="bg-white rounded-3xl p-6 mt-2 shadow-lg border border-green-200">
          <Text className="text-lg font-semibold mb-4 text-gray-900">
            Upload Your Image
          </Text>

          <TouchableOpacity
            onPress={pickImage}
            className={`border-2 border-dashed rounded-2xl p-6 items-center mb-2 ${
              imageError ? "border-red-500" : "border-green-300"
            }`}
          >
            {image ? (
              <Image
                source={{ uri: image }}
                className="w-full h-52 rounded-xl"
                resizeMode="cover"
              />
            ) : (
              <View className="items-center">
                <Text className="text-gray-500 text-center">
                  Select Image (Bark)
                </Text>
                <Text className="text-gray-400 text-center mt-2 text-sm">
                  Use a clear agarwood bark image
                </Text>
              </View>
            )}
          </TouchableOpacity>

          {imageError ? (
            <Text className="text-red-500 mb-4">{imageError}</Text>
          ) : (
            <View className="mb-4" />
          )}

          <View className="h-[2px] w-full bg-green-300 mb-6 rounded" />

          <Text className="text-lg font-semibold mb-4 text-gray-900">
            Tree & Inoculation Details
          </Text>

          <Text className="mb-1 text-gray-700">Tree Age</Text>
          <TextInput
            value={age}
            onChangeText={(text) => {
              setAge(text);
              validateAge(text);
              validateMonthsFirst(monthsFirst, monthsLast, inoculations, text);
              validateMonthsLast(monthsLast, monthsFirst, inoculations, text);
            }}
            placeholder="Enter age"
            keyboardType="numeric"
            className={`border rounded-xl p-3 bg-white ${
              ageError ? "border-red-500" : "border-gray-300"
            }`}
          />
          {ageError ? (
            <Text className="text-red-500 mt-1 mb-4">{ageError}</Text>
          ) : (
            <View className="mb-4" />
          )}

          <Text className="mb-1 text-gray-700">Diameter (cm)</Text>
          <TextInput
            value={diameter}
            onChangeText={(text) => {
              setDiameter(text);
              validateDiameter(text);
            }}
            placeholder="Enter diameter"
            keyboardType="numeric"
            className={`border rounded-xl p-3 bg-white ${
              diameterError ? "border-red-500" : "border-gray-300"
            }`}
          />
          {diameterError ? (
            <Text className="text-red-500 mt-1 mb-4">{diameterError}</Text>
          ) : (
            <View className="mb-4" />
          )}

          <Text className="mb-1 text-gray-700">Inoculations Count</Text>
          <TextInput
            value={inoculations}
            onChangeText={(text) => {
              setInoculations(text);
              validateInoculations(text, monthsFirst, monthsLast);
              validateMonthsFirst(monthsFirst, monthsLast, text, age);
              validateMonthsLast(monthsLast, monthsFirst, text, age);
            }}
            placeholder="Enter count"
            keyboardType="numeric"
            className={`border rounded-xl p-3 bg-white ${
              inoculationsError ? "border-red-500" : "border-gray-300"
            }`}
          />
          {inoculationsError ? (
            <Text className="text-red-500 mt-1 mb-4">{inoculationsError}</Text>
          ) : (
            <View className="mb-4" />
          )}

          <Text className="mb-1 text-gray-700">
            Months Since First Inoculation
          </Text>
          <TextInput
            value={monthsFirst}
            onChangeText={(text) => {
              setMonthsFirst(text);
              validateMonthsFirst(text, monthsLast, inoculations, age);
              validateMonthsLast(monthsLast, text, inoculations, age);
              validateInoculations(inoculations, text, monthsLast);
            }}
            placeholder="Enter months"
            keyboardType="numeric"
            className={`border rounded-xl p-3 bg-white ${
              monthsFirstError ? "border-red-500" : "border-gray-300"
            }`}
          />
          {monthsFirstError ? (
            <Text className="text-red-500 mt-1 mb-4">{monthsFirstError}</Text>
          ) : (
            <View className="mb-4" />
          )}

          <Text className="mb-1 text-gray-700">
            Months Since Last Inoculation
          </Text>
          <TextInput
            value={monthsLast}
            onChangeText={(text) => {
              setMonthsLast(text);
              validateMonthsLast(text, monthsFirst, inoculations, age);
              validateMonthsFirst(monthsFirst, text, inoculations, age);
              validateInoculations(inoculations, monthsFirst, text);
            }}
            placeholder="Enter months"
            keyboardType="numeric"
            className={`border rounded-xl p-3 bg-white ${
              monthsLastError ? "border-red-500" : "border-gray-300"
            }`}
          />
          {monthsLastError ? (
            <Text className="text-red-500 mt-1 mb-4">{monthsLastError}</Text>
          ) : (
            <View className="mb-4" />
          )}
        </View>

        <View className="h-24" />
      </ScrollView>

      <View className="px-5 pb-5 pt-3 bg-[#E6F2ED]">
        <TouchableOpacity
          onPress={handlePredict}
          disabled={loading}
          className={`py-4 rounded-xl shadow-md ${
            loading ? "bg-green-400" : "bg-green-600"
          }`}
        >
          <Text className="text-white text-center font-semibold text-lg">
            {loading ? "Predicting..." : "Predict"}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}