import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Header from '../../components/ui/Header';

export default function Settings() {
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

  const otherItems = [
    {
      id: 3,
      title: 'Notifications',
      subtitle: 'Manage notification preferences',
      icon: 'notifications-outline',
      onPress: () => router.push('/(profile)/notification-settings'),
    },
    {
      id: 4,
      title: 'Privacy & Security',
      subtitle: 'Privacy settings and security options',
      icon: 'shield-outline',
      onPress: () => router.push('/(profile)/privacy-security'),
    },
    {
      id: 5,
      title: 'Info Center',
      subtitle: 'Guides, documents, and information',
      icon: 'information-circle-outline',
      onPress: () => router.push('/(profile)/info-center'),
    },
    {
      id: 6,
      title: 'Help & Support',
      subtitle: 'FAQs and contact support',
      icon: 'help-circle-outline',
      onPress: () => router.push('/(profile)/help-support'),
    },
    {
      id: 7,
      title: 'Terms of Service',
      subtitle: 'Read terms and conditions',
      icon: 'document-text-outline',
      onPress: () => router.push('/(profile)/terms-of-service'),
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
          <Text className="text-base font-medium text-gray-900 mb-1">{item.title}</Text>
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
        <View className="mt-6">
          <Text className="text-sm font-medium text-gray-500 uppercase tracking-wide px-6 mb-3">
            Account
          </Text>
          <View className="bg-white">{settingsItems.map(renderSettingItem)}</View>
        </View>

        <View className="mt-8">
          <Text className="text-sm font-medium text-gray-500 uppercase tracking-wide px-6 mb-3">
            Other
          </Text>
          <View className="bg-white">{otherItems.map(renderSettingItem)}</View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
