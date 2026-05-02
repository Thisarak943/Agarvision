import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import Header from "../../components/ui/Header";

export default function ExportReadinessResult() {
  const router = useRouter();
  const params = useLocalSearchParams();

  const parsed = params?.result ? JSON.parse(String(params.result)) : {};

  const readiness = parsed.export_readiness ?? "-";
  const reason = parsed.reason ?? parsed.primary_reason ?? "-";
  const tip = parsed.improvement_tip ?? "-";
  const readinessStyle = getReadinessStyle(readiness);

  return (
    <SafeAreaView className="flex-1 bg-emerald-50">
      <Header title="Export Readiness" />

      <ScrollView
        className="flex-1"
        contentContainerStyle={{ paddingHorizontal: 24, paddingVertical: 16 }}
        showsVerticalScrollIndicator={false}
      >
        <View className="bg-white rounded-2xl border border-gray-200 p-5">
          <Text className="text-lg font-bold text-gray-900 text-center mb-4">
            Analyzed Insights
          </Text>

          <View
            className={`rounded-2xl px-5 py-5 mt-2 mb-4 border ${readinessStyle.cardClass}`}
          >
            <Text className={`text-center text-sm font-semibold ${readinessStyle.labelClass}`}>
              Export Readiness
            </Text>
            <Text className={`text-center text-3xl font-extrabold mt-2 ${readinessStyle.valueClass}`}>
              {formatReadiness(readiness)}
            </Text>
            <Text className={`text-center text-sm mt-2 leading-5 ${readinessStyle.labelClass}`}>
              {readinessStyle.caption}
            </Text>
          </View>

          <InsightCard
            title="Reason"
            subtitle="Why the model reached this decision"
            text={reason}
            tone="emerald"
          />

          <InsightCard
            title="Improvement Tip"
            subtitle="Recommended actions for better export readiness"
            text={tip}
            tone="sky"
          />
        </View>

        <TouchableOpacity
          onPress={() => router.push("/(tabs)")}
          className="bg-primary rounded-xl py-4 items-center mt-6"
        >
          <Text className="text-white font-semibold">Back to Home</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

function InsightCard({
  title,
  subtitle,
  text,
  tone,
}: {
  title: string;
  subtitle: string;
  text: string;
  tone: "emerald" | "sky";
}) {
  const items = splitInsightText(text);
  const toneClass =
    tone === "emerald"
      ? {
          wrap: "bg-emerald-50 border-emerald-200",
          pill: "bg-emerald-100",
          title: "text-emerald-900",
          dot: "bg-emerald-600",
        }
      : {
          wrap: "bg-sky-50 border-sky-200",
          pill: "bg-sky-100",
          title: "text-sky-900",
          dot: "bg-sky-600",
        };

  return (
    <View className={`rounded-2xl border px-4 py-4 mt-4 ${toneClass.wrap}`}>
      <View className={`self-start rounded-full px-4 py-2 ${toneClass.pill}`}>
        <Text className={`font-bold ${toneClass.title}`}>{title}</Text>
      </View>

      <Text className="text-gray-600 text-sm mt-2 mb-3">{subtitle}</Text>

      <View style={{ gap: 10 }}>
        {items.map((item, index) => (
          <View key={`${title}-${index}`} className="flex-row items-start">
            <View className={`w-2 h-2 rounded-full mt-2 mr-3 ${toneClass.dot}`} />
            <Text className="text-gray-900 font-semibold leading-6 flex-1">
              {item}
            </Text>
          </View>
        ))}
      </View>
    </View>
  );
}

function splitInsightText(text: string) {
  const cleaned = String(text ?? "").trim();
  if (!cleaned || cleaned === "-") return ["No details available."];

  return cleaned
    .split("\n")
    .map((line) => line.replace(/^\s*[-•]\s*/, "").trim())
    .filter(Boolean);
}

function formatReadiness(value: string) {
  return String(value)
    .split(" ")
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1).toLowerCase())
    .join(" ");
}

function getReadinessStyle(value: string) {
  const normalized = String(value).trim().toLowerCase();

  if (normalized === "ready") {
    return {
      cardClass: "bg-emerald-50 border-emerald-200",
      labelClass: "text-emerald-700",
      valueClass: "text-emerald-800",
      caption: "This sample meets the expected export readiness conditions.",
    };
  }

  if (normalized === "conditionally ready") {
    return {
      cardClass: "bg-amber-50 border-amber-200",
      labelClass: "text-amber-700",
      valueClass: "text-amber-800",
      caption: "This sample needs minor improvements before full approval.",
    };
  }

  if (normalized === "not ready") {
    return {
      cardClass: "bg-red-50 border-red-200",
      labelClass: "text-red-700",
      valueClass: "text-red-800",
      caption: "This sample needs correction before export readiness.",
    };
  }

  return {
    cardClass: "bg-gray-50 border-gray-200",
    labelClass: "text-gray-600",
    valueClass: "text-gray-900",
    caption: "Review the model output and recommendations below.",
  };
}
