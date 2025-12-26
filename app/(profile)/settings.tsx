import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Header from '../../components/ui/Header';

export default function Settings() {
  // ✅ CLEANED: removed Addresses & Payment Methods
  const settingsItems = [
    {
      id: 1,
      title: 'Edit Profile',
      subtitle: 'Update your personal information',
      icon: 'person-outline',
      onPress: () => router.push('/(profile)/edit-profile'),
    },
    {
      id: 2,
      title: 'Change Password',
      subtitle: 'Update your account password',
      icon: 'lock-closed-outline',
      onPress: () => router.push('/(profile)/change-password'),
    },
  ];

  // ✅ Dynamic info routes (single info.tsx)
  const otherItems = [
    {
      id: 3,
      title: 'History',
      subtitle: 'View your scan / prediction history',
      icon: 'time-outline',
      onPress: () => router.push('/(profile)/info?type=history'),
    },
    {
      id: 4,
      title: 'Contact',
      subtitle: 'Call or contact support',
      icon: 'call-outline',
      onPress: () => router.push('/(profile)/info?type=contact'),
    },
    {
      id: 5,
      title: 'Email',
      subtitle: 'Send us an email',
      icon: 'mail-outline',
      onPress: () => router.push('/(profile)/info?type=email'),
    },
    {
      id: 6,
      title: 'About Us',
      subtitle: 'About AgarVision',
      icon: 'information-circle-outline',
      onPress: () => router.push('/(profile)/info?type=about'),
    },
  ];

  const renderSettingItem = (item: any) => (
    <TouchableOpacity
      key={item.id}
      onPress={item.onPress}
      className="bg-white px-6 py-4 border-b border-gray-100 active:bg-gray-50"
    >
      <View className="flex-row items-center">
        <View className="w-10 h-10 rounded-full items-center justify-center mr-4">
          <Ionicons name={item.icon} size={25} color="#10B981" />
        </View>

        <View className="flex-1">
          <Text className="text-base font-medium text-gray-900 mb-1">
            {item.title}
          </Text>
          <Text className="text-sm text-gray-500">{item.subtitle}</Text>
        </View>

        <Ionicons name="chevron-forward" size={20} color="#10B981" />
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      <Header title="Settings" />

      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        {/* Account Section */}
        <View className="mt-6">
          <Text className="text-sm font-medium text-gray-500 uppercase tracking-wide px-6 mb-3">
            Account
          </Text>
          <View className="bg-white">
            {settingsItems.map(renderSettingItem)}
          </View>
        </View>

        {/* Info Section */}
        <View className="mt-8">
          <Text className="text-sm font-medium text-gray-500 uppercase tracking-wide px-6 mb-3">
            Info
          </Text>
          <View className="bg-white">
            {otherItems.map(renderSettingItem)}
          </View>
        </View>

        {/* Sign Out */}
        <View className="mt-10 px-6 pb-10">
          <TouchableOpacity
            className="bg-red-50 border border-red-200 rounded-xl py-4 items-center"
            onPress={() => {
              router.replace('/(auth)/welcome');
            }}
          >
            <Text className="text-red-600 font-semibold">Sign Out</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
