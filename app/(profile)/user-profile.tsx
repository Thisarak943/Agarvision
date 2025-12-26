// app/profile/user-profile.tsx
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import Header from "../../components/ui/Header";

export default function UserProfile() {
  // ✅ NEW dynamic navigation (ONE page)
  const goInfo = (type: 'history' | 'contact' | 'email' | 'about') => {
    router.push(`/profile/info?type=${type}`);
  };

  const handleEditProfile = () => {
    router.push('/profile/edit-profile');
  };

  const handleSettings = () => {
    router.push('/profile/settings');
  };

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      <Header title="User Profile" />

      <ScrollView className="flex-1">
        {/* Profile Avatar and Basic Info */}
        <View className="bg-white px-6 py-8 items-center">
          <View className="w-24 h-24 bg-primary rounded-full items-center justify-center border-4 border-primary mb-4">
            <Ionicons name="person" size={36} color="white" />
          </View>

          <Text className="text-2xl font-bold text-gray-900 mb-1">User Name</Text>
          <Text className="text-primary font-medium">AgarVision User</Text>
        </View>

        {/* ✅ QUICK ACTIONS (REPLACED OLD ICONS) */}
        <View className="px-6 mt-6">
          <Text className="text-sm font-medium text-gray-500 uppercase tracking-wide mb-3">
            Quick Actions
          </Text>

          <View className="bg-white rounded-2xl border border-gray-200 p-4">
            <View className="flex-row justify-between">
              {/* History */}
              <TouchableOpacity
                className="items-center flex-1"
                onPress={() => goInfo('history')}
              >
                <View className="w-12 h-12 rounded-full bg-green-50 items-center justify-center border border-green-100">
                  <Ionicons name="time-outline" size={22} color="#10B981" />
                </View>
                <Text className="text-xs text-gray-700 mt-2 font-medium">History</Text>
              </TouchableOpacity>

              {/* Contact */}
              <TouchableOpacity
                className="items-center flex-1"
                onPress={() => goInfo('contact')}
              >
                <View className="w-12 h-12 rounded-full bg-green-50 items-center justify-center border border-green-100">
                  <Ionicons name="call-outline" size={22} color="#10B981" />
                </View>
                <Text className="text-xs text-gray-700 mt-2 font-medium">Contact</Text>
              </TouchableOpacity>

              {/* Email */}
              <TouchableOpacity
                className="items-center flex-1"
                onPress={() => goInfo('email')}
              >
                <View className="w-12 h-12 rounded-full bg-green-50 items-center justify-center border border-green-100">
                  <Ionicons name="mail-outline" size={22} color="#10B981" />
                </View>
                <Text className="text-xs text-gray-700 mt-2 font-medium">Email</Text>
              </TouchableOpacity>

              {/* About */}
              <TouchableOpacity
                className="items-center flex-1"
                onPress={() => goInfo('about')}
              >
                <View className="w-12 h-12 rounded-full bg-green-50 items-center justify-center border border-green-100">
                  <Ionicons name="information-circle-outline" size={22} color="#10B981" />
                </View>
                <Text className="text-xs text-gray-700 mt-2 font-medium">About</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>

        {/* ✅ MAIN BUTTONS */}
        <View className="px-6 mt-6 mb-10">
          <TouchableOpacity
            onPress={handleEditProfile}
            className="bg-white rounded-xl p-4 mb-3 border border-gray-200 active:bg-gray-50"
          >
            <View className="flex-row items-center justify-between">
              <View className="flex-row items-center">
                <Ionicons name="person-outline" size={20} color="#10B981" />
                <Text className="text-gray-900 font-medium ml-3">Edit Profile</Text>
              </View>
              <Ionicons name="chevron-forward" size={16} color="#10B981" />
            </View>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={handleSettings}
            className="bg-white rounded-xl p-4 border border-gray-200 active:bg-gray-50"
          >
            <View className="flex-row items-center justify-between">
              <View className="flex-row items-center">
                <Ionicons name="settings-outline" size={20} color="#10B981" />
                <Text className="text-gray-900 font-medium ml-3">Settings</Text>
              </View>
              <Ionicons name="chevron-forward" size={16} color="#10B981" />
            </View>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
