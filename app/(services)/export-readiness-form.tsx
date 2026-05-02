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

const DRYING_METHODS = [
  { label: "Machine", value: "machine" },
  { label: "Sun", value: "sun" },
];

const STORAGE_TYPES = [
  { label: "Open", value: "open" },
  { label: "Sealed", value: "sealed" },
];

const CONTAMINATION_LEVELS = [
  { label: "None", value: "none" },
  { label: "Low", value: "low" },
  { label: "High", value: "high" },
];

type FormErrors = {
  chipWeight?: string;
  dryingMethod?: string;
  dryingTime?: string;
  storageType?: string;
  storageDurationDays?: string;
  contamination?: string;
};

export default function ExportReadinessForm() {
  const router = useRouter();

  const [chipWeight, setChipWeight] = useState("");
  const [dryingMethod, setDryingMethod] = useState("");
  const [dryingTime, setDryingTime] = useState("");
  const [storageType, setStorageType] = useState("");
  const [storageDurationDays, setStorageDurationDays] = useState("");
  const [contamination, setContamination] = useState("");
  const [errors, setErrors] = useState<FormErrors>({});

  const clearError = (field: keyof FormErrors) => {
    setErrors((current) => ({ ...current, [field]: undefined }));
  };

  const clearAll = () => {
    setChipWeight("");
    setDryingMethod("");
    setDryingTime("");
    setStorageType("");
    setStorageDurationDays("");
    setContamination("");
    setErrors({});
  };

  const validateForm = () => {
    const nextErrors: FormErrors = {};

    if (!chipWeight.trim() || isNaN(Number(chipWeight)) || Number(chipWeight) <= 0) {
      nextErrors.chipWeight = "Enter a valid chip sample weight greater than 0.";
    }

    if (!dryingTime.trim() || isNaN(Number(dryingTime)) || Number(dryingTime) <= 0) {
      nextErrors.dryingTime = "Enter a valid drying time greater than 0 days.";
    }

    if (
      !storageDurationDays.trim() ||
      isNaN(Number(storageDurationDays)) ||
      Number(storageDurationDays) < 0
    ) {
      nextErrors.storageDurationDays = "Enter a valid storage duration of 0 days or more.";
    }

    if (!dryingMethod) {
      nextErrors.dryingMethod = "Select a drying method.";
    }

    if (!storageType) {
      nextErrors.storageType = "Select a storage type.";
    }

    if (!contamination) {
      nextErrors.contamination = "Select a contamination level.";
    }

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const onCheck = async () => {
    if (!validateForm()) return;

    try {
      const payload = {
        Chip_Sample_Weight_g: Number(chipWeight),
        Drying_Time_Days: Number(dryingTime),
        Drying_Method: dryingMethod,
        Storage_Type: storageType,
        Storage_Duration_Days: Number(storageDurationDays),
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
    <SafeAreaView className="flex-1 bg-emerald-50">
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
              onChange={(value) => {
                setChipWeight(value);
                clearError("chipWeight");
              }}
              keyboardType="numeric"
              error={errors.chipWeight}
            />

            <ChoiceRow
              label="Drying method"
              value={dryingMethod}
              options={DRYING_METHODS}
              onChange={(value) => {
                setDryingMethod(value);
                clearError("dryingMethod");
              }}
              error={errors.dryingMethod}
            />

            <Row
              label="Drying time"
              value={dryingTime}
              suffix="days"
              onChange={(value) => {
                setDryingTime(value);
                clearError("dryingTime");
              }}
              keyboardType="numeric"
              error={errors.dryingTime}
            />

            <ChoiceRow
              label="Storage type"
              value={storageType}
              options={STORAGE_TYPES}
              onChange={(value) => {
                setStorageType(value);
                clearError("storageType");
              }}
              error={errors.storageType}
            />

            <Row
              label="Storage duration"
              value={storageDurationDays}
              suffix="days"
              onChange={(value) => {
                setStorageDurationDays(value);
                clearError("storageDurationDays");
              }}
              keyboardType="numeric"
              error={errors.storageDurationDays}
            />

            <ChoiceRow
              label="Contamination level"
              value={contamination}
              options={CONTAMINATION_LEVELS}
              onChange={(value) => {
                setContamination(value);
                clearError("contamination");
              }}
              error={errors.contamination}
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
  error,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  suffix?: string;
  keyboardType?: "default" | "numeric";
  error?: string;
}) {
  return (
    <View>
      <Text className="text-gray-800 mb-2 font-medium">{label}</Text>

      <View
        className={`w-full border rounded-lg px-3 py-3 flex-row items-center ${
          error ? "border-red-400 bg-red-50" : "border-gray-300"
        }`}
      >
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
      {error ? <Text className="text-red-600 text-xs mt-1">{error}</Text> : null}
    </View>
  );
}

function ChoiceRow({
  label,
  value,
  options,
  onChange,
  error,
}: {
  label: string;
  value: string;
  options: { label: string; value: string }[];
  onChange: (v: string) => void;
  error?: string;
}) {
  return (
    <View>
      <Text className="text-gray-800 mb-2 font-medium">{label}</Text>
      <View className="flex-row flex-wrap" style={{ gap: 8 }}>
        {options.map((option) => {
          const active = option.value === value;
          return (
            <TouchableOpacity
              key={option.value}
              onPress={() => onChange(option.value)}
              className={`px-4 py-3 rounded-lg border ${
                active
                  ? "bg-primary border-primary"
                  : error
                    ? "bg-red-50 border-red-300"
                    : "bg-white border-gray-300"
              }`}
            >
              <Text className={active ? "text-white font-semibold" : "text-gray-800"}>
                {option.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
      {error ? <Text className="text-red-600 text-xs mt-1">{error}</Text> : null}
    </View>
  );
}
