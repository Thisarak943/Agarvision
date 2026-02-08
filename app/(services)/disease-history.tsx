import { Ionicons } from "@expo/vector-icons";
import { useEffect, useState } from "react";
import { ActivityIndicator, ScrollView, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Header from "../../components/ui/Header";
import { deleteDiseaseHistory, getDiseaseHistory } from "../../services/diseaseHistoryApi";

export default function DiseaseHistory() {
  const [loading, setLoading] = useState(true);
  const [items, setItems] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);

  const load = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await getDiseaseHistory();
      setItems(res?.items || []);
    } catch (e: any) {
      setError(e?.message || "Failed to load history");
    } finally {
      setLoading(false);
    }
  };

  const onDelete = async (id: string) => {
    try {
      await deleteDiseaseHistory(id);
      setItems((prev) => prev.filter((x) => x._id !== id));
    } catch {
      // ignore
    }
  };

  useEffect(() => {
    load();
  }, []);

  return (
    <SafeAreaView className="flex-1 bg-green-100">
      <Header title="Disease Detection" />

      <ScrollView className="flex-1 px-6 py-6" showsVerticalScrollIndicator={false}>
        <View className="bg-white rounded-2xl border-2 border-green-200 p-5">
          <Text className="text-lg font-extrabold text-gray-900">Prediction History</Text>
          <Text className="text-gray-600 mt-1">
            Your recent disease predictions are saved here.
          </Text>
        </View>

        {loading && (
          <View className="py-10 items-center">
            <ActivityIndicator size="large" color="#16a34a" />
            <Text className="text-gray-600 mt-3">Loading...</Text>
          </View>
        )}

        {!loading && error && (
          <View className="mt-4 bg-white rounded-2xl border border-red-200 p-5">
            <Text className="text-red-700 font-semibold">Error</Text>
            <Text className="text-gray-700 mt-1">{error}</Text>
            <TouchableOpacity onPress={load} className="bg-primary rounded-xl py-3 mt-4">
              <Text className="text-white text-center font-semibold">Retry</Text>
            </TouchableOpacity>
          </View>
        )}

        {!loading && !error && items.length === 0 && (
          <View className="mt-4 bg-white rounded-2xl border border-gray-200 p-5">
            <Text className="text-gray-700">
              No history yet. Run a prediction and it will appear here.
            </Text>
          </View>
        )}

        {!loading && !error && items.map((it) => {
          const pct = Math.round((Number(it.confidence || 0)) * 100);
          return (
            <View
              key={it._id}
              className="mt-4 bg-white rounded-2xl border border-gray-200 p-5"
            >
              <View className="flex-row items-center justify-between">
                <View className="flex-row items-center">
                  <View className="w-10 h-10 rounded-xl bg-green-50 border border-green-200 items-center justify-center">
                    <Ionicons name="leaf-outline" size={18} color="#16a34a" />
                  </View>
                  <View className="ml-3">
                    <Text className="font-semibold text-gray-900">{it.predicted_disease}</Text>
                    <Text className="text-xs text-gray-500">Confidence: {pct}%</Text>
                  </View>
                </View>

                <TouchableOpacity onPress={() => onDelete(it._id)} className="p-2">
                  <Ionicons name="trash-outline" size={18} color="#b91c1c" />
                </TouchableOpacity>
              </View>

              <View className="h-[1px] bg-gray-200 my-4" />

              <Text className="text-sm font-semibold text-gray-800 mb-2">Top Remedies</Text>
              {Array.isArray(it.remedies) && it.remedies.length > 0 ? (
                it.remedies.slice(0, 3).map((r: string, idx: number) => (
                  <Text key={idx} className="text-gray-700 mt-1">• {r}</Text>
                ))
              ) : (
                <Text className="text-gray-500">No remedies available.</Text>
              )}
            </View>
          );
        })}

        <View className="h-10" />
      </ScrollView>
    </SafeAreaView>
  );
}
