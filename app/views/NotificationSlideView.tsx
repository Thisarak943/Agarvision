// components/NotificationSlideView.tsx
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
  FadeIn,
  FadeInDown,
} from 'react-native-reanimated';
import { router } from 'expo-router';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

export interface Notification {
  id: number;
  title: string;
  message: string;
  type: 'success' | 'error' | 'info' | 'warning';
  timestamp: string;
  read: boolean;
  actionable?: boolean;
}

interface NotificationSlideViewProps {
  visible: boolean;
  onClose: () => void;
  notifications: Notification[];
  onNotificationRead?: (id: number) => void;
  onNotificationAction?: (id: number, action: string) => void;
  onClearAll?: () => void;

  // ✅ OPTIONAL: if you want routing without writing extra code outside
  // (just pass your routes once)
  routes?: {
    history?: string; // e.g. '/(profile)/info?type=history'
    result?: string;  // e.g. '/views/success' (your result screen)
    settings?: string; // e.g. '/(profile)/settings'
  };
}

export default function NotificationSlideView({
  visible,
  onClose,
  notifications,
  onNotificationRead,
  onNotificationAction,
  onClearAll,
  routes,
}: NotificationSlideViewProps) {
  const slideAnim = useSharedValue(SCREEN_WIDTH);
  const backdropOpacity = useSharedValue(0);
  const insets = useSafeAreaInsets();

  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isClosing, setIsClosing] = useState(false);

  const [notificationSettings, setNotificationSettings] = useState({
    pushNotifications: true,
  });

  useEffect(() => {
    if (visible && !isClosing) {
      setIsModalVisible(true);
      backdropOpacity.value = withTiming(1, { duration: 250 });
      slideAnim.value = withTiming(0, { duration: 350 });
    } else if (!visible && !isClosing) {
      setIsClosing(true);
      backdropOpacity.value = withTiming(0, { duration: 250 });
      slideAnim.value = withTiming(SCREEN_WIDTH, { duration: 250 });

      setTimeout(() => {
        setIsModalVisible(false);
        setIsClosing(false);
      }, 280);
    }
  }, [visible, isClosing, backdropOpacity, slideAnim]);

  const handleClose = () => {
    if (!isClosing) onClose();
  };

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: slideAnim.value }],
  }));

  const backdropStyle = useAnimatedStyle(() => ({
    opacity: backdropOpacity.value,
  }));

  const getNotificationIcon = (type: Notification['type']) => {
    switch (type) {
      case 'success':
        return 'checkmark-circle';
      case 'error':
        return 'alert-circle';
      case 'warning':
        return 'warning';
      default:
        return 'information-circle';
    }
  };

  const getNotificationColor = (type: Notification['type']) => {
    switch (type) {
      case 'success':
        return '#10B981';
      case 'error':
        return '#EF4444';
      case 'warning':
        return '#F59E0B';
      default:
        return '#3B82F6';
    }
  };

  const defaultActionRouting = (notification: Notification) => {
    // ✅ Your app version (AgarVision) – choose where to go
    // You can customize these to your real routes
    if (notification.title.toLowerCase().includes('history')) {
      if (routes?.history) router.push(routes.history);
      return;
    }

    // prediction / result notifications
    if (
      notification.title.toLowerCase().includes('prediction') ||
      notification.title.toLowerCase().includes('grade') ||
      notification.title.toLowerCase().includes('export')
    ) {
      if (routes?.result) router.push(routes.result);
      return;
    }
  };

  const handleNotificationPress = (notification: Notification) => {
    if (!notification.read && onNotificationRead) {
      onNotificationRead(notification.id);
    }

    // If it's actionable show dialog
    if (notification.actionable) {
      Alert.alert(notification.title, notification.message, [
        { text: 'Dismiss', style: 'cancel' },
        {
          text: 'View',
          onPress: () => {
            // 1) call external action handler if provided
            if (onNotificationAction) {
              onNotificationAction(notification.id, 'view');
            } else {
              // 2) otherwise do default routing
              defaultActionRouting(notification);
            }
          },
        },
      ]);
    }
  };

  const handleClearAll = () => {
    if (!onClearAll) return;
    Alert.alert(
      'Clear All Notifications',
      'Are you sure you want to clear all notifications?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Clear All', style: 'destructive', onPress: onClearAll },
      ]
    );
  };

  const unreadCount = notifications.filter((n) => !n.read).length;

  const handleMarkAllRead = () => {
    // if you have parent handler, call it per id (simple + works)
    if (!onNotificationRead) {
      Alert.alert('Info', 'Mark All Read is not connected to state yet.');
      return;
    }
    notifications
      .filter((n) => !n.read)
      .forEach((n) => onNotificationRead(n.id));
  };

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
            width: SCREEN_WIDTH * 0.82,
            backgroundColor: '#FFFFFF',
            shadowColor: '#000',
            shadowOffset: { width: -2, height: 0 },
            shadowOpacity: 0.2,
            shadowRadius: 10,
            elevation: 10,
          },
          animatedStyle,
        ]}
      >
        <View
          className="flex-1"
          style={{
            paddingTop: insets.top,
            paddingBottom: insets.bottom,
          }}
        >
          {/* Header */}
          <View className="px-6 py-4 bg-white border-b border-gray-100">
            <View className="flex-row items-center justify-between mb-2">
              <View className="flex-row items-center">
                <View className="w-10 h-10 rounded-2xl bg-primary/10 items-center justify-center mr-3">
                  <Ionicons name="notifications" size={20} color="#10B981" />
                </View>
                <View>
                  <Text className="text-lg font-bold text-gray-900">AgarVision Alerts</Text>
                  <Text className="text-xs text-gray-500">
                    {unreadCount} unread • {notifications.length} total
                  </Text>
                </View>
              </View>

              <TouchableOpacity onPress={handleClose} className="p-2 -mr-2">
                <Ionicons name="close" size={24} color="#6B7280" />
              </TouchableOpacity>
            </View>

            {/* Actions */}
            <View className="flex-row items-center justify-between">
              <View className="flex-row items-center">
                <Ionicons name="sparkles-outline" size={16} color="#6B7280" />
                <Text className="text-sm text-gray-600 ml-2">
                  Scan updates • Quality tips • Export readiness
                </Text>
              </View>

              {notifications.length > 0 && (
                <TouchableOpacity
                  onPress={handleClearAll}
                  className="px-3 py-1 bg-red-50 rounded-full"
                >
                  <Text className="text-xs text-red-600 font-medium">Clear</Text>
                </TouchableOpacity>
              )}
            </View>
          </View>

          {/* Quick Setting Toggle */}
          <View className="px-6 py-3 bg-gray-50 border-b border-gray-100">
            <View className="flex-row items-center justify-between">
              <View className="flex-row items-center">
                <Ionicons name="notifications-outline" size={16} color="#6B7280" />
                <Text className="text-sm text-gray-700 ml-2">Push notifications</Text>
              </View>

              <Switch
                value={notificationSettings.pushNotifications}
                onValueChange={(value) =>
                  setNotificationSettings((prev) => ({ ...prev, pushNotifications: value }))
                }
                trackColor={{ false: '#E5E7EB', true: '#10B981' }}
                thumbColor="#FFFFFF"
              />
            </View>
          </View>

          {/* Notifications List */}
          <ScrollView
            className="flex-1"
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ paddingBottom: 20 }}
          >
            {notifications.length === 0 ? (
              <Animated.View
                entering={FadeIn}
                className="flex-1 justify-center items-center px-6 py-20"
              >
                <View className="w-16 h-16 bg-gray-100 rounded-full justify-center items-center mb-4">
                  <Ionicons name="leaf-outline" size={32} color="#9CA3AF" />
                </View>
                <Text className="text-lg font-medium text-gray-900 mb-2">No alerts</Text>
                <Text className="text-gray-500 text-center">
                  You’re all caught up. New scan updates will show here.
                </Text>
              </Animated.View>
            ) : (
              notifications.map((notification, index) => (
                <Animated.View
                  key={notification.id}
                  entering={FadeInDown.delay(index * 70)}
                  className="mx-6 mt-4"
                >
                  <TouchableOpacity
                    onPress={() => handleNotificationPress(notification)}
                    className={`rounded-2xl p-4 border ${
                      notification.read
                        ? 'bg-white border-gray-200'
                        : 'bg-green-50 border-primary/40'
                    }`}
                    activeOpacity={0.8}
                  >
                    <View className="flex-row items-start">
                      {/* Icon */}
                      <View
                        className={`w-10 h-10 rounded-2xl justify-center items-center mr-3 ${
                          notification.read ? 'bg-gray-100' : 'bg-primary/15'
                        }`}
                      >
                        <Ionicons
                          name={getNotificationIcon(notification.type)}
                          size={22}
                          color={getNotificationColor(notification.type)}
                        />
                      </View>

                      {/* Content */}
                      <View className="flex-1">
                        <View className="flex-row items-start justify-between">
                          <Text
                            className={`font-semibold text-sm ${
                              notification.read ? 'text-gray-700' : 'text-gray-900'
                            }`}
                          >
                            {notification.title}
                          </Text>
                          {!notification.read && (
                            <View className="w-2 h-2 bg-primary rounded-full ml-2 mt-1" />
                          )}
                        </View>

                        <Text
                          className={`text-xs mt-1 ${
                            notification.read ? 'text-gray-500' : 'text-gray-700'
                          }`}
                        >
                          {notification.message}
                        </Text>

                        <View className="flex-row items-center justify-between mt-3">
                          <View className="flex-row items-center">
                            <Ionicons name="time-outline" size={14} color="#9CA3AF" />
                            <Text className="text-xs text-gray-400 ml-1">
                              {notification.timestamp}
                            </Text>
                          </View>

                          {notification.actionable ? (
                            <TouchableOpacity
                              className="px-3 py-1 bg-primary rounded-full"
                              onPress={() => {
                                if (onNotificationAction) {
                                  onNotificationAction(notification.id, 'view');
                                } else {
                                  defaultActionRouting(notification);
                                }
                              }}
                            >
                              <Text className="text-xs text-white font-medium">View</Text>
                            </TouchableOpacity>
                          ) : (
                            <View className="px-3 py-1 bg-gray-100 rounded-full">
                              <Text className="text-xs text-gray-600 font-medium">Info</Text>
                            </View>
                          )}
                        </View>
                      </View>
                    </View>
                  </TouchableOpacity>
                </Animated.View>
              ))
            )}
          </ScrollView>

          {/* Footer */}
          <View className="px-6 py-4 bg-gray-50 border-t border-gray-100">
            <View className="flex-row" style={{ gap: 10 }}>
              <TouchableOpacity
                className="flex-1 py-3 bg-white border border-gray-200 rounded-xl items-center"
                onPress={handleMarkAllRead}
              >
                <Text className="text-gray-700 font-medium">Mark all read</Text>
              </TouchableOpacity>

              <TouchableOpacity
                className="flex-1 py-3 bg-primary rounded-xl items-center"
                onPress={() => {
                  const settingsRoute = routes?.settings ?? '/(profile)/settings';
                  router.push(settingsRoute);
                  handleClose();
                }}
              >
                <Text className="text-white font-medium">Settings</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Animated.View>
    </Modal>
  );
}
