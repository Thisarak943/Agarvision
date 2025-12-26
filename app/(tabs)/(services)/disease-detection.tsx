import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Header from '../../../components/ui/Header';

const ServiceButtons = () => {
  const items = [
    { title: 'Resin Grading', icon: 'flask-outline', route: '/(services)/resin-grading' },
    { title: 'Disease Detection', icon: 'bug-outline', route: '/(services)/disease-detection' },
    { title: 'Market Price', icon: 'trending-up-outline', route: '/(services)/market-price' },
    { title: 'Stage Classification', icon: 'layers-outline', route: '/(services)/stage-classification' },
  ];

  return (
    <View className="bg-white rounded-2xl border border-gray-200 p-4">
      <Text className="text-sm font-semibold text-gray-500 mb-3">Go to another service</Text>
      <View className="flex-row flex-wrap" style={{ gap: 12 }}>
        {items.map((it) => (
          <TouchableOpacity
            key={it.title}
            onPress={() => router.push(it.route as any)}
            className="w-[48%] bg-gray-50 border border-gray-200 rounded-xl p-4"
          >
            <View className="flex-row items-center">
              <View className="w-10 h-10 rounded-full bg-primary items-center justify-center mr-3">
                <Ionicons name={it.icon as any} size={18} color="white" />
              </View>
              <Text className="font-semibold text-gray-900 text-sm flex-1">{it.title}</Text>
            </View>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
};

export default function DiseaseDetection() {
  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      <Header title="Disease Detection" />
      <ScrollView className="flex-1 px-6 py-4" showsVerticalScrollIndicator={false}>
        <View className="bg-white rounded-2xl border border-gray-200 p-5 mb-4">
          <Text className="text-lg font-bold text-gray-900 mb-2">Disease Detection Module</Text>
          <Text className="text-gray-600">
            This page will be connected to the leaf disease model + backend.
          </Text>
        </View>

        <ServiceButtons />
        <View className="h-16" />
      </ScrollView>
    </SafeAreaView>
  );
}
