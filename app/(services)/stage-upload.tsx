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

  const validateMonthsFirst = (value: string, last = monthsLast, inoc = inoculations) => {
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

  const validateMonthsLast = (value: string, first = monthsFirst, inoc = inoculations) => {
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
    const monthsFirstValid = validateMonthsFirst(monthsFirst, monthsLast, inoculations);
    const monthsLastValid = validateMonthsLast(monthsLast, monthsFirst, inoculations);

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
        alert(result.error);
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
      alert(e?.message || "Prediction failed");
    }
  };

  return (
    <View className="flex-1 bg-[#E6F2ED] px-5 pt-4 justify-between">
      <View className="mt-2 mb-3">
        <Text className="text-center text-xl font-semibold">
          Resin Induction Stage Classifier
        </Text>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        <View className="bg-white rounded-2xl p-6 mt-2 shadow-md">
          <Text className="text-lg font-semibold mb-4">Upload Your Image</Text>

          <TouchableOpacity
            onPress={pickImage}
            className={`border-2 border-dashed rounded-xl p-6 items-center mb-2 ${
              imageError ? "border-red-500" : "border-gray-400"
            }`}
          >
            {image ? (
              <Image source={{ uri: image }} className="w-40 h-40 rounded-lg" />
            ) : (
              <Text className="text-gray-500">Select Image (Bark)</Text>
            )}
          </TouchableOpacity>

          {imageError ? (
            <Text className="text-red-500 mb-4">{imageError}</Text>
          ) : (
            <View className="mb-4" />
          )}

          <Text className="mb-1">Tree Age</Text>
          <TextInput
            value={age}
            onChangeText={(text) => {
              setAge(text);
              validateAge(text);
            }}
            placeholder="Enter age"
            keyboardType="numeric"
            className={`border rounded-lg p-3 bg-white ${
              ageError ? "border-red-500" : "border-gray-300"
            }`}
          />
          {ageError ? (
            <Text className="text-red-500 mt-1 mb-4">{ageError}</Text>
          ) : (
            <View className="mb-4" />
          )}

          <Text className="mb-1">Diameter (cm)</Text>
          <TextInput
            value={diameter}
            onChangeText={(text) => {
              setDiameter(text);
              validateDiameter(text);
            }}
            placeholder="Enter diameter"
            keyboardType="numeric"
            className={`border rounded-lg p-3 bg-white ${
              diameterError ? "border-red-500" : "border-gray-300"
            }`}
          />
          {diameterError ? (
            <Text className="text-red-500 mt-1 mb-4">{diameterError}</Text>
          ) : (
            <View className="mb-4" />
          )}

          <Text className="mb-1">Inoculations Count</Text>
          <TextInput
            value={inoculations}
            onChangeText={(text) => {
              setInoculations(text);
              validateInoculations(text, monthsFirst, monthsLast);
              validateMonthsFirst(monthsFirst, monthsLast, text);
              validateMonthsLast(monthsLast, monthsFirst, text);
            }}
            placeholder="Enter count"
            keyboardType="numeric"
            className={`border rounded-lg p-3 bg-white ${
              inoculationsError ? "border-red-500" : "border-gray-300"
            }`}
          />
          {inoculationsError ? (
            <Text className="text-red-500 mt-1 mb-4">{inoculationsError}</Text>
          ) : (
            <View className="mb-4" />
          )}

          <Text className="mb-1">Months Since First Inoculation</Text>
          <TextInput
            value={monthsFirst}
            onChangeText={(text) => {
              setMonthsFirst(text);
              validateMonthsFirst(text, monthsLast, inoculations);
              validateMonthsLast(monthsLast, text, inoculations);
              validateInoculations(inoculations, text, monthsLast);
            }}
            placeholder="Enter months"
            keyboardType="numeric"
            className={`border rounded-lg p-3 bg-white ${
              monthsFirstError ? "border-red-500" : "border-gray-300"
            }`}
          />
          {monthsFirstError ? (
            <Text className="text-red-500 mt-1 mb-4">{monthsFirstError}</Text>
          ) : (
            <View className="mb-4" />
          )}

          <Text className="mb-1">Months Since Last Inoculation</Text>
          <TextInput
            value={monthsLast}
            onChangeText={(text) => {
              setMonthsLast(text);
              validateMonthsLast(text, monthsFirst, inoculations);
              validateMonthsFirst(monthsFirst, text, inoculations);
              validateInoculations(inoculations, monthsFirst, text);
            }}
            placeholder="Enter months"
            keyboardType="numeric"
            className={`border rounded-lg p-3 bg-white ${
              monthsLastError ? "border-red-500" : "border-gray-300"
            }`}
          />
          {monthsLastError ? (
            <Text className="text-red-500 mt-1 mb-4">{monthsLastError}</Text>
          ) : (
            <View className="mb-4" />
          )}
        </View>
      </ScrollView>

      <TouchableOpacity
        onPress={handlePredict}
        disabled={loading}
        className={`py-4 rounded-xl mb-6 mt-4 ${loading ? "bg-green-400" : "bg-green-600"}`}
      >
        <Text className="text-white text-center font-semibold text-lg">
          {loading ? "Predicting..." : "Predict"}
        </Text>
      </TouchableOpacity>
    </View>
  );
}