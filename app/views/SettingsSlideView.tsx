// components/SettingsSlideView.tsx  ✅ AgarVision version (no Orders/Shipping/Payment stuff)
import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Modal,
  Dimensions,
  Switch,
  Alert,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  FadeInDown,
  FadeIn,
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
  userInfo = { name: 'AgarVision User', email: 'support@agarvision.com' },
}: SettingsSlideViewProps) {
  const slideAnim = useSharedValue(SCREEN_WIDTH);
  const backdropOpacity = useSharedValue(0);
  const insets = useSafeAreaInsets();

  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isClosing, setIsClosing] = useState(false);

  // ✅ AgarVision toggles (no orders/shipping/payment)
  const [appSettings, setAppSettings] = useState<SettingToggle[]>([
    {
      id: 'push',
      title: 'Push Notifications',
      description: 'Get scan results and alerts on your device',
      value: true,
    },
    {
      id: 'email',
      title: 'Email Notifications',
      description: 'Receive important updates via email',
      value: false,
    },
    {
      id: 'scan_updates',
      title: 'Scan Result Updates',
      description: 'Notify when prediction is completed',
      value: true,
    },
    {
      id: 'tips',
      title: 'Capture Tips',
      description: 'Helpful tips to improve image accuracy',
      value: true,
    },
    {
      id: 'security',
      title: 'Security Alerts',
      description: 'Important account and login alerts',
      value: true,
    },
  ]);

  const [privacySettings, setPrivacySettings] = useState<SettingToggle[]>([
    {
      id: 'analytics',
      title: 'Analytics & Usage Data',
      description: 'Help improve the app by sharing usage stats',
      value: false,
    },
    {
      id: 'personalization',
      title: 'Personalized Experience',
      description: 'Use activity to personalize your experience',
      value: true,
    },
    {
      id: 'crash_reports',
      title: 'Crash Reports',
      description: 'Send crash logs to improve stability',
      value: true,
    },
  ]);

  useEffect(() => {
    if (visible && !isClosing) {
      setIsModalVisible(true);
      backdropOpacity.value = withTiming(1, { duration: 300 });
      slideAnim.value = withTiming(0, { duration: 400 });
    } else if (!visible && !isClosing) {
      setIsClosing(true);
      backdropOpacity.value = withTiming(0, { duration: 300 });
      slideAnim.value = withTiming(SCREEN_WIDTH, { duration: 300 });

      setTimeout(() => {
        setIsModalVisible(false);
        setIsClosing(false);
      }, 350);
    }
  }, [visible, isClosing]);

  const handleClose = () => {
    if (!isClosing) onClose();
  };

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: slideAnim.value }],
  }));

  const backdropStyle = useAnimatedStyle(() => ({
    opacity: backdropOpacity.value,
  }));

  const handleToggleChange = (settingId: string, value: boolean, type: 'app' | 'privacy') => {
    if (type === 'app') {
      setAppSettings((prev) => prev.map((s) => (s.id === settingId ? { ...s, value } : s)));
    } else {
      setPrivacySettings((prev) => prev.map((s) => (s.id === settingId ? { ...s, value } : s)));
    }
  };

  const handleLogout = () => {
    Alert.alert('Sign Out', 'Are you sure you want to sign out?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Sign Out',
        style: 'destructive',
        onPress: () => {
          onLogout?.();
          handleClose();
        },
      },
    ]);
  };

  const handleDeleteAccount = () => {
    Alert.alert(
      'Delete Account',
      'This action cannot be undone. Please contact support to delete your account.',
      [{ text: 'OK' }]
    );
  };

  const SectionHeader = ({ title }: { title: string }) => (
    <View className="px-4 py-2 bg-gray-50">
      <Text className="text-xs font-semibold text-gray-700 uppercase tracking-wider">{title}</Text>
    </View>
  );

  const SettingItem = ({
    icon,
    title,
    subtitle,
    onPress,
    showChevron = true,
    textColor = 'text-gray-900',
    iconColor = '#6B7280',
    rightElement,
  }: {
    icon: string;
    title: string;
    subtitle?: string;
    onPress?: () => void;
    showChevron?: boolean;
    textColor?: string;
    iconColor?: string;
    rightElement?: React.ReactNode;
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
        {subtitle ? <Text className="text-xs text-gray-500 mt-0.5">{subtitle}</Text> : null}
      </View>

      {rightElement ||
        (showChevron ? <Ionicons name="chevron-forward" size={16} color="#D1D5DB" /> : null)}
    </TouchableOpacity>
  );

  const ToggleSettingItem = ({
    setting,
    settingsType,
  }: {
    setting: SettingToggle;
    settingsType: 'app' | 'privacy';
  }) => (
    <View className="flex-row items-center px-4 py-3 bg-white">
      <View className="flex-1">
        <Text className="font-medium text-sm text-gray-900">{setting.title}</Text>
        {setting.description ? (
          <Text className="text-xs text-gray-500 mt-0.5">{setting.description}</Text>
        ) : null}
      </View>
      <Switch
        value={setting.value}
        onValueChange={(v) => handleToggleChange(setting.id, v, settingsType)}
        trackColor={{ false: '#E5E7EB', true: '#10B981' }}
        thumbColor="#FFFFFF"
        style={{ transform: [{ scaleX: 0.8 }, { scaleY: 0.8 }] }}
      />
    </View>
  );

  return (
    <Modal visible={isModalVisible} transparent animationType="none" statusBarTranslucent={false}>
      {/* Backdrop */}
      <Animated.View
        style={[
          {
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0,0,0,0.5)',
          },
          backdropStyle,
        ]}
      >
        <TouchableOpacity style={{ flex: 1 }} onPress={handleClose} activeOpacity={1} />
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
            elevation: 10,
          },
          animatedStyle,
        ]}
      >
        <View className="flex-1" style={{ paddingTop: insets.top, paddingBottom: insets.bottom }}>
          {/* Header */}
          <View className="px-6 py-4 bg-white border-b border-gray-100">
            <View className="flex-row items-center justify-between">
              <Text className="text-xl font-bold text-gray-900">Settings</Text>
              <TouchableOpacity onPress={handleClose} className="p-2 -mr-2">
                <Ionicons name="close" size={24} color="#6B7280" />
              </TouchableOpacity>
            </View>
          </View>

          {/* Content */}
          <ScrollView
            className="flex-1"
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ paddingBottom: 20 }}
          >
            {/* Profile quick block */}
            <Animated.View entering={FadeIn.delay(50)} className="mx-4 mt-4">
              <View className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
                <View className="px-4 py-4 flex-row items-center">
                  <View className="w-11 h-11 bg-primary/15 rounded-full justify-center items-center mr-3 border border-primary/20">
                    <Ionicons name="person" size={18} color="#10B981" />
                  </View>
                  <View className="flex-1">
                    <Text className="text-sm font-semibold text-gray-900">{userInfo.name}</Text>
                    <Text className="text-xs text-gray-500">{userInfo.email}</Text>
                  </View>
                </View>
              </View>
            </Animated.View>

            {/* Account */}
            <Animated.View entering={FadeInDown.delay(120)} className="mx-4 mt-4">
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
                  iconColor="#10B981"
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
                  iconColor="#10B981"
                />
              </View>
            </Animated.View>

            {/* App Notifications */}
            <Animated.View entering={FadeInDown.delay(220)} className="mx-4 mt-4">
              <SectionHeader title="Notifications" />
              <View className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
                {appSettings.map((s, idx) => (
                  <View key={s.id}>
                    <ToggleSettingItem setting={s} settingsType="app" />
                    {idx < appSettings.length - 1 ? <View className="h-px bg-gray-100 ml-4" /> : null}
                  </View>
                ))}
              </View>
            </Animated.View>

            {/* Privacy */}
            <Animated.View entering={FadeInDown.delay(320)} className="mx-4 mt-4">
              <SectionHeader title="Privacy" />
              <View className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
                {privacySettings.map((s, idx) => (
                  <View key={s.id}>
                    <ToggleSettingItem setting={s} settingsType="privacy" />
                    {idx < privacySettings.length - 1 ? (
                      <View className="h-px bg-gray-100 ml-4" />
                    ) : null}
                  </View>
                ))}
              </View>
            </Animated.View>

            {/* Info (dynamic page) */}
            <Animated.View entering={FadeInDown.delay(420)} className="mx-4 mt-4">
              <SectionHeader title="Info" />
              <View className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
                <SettingItem
                  icon="time"
                  title="History"
                  subtitle="View your scans and predictions"
                  onPress={() => {
                    onNavigate?.('/(profile)/info?type=history');
                    handleClose();
                  }}
                  iconColor="#10B981"
                />
                <View className="h-px bg-gray-100 ml-14" />
                <SettingItem
                  icon="call"
                  title="Contact"
                  subtitle="Call support"
                  onPress={() => {
                    onNavigate?.('/(profile)/info?type=contact');
                    handleClose();
                  }}
                  iconColor="#10B981"
                />
                <View className="h-px bg-gray-100 ml-14" />
                <SettingItem
                  icon="mail"
                  title="Email"
                  subtitle="Send us a message"
                  onPress={() => {
                    onNavigate?.('/(profile)/info?type=email');
                    handleClose();
                  }}
                  iconColor="#10B981"
                />
                <View className="h-px bg-gray-100 ml-14" />
                <SettingItem
                  icon="information-circle"
                  title="About Us"
                  subtitle="AgarVision information"
                  onPress={() => {
                    onNavigate?.('/(profile)/info?type=about');
                    handleClose();
                  }}
                  iconColor="#10B981"
                />
              </View>
            </Animated.View>

            {/* Other */}
            <Animated.View entering={FadeInDown.delay(520)} className="mx-4 mt-4">
              <SectionHeader title="Other" />
              <View className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
                <SettingItem
                  icon="help-circle"
                  title="Help & Support"
                  subtitle="FAQs and support"
                  onPress={() => {
                    onNavigate?.('/(profile)/help-support');
                    handleClose();
                  }}
                  iconColor="#10B981"
                />
                <View className="h-px bg-gray-100 ml-14" />
                <SettingItem
                  icon="document-text"
                  title="Terms of Service"
                  subtitle="Read our terms"
                  onPress={() => {
                    onNavigate?.('/(profile)/terms-of-service');
                    handleClose();
                  }}
                  iconColor="#10B981"
                />
              </View>
            </Animated.View>

            {/* Account actions */}
            <Animated.View entering={FadeInDown.delay(620)} className="mx-4 mt-4">
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
                  subtitle="Contact support to delete"
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
