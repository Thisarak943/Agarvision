// app/(tabs)/profile.tsx
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useEffect } from 'react';
import { Alert, Linking, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import Animated, {
  BounceIn,
  FadeIn,
  FadeInUp,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function Profile() {
  const opacity = useSharedValue(0);

  useEffect(() => {
    opacity.value = withTiming(1, { duration: 600 });
  }, [opacity]);

  const animatedStyle = useAnimatedStyle(() => {
    return { opacity: opacity.value };
  });

  // ✅ dynamic navigation to ONE file
  const goInfo = (type: 'history' | 'contact' | 'email' | 'about') => {
    router.push(`/(profile)/info?type=${type}`);
  };

  // ✅ optional direct call and email (if you want to use later)
  const handleDirectCall = () => {
    Linking.openURL('tel:+1234567890').catch(() => {
      Alert.alert('Error', 'Unable to make phone call');
    });
  };

  const handleDirectEmail = () => {
    Linking.openURL('mailto:support@agarvision.com').catch(() => {
      Alert.alert('Error', 'Unable to open email app');
    });
  };

  // ✅ TOP 4 ICONS (History / Contact / Email / About Us)
  const topOptions = [
    { title: 'History', icon: 'time-outline', action: () => goInfo('history') },
    { title: 'Contact', icon: 'call-outline', action: () => goInfo('contact') }, // or handleDirectCall
    { title: 'Email', icon: 'mail-outline', action: () => goInfo('email') }, // or handleDirectEmail
    { title: 'About Us', icon: 'information-circle-outline', action: () => goInfo('about') },
  ];

  // ✅ LIST OPTIONS (keep only what you have)
  const profileOptions = [
    { title: 'Help & Support', icon: 'help-circle-outline', action: () => router.push('/(profile)/help-support') },
    { title: 'Terms of Service', icon: 'document-text-outline', action: () => router.push('/(profile)/terms-of-service') },
    { title: 'Settings', icon: 'settings-outline', action: () => router.push('/(profile)/settings') },
  ];

  const handleLogout = () => {
    Alert.alert('Logout', 'Are you sure you want to logout?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Logout', style: 'destructive', onPress: () => router.replace('/(auth)/welcome') },
    ]);
  };

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      {/* Top Header */}
      <View className="px-4 py-3 bg-white border-b border-gray-100">
        <Text className="text-xl font-bold text-center text-gray-900">Profile</Text>
      </View>

      <ScrollView className="flex-1 px-6 py-4" showsVerticalScrollIndicator={false}>
        <Animated.View style={animatedStyle}>
          {/* Profile Header */}
          <Animated.View
            entering={FadeIn.delay(200)}
            className="bg-white rounded-2xl p-6 mb-4 border border-gray-200 items-center"
          >
            <TouchableOpacity className="items-center" onPress={() => router.push('/(profile)/user-profile')}>
              <View className="w-20 h-20 bg-primary rounded-full justify-center items-center mb-4">
                <Ionicons name="person" size={40} color="white" />
              </View>

              <Text className="text-xl font-bold text-gray-900 mb-1">UserName</Text>
              <Text className="text-gray-500 text-sm">Agarwood Member</Text>
            </TouchableOpacity>
          </Animated.View>

          {/* ✅ TOP 4 ICON BUTTONS (with GAP FIX) */}
          <View className="flex-row mb-6" style={{ gap: 12 }}>
            {topOptions.map((option, index) => (
              <Animated.View key={option.title} entering={BounceIn.delay(400 + index * 100)} className="flex-1">
                <TouchableOpacity
                  onPress={option.action}
                  className="rounded-xl p-4 shadow-sm active:scale-95 transform transition-transform min-h-[105px] bg-white border border-gray-200"
                >
                  <View className="items-center justify-center flex-1">
                    <View className="w-14 h-14 bg-primary rounded-2xl justify-center items-center mb-3">
                      <Ionicons name={option.icon as any} size={25} color="white" />
                    </View>
                    <Text className="text-gray-900 font-semibold text-center text-sm leading-tight">
                      {option.title}
                    </Text>
                  </View>
                </TouchableOpacity>
              </Animated.View>
            ))}
          </View>

          {/* Profile Options List */}
          <View className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
            {profileOptions.map((option, index) => (
              <Animated.View key={option.title} entering={FadeInUp.delay(450 + index * 100)}>
                <TouchableOpacity onPress={option.action} className="px-5 py-4 border-b border-gray-100 active:bg-gray-50">
                  <View className="flex-row items-center justify-between">
                    <View className="flex-row items-center">
                      <Ionicons name={option.icon as any} size={20} color="#10B981" />
                      <Text className="ml-4 text-gray-900 font-medium">{option.title}</Text>
                    </View>
                    <Ionicons name="chevron-forward" size={18} color="#9CA3AF" />
                  </View>
                </TouchableOpacity>
              </Animated.View>
            ))}
          </View>

          {/* Logout */}
          <Animated.View entering={FadeIn.delay(1200)} className="mt-10 mb-6">
            <TouchableOpacity
              onPress={handleLogout}
              className="bg-red-50 border border-red-300 rounded-xl px-6 py-4 active:bg-red-100"
            >
              <View className="flex-row items-center justify-center">
                <Ionicons name="log-out-outline" size={20} color="#DC2626" />
                <Text className="text-red-600 font-semibold ml-2">Sign Out</Text>
              </View>
            </TouchableOpacity>
          </Animated.View>
        </Animated.View>
      </ScrollView>
    </SafeAreaView>
  );
}
