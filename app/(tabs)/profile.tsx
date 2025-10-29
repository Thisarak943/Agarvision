// app/(tabs)/profile.tsx
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useUser } from '../../contexts/UserContext';
import { useEffect } from 'react';
import { Alert, Linking, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import Animated, { BounceIn, FadeIn, FadeInUp, useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function Profile() {
  const opacity = useSharedValue(0);

  useEffect(() => {
    opacity.value = withTiming(1, { duration: 600 });
  }, []);

  const animatedStyle = useAnimatedStyle(() => {
    return { opacity: opacity.value };
  });

  const handleDirectCall = () => {
    const phoneNumber = 'tel:+1234567890'; // Replace with your actual phone number
    Linking.openURL(phoneNumber).catch((err) => {
      Alert.alert('Error', 'Unable to make phone call');
    });
  };

  const profileOptions = [
    {
      title: 'History',
      icon: 'time-outline',
      action: () => router.push('/(profile)/order-history')
    },
    {
      title: 'Coupons',
      icon: 'pricetag-outline',
      action: () => router.push('/(profile)/my-coupons')
    },
    {
      title: 'Contact',
      icon: 'call-outline',
      action: handleDirectCall
    },
    {
      title: 'Report',
      icon: 'warning-outline',
      action: () => router.push('/(profile)/report')
    },
    {
      title: 'Info Center',
      icon: 'information-circle-outline',
      action: () => router.push('/(profile)/info-center')
    },
    {
      title: 'Help & Support',
      icon: 'help-circle-outline',
      action: () => router.push('/(profile)/help-support')
    },
        {
      title: 'Terms of Service',
      icon: 'document-text-outline',
      action: () => router.push('/(profile)/terms-of-service')
    },
    {
      title: 'Settings',
      icon: 'settings-outline',
      action: () => router.push('/(profile)/settings')
    }
  ];

  const handleLogout = () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Logout',
          style: 'destructive',
          onPress: () => router.replace('/(auth)/welcome')
        }
      ]
    );
  };

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      <View className="px-4 py-3 bg-white border-b border-gray-100">
        <Text className="text-xl font-bold text-center text-gray-900">
          Profile
        </Text>
      </View>

      <ScrollView className="flex-1 px-6 py-4">
        <Animated.View style={animatedStyle}>
          {/* Profile Header */}
          <Animated.View
            entering={FadeIn.delay(200)}
            className="bg-white rounded-2xl p-6 mb-4 border border-gray-200 items-center"
          >
            <TouchableOpacity className='items-center' onPress={() => router.push('/(profile)/user-profile')}>
              <View className="w-20 h-20 bg-primary rounded-full justify-center items-center mb-4">
                <Ionicons name="person" size={40} color="white" />
              </View>
              <Text className="text-xl font-bold text-gray-900 mb-1">UserName</Text>
              <Text className="text-gray-600"></Text>
            </TouchableOpacity>

          </Animated.View>

          <View className="flex-row justify-between space-x-3 mb-2">
            {profileOptions.slice(0, 4).map((option, index) => (
              <Animated.View
                key={option.title}
                entering={BounceIn.delay(400 + index * 100)}
                className="flex-1"
              >
                <TouchableOpacity
                  onPress={option.action}
                  className="bg-gradient-to-br from-primary to-primary/80 rounded-xl p-4 shadow-lg active:scale-95 transform transition-transform min-h-[100px]"
                >
                  <View className="items-center justify-center flex-1">
                    <View className="w-14 h-14 bg-primary rounded-2xl justify-center items-center mb-3">
                      <Ionicons name={option.icon as any} size={25} color="white" />
                    </View>
                    <Text className="text-primary font-semibold text-center text-sm leading-tight">
                      {option.title}
                    </Text>
                  </View>
                </TouchableOpacity>
              </Animated.View>
            ))}
          </View>

          {/* Profile Options */}
          <View className="space-y-3">
            {profileOptions.slice(4).map((option, index) => (
              <Animated.View
                key={option.title}
                entering={FadeInUp.delay(400 + index * 100)}
              >
                <TouchableOpacity
                  onPress={option.action}
                  className="p-4 border-b border-gray-300"
                >
                  <View className="flex-row items-center justify-between">
                    <View className="flex-row items-center">
                      <Ionicons name={option.icon as any} size={20} color="#10B981" />
                      <Text className="ml-4 text-gray-900 font-medium">{option.title}</Text>
                    </View>
                    <Ionicons name="chevron-forward" size={20} color="#9CA3AF" />
                  </View>
                </TouchableOpacity>
              </Animated.View>
            ))}
          </View>

          <Animated.View
            entering={FadeIn.delay(1200)}
            className="mt-10 mb-6"
          >
            <TouchableOpacity
              onPress={() => { handleLogout(); }}
              className="bg-red-50 border border-red-400 rounded-lg px-6 py-4 active:bg-red-100"
            >
              <View className="flex-row items-center justify-center">
                <Ionicons name="log-out-outline" size={20} color="#DC2626" />
                <Text className="text-red-600 font-medium ml-2">
                  Sign Out
                </Text>
              </View>
            </TouchableOpacity>
          </Animated.View>
        </Animated.View>
      </ScrollView>
    </SafeAreaView>
  );
}