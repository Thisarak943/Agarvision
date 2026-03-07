import React, { useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  Alert,
  ScrollView,
} from "react-native";
import { useRouter } from "expo-router";
import Header from "../../components/ui/Header";
import { checkExportReadiness } from "../../services/exportReadinessApi";

export default function ExportReadinessForm() {
  const router = useRouter();

  const [chipWeight, setChipWeight] = useState("02");
  const [dryingMethod, setDryingMethod] = useState("Sun");
  const [dryingTime, setDryingTime] = useState("12");
  const [storageType, setStorageType] = useState("Open");
  const [storageDuration, setStorageDuration] = useState("5");
  const [contamination, setContamination] = useState("Low");

  const clearAll = () => {
    setChipWeight("");
    setDryingMethod("Sun");
    setDryingTime("");
    setStorageType("Open");
    setStorageDuration("");
    setContamination("Low");
  };

  const onCheck = async () => {
    try {
      const payload = {
        Chip_Sample_Weight_g: Number(chipWeight),
        Drying_Time_Days: Number(dryingTime),
        Drying_Method: dryingMethod,
        Storage_Type: storageType,
        Storage_Duration_Weeks: Number(storageDuration),
        Contamination_Level: contamination,
      };

      const result = await checkExportReadiness(payload);

      router.push({
        pathname: "/(services)/export-readiness-result",
        params: { result: JSON.stringify(result) },
      });
    } catch (e: any) {
      Alert.alert("Error", e?.message ?? "Prediction failed");
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      <Header title="Export Readiness" />

      <ScrollView
        contentContainerStyle={{ paddingHorizontal: 20, paddingVertical: 16 }}
        showsVerticalScrollIndicator={false}
      >
        <View className="bg-white rounded-2xl border border-gray-200 p-5">
          <Text className="text-lg font-bold text-gray-900 text-center">
            Export Readiness
          </Text>

          <View className="bg-gray-900 rounded-xl py-3 px-3 mt-3">
            <Text className="text-white text-center">
              Fill below fields to continue
            </Text>
          </View>

          <View className="mt-5" style={{ gap: 14 }}>
            <Row
              label="Chip sample weight"
              value={chipWeight}
              suffix="g"
              onChange={setChipWeight}
              keyboardType="numeric"
            />

            <Row
              label="Drying method"
              value={dryingMethod}
              onChange={setDryingMethod}
            />

            <Row
              label="Drying time (days)"
              value={dryingTime}
              onChange={setDryingTime}
              keyboardType="numeric"
            />

            <Row
              label="Storage type"
              value={storageType}
              onChange={setStorageType}
            />

            <Row
              label="Storage duration (weeks)"
              value={storageDuration}
              onChange={setStorageDuration}
              keyboardType="numeric"
            />

            <Row
              label="Contamination level"
              value={contamination}
              onChange={setContamination}
            />
          </View>

          <TouchableOpacity
            onPress={clearAll}
            className="bg-primary rounded-xl py-3 items-center mt-6 self-center px-10"
          >
            <Text className="text-white font-semibold">Clear</Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity
          onPress={onCheck}
          className="border-2 border-primary rounded-xl py-4 items-center mt-6"
        >
          <Text className="text-primary font-semibold">Check</Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => router.push("/(tabs)")}
          className="bg-primary rounded-xl py-4 items-center mt-4 mb-4"
        >
          <Text className="text-white font-semibold">Back to Home</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

function Row({
  label,
  value,
  onChange,
  suffix,
  keyboardType = "default",
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  suffix?: string;
  keyboardType?: "default" | "numeric";
}) {
  return (
    <View>
      <Text className="text-gray-800 mb-2 font-medium">{label}</Text>

      <View className="w-full border border-gray-300 rounded-lg px-3 py-3 flex-row items-center">
        <TextInput
          value={value}
          onChangeText={onChange}
          className="flex-1 text-gray-900"
          keyboardType={keyboardType}
          placeholder={`Enter ${label.toLowerCase()}`}
          placeholderTextColor="#9CA3AF"
        />
        {!!suffix && <Text className="text-gray-600 ml-2">{suffix}</Text>}
      </View>
    </View>
  );
}