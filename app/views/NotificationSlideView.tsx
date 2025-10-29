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
  Alert
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  FadeIn,
  FadeInDown
} from 'react-native-reanimated';
import { router } from 'expo-router';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

interface Notification {
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
}

export default function NotificationSlideView({
  visible,
  onClose,
  notifications,
  onNotificationRead,
  onNotificationAction,
  onClearAll
}: NotificationSlideViewProps) {
  const slideAnim = useSharedValue(SCREEN_WIDTH);
  const backdropOpacity = useSharedValue(0);
  const insets = useSafeAreaInsets();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isClosing, setIsClosing] = useState(false);
  const [notificationSettings, setNotificationSettings] = useState({
    pushNotifications: true,
    emailNotifications: false,
    orderUpdates: true,
    promotionalOffers: false,
    securityAlerts: true
  });

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

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'success': return 'checkmark-circle';
      case 'error': return 'alert-circle';
      case 'warning': return 'warning';
      default: return 'information-circle';
    }
  };

  const getNotificationColor = (type: string) => {
    switch (type) {
      case 'success': return '#10B981';
      case 'error': return '#EF4444';
      case 'warning': return '#F59E0B';
      default: return '#3B82F6';
    }
  };

  const handleNotificationPress = (notification: Notification) => {
    if (!notification.read && onNotificationRead) {
      onNotificationRead(notification.id);
    }
    
    if (notification.actionable && onNotificationAction) {
      Alert.alert(
        notification.title,
        notification.message,
        [
          { text: 'Dismiss', style: 'cancel' },
          { 
            text: 'View Details', 
            onPress: () => onNotificationAction(notification.id, 'view')
          }
        ]
      );
    }
  };

  const handleClearAll = () => {
    Alert.alert(
      'Clear All Notifications',
      'Are you sure you want to clear all notifications?',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Clear All', 
          style: 'destructive',
          onPress: onClearAll
        }
      ]
    );
  };

  const unreadCount = notifications.filter(n => !n.read).length;

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
                <Text className="text-xl font-bold text-gray-900">Notifications</Text>
                <TouchableOpacity onPress={handleClose} className="p-2 -mr-2">
                  <Ionicons name="close" size={24} color="#6B7280" />
                </TouchableOpacity>
              </View>
              
              {/* Stats */}
              <View className="flex-row items-center justify-between">
                <Text className="text-sm text-gray-500">
                  {unreadCount} unread of {notifications.length} total
                </Text>
                {notifications.length > 0 && (
                  <TouchableOpacity onPress={handleClearAll} className="px-3 py-1 bg-red-50 rounded-full">
                    <Text className="text-xs text-red-600 font-medium">Clear All</Text>
                  </TouchableOpacity>
                )}
              </View>
            </View>

            {/* Notification Settings Toggle */}
            <View className="px-6 py-3 bg-gray-50 border-b border-gray-100">
              <View className="flex-row items-center justify-between">
                <View className="flex-row items-center">
                  <Ionicons name="settings" size={16} color="#6B7280" />
                  <Text className="text-sm text-gray-600 ml-2">Push Notifications</Text>
                </View>
                <Switch
                  value={notificationSettings.pushNotifications}
                  onValueChange={(value) => 
                    setNotificationSettings(prev => ({ ...prev, pushNotifications: value }))
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
                    <Ionicons name="notifications-off" size={32} color="#9CA3AF" />
                  </View>
                  <Text className="text-lg font-medium text-gray-900 mb-2">No Notifications</Text>
                  <Text className="text-gray-500 text-center">
                    You're all caught up! New notifications will appear here.
                  </Text>
                </Animated.View>
              ) : (
                notifications.map((notification, index) => (
                  <Animated.View
                    key={notification.id}
                    entering={FadeInDown.delay(index * 100)}
                    className="mx-6 mt-4"
                  >
                    <TouchableOpacity
                      onPress={() => handleNotificationPress(notification)}
                      className={`bg-white rounded-xl p-2 border ${
                        notification.read ? 'border-gray-200' : 'border-primary/50 bg-blue-50'
                      }`}
                      activeOpacity={0.7}
                    >
                      <View className="flex-row items-start">
                        {/* Icon */}
                        <View className={`w-7 h-7 rounded-full justify-center items-center mr-3 ${
                          notification.read ? 'bg-gray-200' : 'bg-primary/20'
                        }`}>
                          <Ionicons 
                            name={getNotificationIcon(notification.type)} 
                            size={20} 
                            color={getNotificationColor(notification.type)} 
                          />
                        </View>

                        {/* Content */}
                        <View className="flex-1">
                          <View className="flex-row items-start justify-between mb-1">
                            <Text className={`font-semibold text-sm ${
                              notification.read ? 'text-gray-600' : 'text-gray-900'
                            }`}>
                              {notification.title}
                            </Text>
                            {!notification.read && (
                              <View className="w-2 h-2 bg-primary rounded-full ml-2 mt-1" />
                            )}
                          </View>
                          
                          <Text className={`text-xs mb-2 ${
                            notification.read ? 'text-gray-500' : 'text-gray-700'
                          }`}>
                            {notification.message}
                          </Text>
                          
                          <View className="flex-row items-center justify-between">
                            <Text className="text-xs text-gray-400">
                              {notification.timestamp}
                            </Text>
                            
                            {notification.actionable && (
                              <View className="flex-row">
                                <TouchableOpacity
                                  className="px-3 py-1 bg-primary rounded-full"
                                  onPress={() => onNotificationAction?.(notification.id, 'action')}
                                >
                                  <Text className="text-xs text-white font-medium">Action</Text>
                                </TouchableOpacity>
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

            {/* Footer Actions */}
            <View className="px-6 py-4 bg-gray-50 border-t border-gray-100">
              <View className="flex-row">
                <TouchableOpacity className="flex-1 mr-3 py-3 bg-white border border-gray-200 rounded-lg items-center">
                  <Text className="text-gray-700 font-medium">Mark All Read</Text>
                </TouchableOpacity>
                <TouchableOpacity className="flex-1 py-3 bg-primary rounded-lg items-center" onPress={() => {router.push('/(profile)/settings'); handleClose();}}>
                  <Text className="text-white font-medium">Settings</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        
      </Animated.View>
    </Modal>
  );
}