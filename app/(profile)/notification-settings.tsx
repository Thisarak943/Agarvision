import { useState } from 'react'
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { View, Text, TouchableOpacity, ScrollView, Switch } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context';
import Header from "../../components/ui/Header";

export default function notifications() {
    // State for notification preferences
    const [pushNotifications, setPushNotifications] = useState(true);
    const [emailNotifications, setEmailNotifications] = useState(true);
    const [smsNotifications, setSmsNotifications] = useState(false);

    // Order notifications
    const [orderUpdates, setOrderUpdates] = useState(true);
    const [orderDelivered, setOrderDelivered] = useState(true);
    const [orderCancelled, setOrderCancelled] = useState(true);

    // Marketing notifications
    const [promotions, setPromotions] = useState(true);
    const [newProducts, setNewProducts] = useState(false);
    const [weeklyDeals, setWeeklyDeals] = useState(true);

    // App notifications
    const [appUpdates, setAppUpdates] = useState(true);
    const [securityAlerts, setSecurityAlerts] = useState(true);
    const [accountActivity, setAccountActivity] = useState(true);

    const renderToggleItem = (title, subtitle, value, onValueChange, important = false) => (
        <View className="bg-white px-6 py-4 border-b border-gray-100">
            <View className="flex-row items-center justify-between">
                <View className="flex-1 pr-4">
                    <View className="flex-row items-center">
                        <Text className="text-base font-medium text-gray-900">
                            {title}
                        </Text>
                        {important && (
                            <View className="ml-2 bg-red-100 px-2 py-1 rounded-full">
                                <Text className="text-xs text-red-600 font-medium">
                                    Important
                                </Text>
                            </View>
                        )}
                    </View>
                    <Text className="text-sm text-gray-500 mt-1">
                        {subtitle}
                    </Text>
                </View>

                <Switch
                    value={value}
                    onValueChange={onValueChange}
                    trackColor={{ false: '#F3F4F6', true: '#10B981' }}
                    thumbColor={value ? '#FFFFFF' : '#FFFFFF'}
                    className="transform scale-x-75 scale-y-75"
                />

            </View>
        </View>
    );

    const renderSectionHeader = (title, subtitle) => (
        <View className="px-6 py-3">
            <Text className="text-sm font-medium text-gray-500 uppercase tracking-wide">
                {title}
            </Text>
            {subtitle && (
                <Text className="text-xs text-gray-400 mt-1">
                    {subtitle}
                </Text>
            )}
        </View>
    );

    return (
        <SafeAreaView className="flex-1 bg-gray-50">
            <Header title="Notifications" />

            <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
                {/* Notification Methods */}
                <View className="mt-6">
                    {renderSectionHeader('Notification Methods', 'Choose how you want to receive notifications')}
                    <View className="bg-white rounded-lg mx-4 overflow-hidden shadow-sm">
                        {renderToggleItem(
                            'Push Notifications',
                            'Receive notifications on your device',
                            pushNotifications,
                            setPushNotifications
                        )}
                        {renderToggleItem(
                            'Email Notifications',
                            'Receive notifications via email',
                            emailNotifications,
                            setEmailNotifications
                        )}
                        {renderToggleItem(
                            'SMS Notifications',
                            'Receive notifications via text message',
                            smsNotifications,
                            setSmsNotifications
                        )}
                    </View>
                </View>

                {/* Order Notifications */}
                <View className="mt-8">
                    {renderSectionHeader('Order Updates', 'Stay informed about your orders')}
                    <View className="bg-white rounded-lg mx-4 overflow-hidden shadow-sm">
                        {renderToggleItem(
                            'Order Status Updates',
                            'Get notified when your order status changes',
                            orderUpdates,
                            setOrderUpdates,
                            true
                        )}
                        {renderToggleItem(
                            'Delivery Confirmations',
                            'Get notified when your order is delivered',
                            orderDelivered,
                            setOrderDelivered,
                            true
                        )}
                        {renderToggleItem(
                            'Order Cancellations',
                            'Get notified if your order is cancelled',
                            orderCancelled,
                            setOrderCancelled,
                            true
                        )}
                    </View>
                </View>

                {/* Marketing Notifications */}
                <View className="mt-8">
                    {renderSectionHeader('Marketing & Promotions', 'Deals, offers, and product updates')}
                    <View className="bg-white rounded-lg mx-4 overflow-hidden shadow-sm">
                        {renderToggleItem(
                            'Promotions & Offers',
                            'Get notified about special deals and discounts',
                            promotions,
                            setPromotions
                        )}
                        {renderToggleItem(
                            'New Products',
                            'Be the first to know about new arrivals',
                            newProducts,
                            setNewProducts
                        )}
                        {renderToggleItem(
                            'Weekly Deals',
                            'Receive our weekly deals newsletter',
                            weeklyDeals,
                            setWeeklyDeals
                        )}
                    </View>
                </View>

                {/* App & Security Notifications */}
                <View className="mt-8">
                    {renderSectionHeader('App & Security', 'Important app and security updates')}
                    <View className="bg-white rounded-lg mx-4 overflow-hidden shadow-sm">
                        {renderToggleItem(
                            'App Updates',
                            'Get notified about new app features and updates',
                            appUpdates,
                            setAppUpdates
                        )}
                        {renderToggleItem(
                            'Security Alerts',
                            'Important security notifications for your account',
                            securityAlerts,
                            setSecurityAlerts,
                            true
                        )}
                        {renderToggleItem(
                            'Account Activity',
                            'Get notified about important account changes',
                            accountActivity,
                            setAccountActivity,
                            true
                        )}
                    </View>
                </View>

                {/* Notification Schedule */}
                <View className="mt-8">
                    {renderSectionHeader('Notification Schedule', 'Control when you receive notifications')}
                    <View className="bg-white rounded-lg mx-4 overflow-hidden shadow-sm">
                        <TouchableOpacity className="px-6 py-4 border-b border-gray-100 active:bg-gray-50">
                            <View className="flex-row items-center justify-between">
                                <View className="flex-1">
                                    <Text className="text-base font-medium text-gray-900">
                                        Quiet Hours
                                    </Text>
                                    <Text className="text-sm text-gray-500 mt-1">
                                        Set times when you don't want to receive notifications
                                    </Text>
                                </View>
                                <Ionicons name="chevron-forward" size={20} color="#9CA3AF" />
                            </View>
                        </TouchableOpacity>

                        <TouchableOpacity className="px-6 py-4 active:bg-gray-50">
                            <View className="flex-row items-center justify-between">
                                <View className="flex-1">
                                    <Text className="text-base font-medium text-gray-900">
                                        Frequency Settings
                                    </Text>
                                    <Text className="text-sm text-gray-500 mt-1">
                                        Choose how often you receive certain notifications
                                    </Text>
                                </View>
                                <Ionicons name="chevron-forward" size={20} color="#9CA3AF" />
                            </View>
                        </TouchableOpacity>
                    </View>
                </View>

                {/* Reset Section */}
                <View className="mt-8 px-4 pb-8">
                    <TouchableOpacity
                        onPress={() => {
                            // Reset all notifications to default
                            setPushNotifications(true);
                            setEmailNotifications(true);
                            setSmsNotifications(false);
                            setOrderUpdates(true);
                            setOrderDelivered(true);
                            setOrderCancelled(true);
                            setPromotions(true);
                            setNewProducts(false);
                            setWeeklyDeals(true);
                            setAppUpdates(true);
                            setSecurityAlerts(true);
                            setAccountActivity(true);
                        }}
                        className="bg-gray-100 border border-gray-200 rounded-lg px-6 py-4 active:bg-gray-200"
                    >
                        <View className="flex-row items-center justify-center">
                            <Ionicons name="refresh-outline" size={20} color="#6B7280" />
                            <Text className="text-gray-600 font-medium ml-2">
                                Reset to Default Settings
                            </Text>
                        </View>
                    </TouchableOpacity>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}