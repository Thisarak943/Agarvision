// components/SettingsSlideView.tsx
import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Modal,
  Dimensions,
  Switch,
  Alert
} from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  SlideInRight,
  FadeIn,
  FadeInDown
} from 'react-native-reanimated';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

interface SettingToggle {
  id: string;
  title: string;
  description?: string;
  value: boolean;
}

interface SettingsSlideViewProps {
  visible: boolean;
  onClose: () => void;
  onNavigate?: (screen: string) => void;
  onLogout?: () => void;
  userInfo?: {
    name: string;
    email: string;
    avatar?: string;
  };
}

export default function SettingsSlideView({
  visible,
  onClose,
  onNavigate,
  onLogout,
  userInfo = { name: 'John Doe', email: 'john@example.com' }
}: SettingsSlideViewProps) {
  const slideAnim = useSharedValue(SCREEN_WIDTH);
  const backdropOpacity = useSharedValue(0);
  const insets = useSafeAreaInsets();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isClosing, setIsClosing] = useState(false);

  const [notificationSettings, setNotificationSettings] = useState<SettingToggle[]>([
    {
      id: 'push',
      title: 'Push Notifications',
      description: 'Receive push notifications on your device',
      value: true
    },
    {
      id: 'email',
      title: 'Email Notifications',
      description: 'Get updates via email',
      value: false
    },
    {
      id: 'order',
      title: 'Order Updates',
      description: 'Notifications about order status changes',
      value: true
    },
    {
      id: 'promotional',
      title: 'Promotional Offers',
      description: 'Special deals and discount notifications',
      value: false
    },
    {
      id: 'security',
      title: 'Security Alerts',
      description: 'Important account security notifications',
      value: true
    }
  ]);

  const [privacySettings, setPrivacySettings] = useState<SettingToggle[]>([
    {
      id: 'analytics',
      title: 'Analytics & Data Collection',
      description: 'Help improve our services by sharing usage data',
      value: false
    },
    {
      id: 'personalization',
      title: 'Personalized Experience',
      description: 'Use your data to personalize your experience',
      value: true
    },
    {
      id: 'location',
      title: 'Location Services',
      description: 'Allow location access for better recommendations',
      value: false
    },
    {
      id: 'marketing',
      title: 'Marketing Communications',
      description: 'Receive marketing emails and messages',
      value: false
    }
  ]);

  useEffect(() => {
    if (visible && !isClosing) {
      setIsModalVisible(true);
      backdropOpacity.value = withTiming(1, { duration: 300 });
      slideAnim.value = withTiming(0, { 
        duration: 400 
      });
    } else if (!visible && !isClosing) {
      setIsClosing(true);
      backdropOpacity.value = withTiming(0, { duration: 300 });
      slideAnim.value = withTiming(SCREEN_WIDTH, { 
        duration: 300 
      });
      
      // Hide modal after animation completes
      setTimeout(() => {
        setIsModalVisible(false);
        setIsClosing(false);
      }, 350);
    }
  }, [visible, isClosing]);

  const handleClose = () => {
    if (!isClosing) {
      onClose();
    }
  };

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: slideAnim.value }]
  }));

  const backdropStyle = useAnimatedStyle(() => ({
    opacity: backdropOpacity.value
  }));

  const handleToggleChange = (
    settingId: string, 
    value: boolean, 
    settingsType: 'notification' | 'privacy'
  ) => {
    if (settingsType === 'notification') {
      setNotificationSettings(prev => 
        prev.map(setting => 
          setting.id === settingId ? { ...setting, value } : setting
        )
      );
    } else {
      setPrivacySettings(prev => 
        prev.map(setting => 
          setting.id === settingId ? { ...setting, value } : setting
        )
      );
    }
  };

  const handleLogout = () => {
    Alert.alert(
      'Sign Out',
      'Are you sure you want to sign out of your account?',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Sign Out', 
          style: 'destructive',
          onPress: () => {
            onLogout?.();
            handleClose();
          }
        }
      ]
    );
  };

  const handleDeleteAccount = () => {
    Alert.alert(
      'Delete Account',
      'This action cannot be undone. All your data will be permanently deleted.',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Delete Account', 
          style: 'destructive',
          onPress: () => {
            Alert.alert('Account Deletion', 'Please contact support to delete your account.');
          }
        }
      ]
    );
  };

  const SettingItem = ({ 
    icon, 
    title, 
    subtitle, 
    onPress, 
    rightElement,
    showChevron = true,
    textColor = 'text-gray-900',
    iconColor = '#6B7280'
  }: {
    icon: string;
    title: string;
    subtitle?: string;
    onPress?: () => void;
    rightElement?: React.ReactNode;
    showChevron?: boolean;
    textColor?: string;
    iconColor?: string;
  }) => (
    <TouchableOpacity
      onPress={onPress}
      className="flex-row items-center px-4 py-3 bg-white"
      activeOpacity={0.7}
    >
      <View className="w-8 h-8 bg-gray-100 rounded-full justify-center items-center mr-3">
        <Ionicons name={icon as any} size={16} color={iconColor} />
      </View>
      <View className="flex-1">
        <Text className={`font-medium text-sm ${textColor}`}>{title}</Text>
        {subtitle && (
          <Text className="text-xs text-gray-500 mt-0.5">{subtitle}</Text>
        )}
      </View>
      {rightElement || (showChevron && (
        <Ionicons name="chevron-forward" size={16} color="#D1D5DB" />
      ))}
    </TouchableOpacity>
  );

  const ToggleSettingItem = ({ 
    setting, 
    onToggle,
    settingsType 
  }: { 
    setting: SettingToggle; 
    onToggle: (id: string, value: boolean, type: 'notification' | 'privacy') => void;
    settingsType: 'notification' | 'privacy';
  }) => (
    <View className="flex-row items-center px-4 py-3 bg-white">
      <View className="flex-1">
        <Text className="font-medium text-sm text-gray-900">{setting.title}</Text>
        {setting.description && (
          <Text className="text-xs text-gray-500 mt-0.5">{setting.description}</Text>
        )}
      </View>
      <Switch
        value={setting.value}
        onValueChange={(value) => onToggle(setting.id, value, settingsType)}
        trackColor={{ false: '#E5E7EB', true: '#10B981' }}
        thumbColor="#FFFFFF"
        style={{ transform: [{ scaleX: 0.8 }, { scaleY: 0.8 }] }}
      />
    </View>
  );

  const SectionHeader = ({ title }: { title: string }) => (
    <View className="px-4 py-2 bg-gray-50">
      <Text className="text-xs font-semibold text-gray-700 uppercase tracking-wider">
        {title}
      </Text>
    </View>
  );

  return (
    <Modal
      visible={isModalVisible}
      transparent
      animationType="none"
      statusBarTranslucent={false}
    >
      {/* Backdrop */}
      <Animated.View
        style={[
          {
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0,0,0,0.5)'
          },
          backdropStyle
        ]}
      >
        <TouchableOpacity
          style={{ flex: 1 }}
          onPress={handleClose}
          activeOpacity={1}
        />
      </Animated.View>

      {/* Slide Panel */}
      <Animated.View
        style={[
          {
            position: 'absolute',
            top: 0,
            right: 0,
            bottom: 0,
            width: SCREEN_WIDTH * 0.8,
            backgroundColor: '#FFFFFF',
            shadowColor: '#000',
            shadowOffset: { width: -2, height: 0 },
            shadowOpacity: 0.25,
            shadowRadius: 10,
            elevation: 10
          },
          animatedStyle
        ]}
      >
        <View 
          className="flex-1" 
          style={{ 
            paddingTop: insets.top,
            paddingBottom: insets.bottom 
          }}
        >
            {/* Header */}
            <View className="px-6 py-4 bg-white border-b border-gray-100">
              <View className="flex-row items-center justify-between mb-2">
                <Text className="text-xl font-bold text-gray-900">Settings</Text>
                <TouchableOpacity onPress={handleClose} className="p-2 -mr-2">
                  <Ionicons name="close" size={24} color="#6B7280" />
                </TouchableOpacity>
              </View>
            </View>

            {/* Settings Content */}
            <ScrollView 
              className="flex-1" 
              showsVerticalScrollIndicator={false}
              contentContainerStyle={{ paddingBottom: 20 }}
            >
              {/* User Profile Section */}
              {/* <Animated.View entering={FadeInDown.delay(100)} className="mx-4 mt-4">
                <TouchableOpacity
                  onPress={() => onNavigate?.('EditProfile')}
                  className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm"
                  activeOpacity={0.7}
                >
                  <View className="flex-row items-center">
                    <View className="w-12 h-12 bg-blue-100 rounded-full justify-center items-center mr-3">
                      <Text className="text-sm font-bold text-blue-600">
                        {userInfo.name.split(' ').map(n => n[0]).join('').toUpperCase()}
                      </Text>
                    </View>
                    <View className="flex-1">
                      <Text className="text-sm font-semibold text-gray-900">{userInfo.name}</Text>
                      <Text className="text-xs text-gray-500">{userInfo.email}</Text>
                      <Text className="text-xs text-blue-600 mt-1">View and edit profile</Text>
                    </View>
                    <Ionicons name="chevron-forward" size={16} color="#D1D5DB" />
                  </View>
                </TouchableOpacity>
              </Animated.View> */}

              {/* Account Section */}
              <Animated.View entering={FadeInDown.delay(200)} className="mx-4 mt-4">
                <SectionHeader title="Account" />
                <View className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
                  <SettingItem
                    icon="person"
                    title="Edit Profile"
                    subtitle="Update your personal information"
                    onPress={() => {
                      onNavigate?.('/(profile)/edit-profile');
                      handleClose();
                    }}
                  />
                  <View className="h-px bg-gray-100 ml-14" />
                  <SettingItem
                    icon="location"
                    title="Address"
                    subtitle="Manage your saved addresses"
                    onPress={() => {
                      onNavigate?.('/(profile)/shipping-address');
                      handleClose();
                    }}
                  />
                  <View className="h-px bg-gray-100 ml-14" />
                  <SettingItem
                    icon="card"
                    title="Payment Methods"
                    subtitle="Manage your payment options"
                    onPress={() => {
                      onNavigate?.('/(profile)/payment-methods');
                      handleClose();
                    }}
                  />
                  <View className="h-px bg-gray-100 ml-14" />
                  <SettingItem
                    icon="lock-closed"
                    title="Change Password"
                    subtitle="Update your account password"
                    onPress={() => {
                      onNavigate?.('/(profile)/change-password');
                      handleClose();
                    }}
                  />
                </View>
              </Animated.View>

              {/* Notification Settings */}
              <Animated.View entering={FadeInDown.delay(300)} className="mx-4 mt-4">
                <SectionHeader title="Notification Settings" />
                <View className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
                  {notificationSettings.map((setting, index) => (
                    <View key={setting.id}>
                      <ToggleSettingItem 
                        setting={setting} 
                        onToggle={handleToggleChange}
                        settingsType="notification"
                      />
                      {index < notificationSettings.length - 1 && (
                        <View className="h-px bg-gray-100 ml-4" />
                      )}
                    </View>
                  ))}
                </View>
              </Animated.View>

              {/* Privacy & Security */}
              <Animated.View entering={FadeInDown.delay(400)} className="mx-4 mt-4">
                <SectionHeader title="Privacy & Security" />
                <View className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
                  {privacySettings.map((setting, index) => (
                    <View key={setting.id}>
                      <ToggleSettingItem 
                        setting={setting} 
                        onToggle={handleToggleChange}
                        settingsType="privacy"
                      />
                      {index < privacySettings.length - 1 && (
                        <View className="h-px bg-gray-100 ml-4" />
                      )}
                    </View>
                  ))}
                </View>
              </Animated.View>

              {/* Other Options */}
              <Animated.View entering={FadeInDown.delay(500)} className="mx-4 mt-4">
                <SectionHeader title="Other" />
                <View className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
                  <SettingItem
                    icon="help-circle"
                    title="Help & Support"
                    subtitle="Get help and contact support"
                    onPress={() => {
                      onNavigate?.('/(profile)/help-support');
                      handleClose();
                    }}
                  />
                  <View className="h-px bg-gray-100 ml-14" />
                  <SettingItem
                    icon="document-text"
                    title="Terms of Service"
                    subtitle="Read our terms and conditions"
                    onPress={() => {
                      onNavigate?.('terms-of-service');
                      handleClose();
                    }}
                  />
                  <View className="h-px bg-gray-100 ml-14" />
                  <SettingItem
                    icon="shield-checkmark"
                    title="Privacy Policy"
                    subtitle="Learn about our privacy practices"
                    onPress={() => {
                      onNavigate?.('Privacy');
                      handleClose();
                    }}
                  />
                  <View className="h-px bg-gray-100 ml-14" />
                  <SettingItem
                    icon="information-circle"
                    title="About"
                    subtitle="App version and information"
                    onPress={() => {
                      onNavigate?.('About');
                      handleClose();
                    }}
                  />
                </View>
              </Animated.View>

              {/* Account Actions */}
              <Animated.View entering={FadeInDown.delay(600)} className="mx-4 mt-4">
                <SectionHeader title="Account Actions" />
                <View className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
                  <SettingItem
                    icon="log-out"
                    title="Sign Out"
                    subtitle="Sign out of your account"
                    onPress={handleLogout}
                    showChevron={false}
                    textColor="text-orange-600"
                    iconColor="#EA580C"
                  />
                  <View className="h-px bg-gray-100 ml-14" />
                  <SettingItem
                    icon="trash"
                    title="Delete Account"
                    subtitle="Permanently delete your account"
                    onPress={handleDeleteAccount}
                    showChevron={false}
                    textColor="text-red-600"
                    iconColor="#DC2626"
                  />
                </View>
              </Animated.View>
            </ScrollView>
          </View>
        
      </Animated.View>
    </Modal>
  );
}