// app/(profile)/user-profile.tsx
import { View, Text, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import Header from "../../components/ui/Header";

export default function UserProfile() {
    const handleEditProfile = () => {
        router.push('/(profile)/edit-profile');
    };

    const handleSecurityPrivacy = () => {
        router.push('/(profile)/privacy-security');
    };

    const handleBillingPayments = () => {
        router.push('/(profile)/payment-methods');
    };

    return (
        <SafeAreaView className="flex-1 bg-gray-50">
            <Header title="User Profile" />

            <ScrollView className="flex-1">
                {/* Profile Avatar and Basic Info */}
                <View className="bg-white px-6 py-8 items-center">
                    {/* Profile Avatar */}
                    <View className="w-24 h-24 bg-primary rounded-full items-center justify-center border-4 border-primary mb-4">
                        <Ionicons name="person" size={36} color="white" />
                    </View>

                    {/* User Name and Status */}
                    <Text className="text-2xl font-bold text-gray-900 mb-1">User Name</Text>
                    <Text className="text-primary font-medium">Bronze Member</Text>
                </View>

                <View className='px-4'>
                    {/* Unlock Silver Badge */}
                    <View className="mx-6 mt-4 mb-6">
                        <View className="bg-white rounded-xl p-4 border border-gray-200">
                            <View className="flex-row items-center">
                                {/* Badge Icon */}
                                <View className="w-12 h-12 bg-primary rounded-xl items-center justify-center mr-4">
                                    <Ionicons name="star" size={24} color="white" />
                                </View>

                                {/* Badge Content */}
                                <View className="flex-1">
                                    <View className="flex-row items-center mb-1">
                                        <Text className="text-lg font-bold text-gray-900 mr-2">Unlock Silver</Text>
                                        <Ionicons name="lock-closed" size={16} color="#10B981" />
                                    </View>
                                    <Text className="text-sm text-gray-600 mb-2">
                                        Order three items, collect points and obtain your new batch and unlock more rewards.
                                    </Text>

                                    {/* Progress */}
                                    <View className="flex-row items-center">
                                        <View className="flex-1 bg-gray-200 rounded-full h-2 mr-3">
                                            <View className="bg-primary h-2 rounded-full" style={{ width: '30%' }} />
                                        </View>
                                        <View className="flex-row items-center">
                                            <Ionicons name="star-outline" size={14} color="#10B981" />
                                            <Text className="text-xs text-gray-600 ml-1">3.7 / 12</Text>
                                        </View>
                                    </View>
                                </View>
                            </View>
                        </View>
                    </View>

                    {/* User Details */}
                    <View className="mx-6 space-y-4">
                        <View className="bg-white rounded-xl p-4 mb-2 border border-gray-200">
                            <View className="flex-row justify-between items-center mb-6 pb-4 border-b border-gray-300">
                                <Text className="text-gray-600 font-medium">User name</Text>
                                <Text className="text-gray-900 font-medium">Sample User Name</Text>
                            </View>
                            <View className="flex-row justify-between items-center mb-6 pb-4 border-b border-gray-300">
                                <Text className="text-gray-600 font-medium">User Id</Text>
                                <Text className="text-gray-900 font-medium">0036347</Text>
                            </View>
                            <View className="flex-row justify-between items-center mb-6 pb-4 border-b border-gray-300">
                                <Text className="text-gray-600 font-medium">Billing address</Text>
                                <Text className="text-gray-900 font-medium">sample address</Text>
                            </View>
                            <View className="flex-row justify-between items-center pb-4 border-b border-gray-300">
                                <Text className="text-gray-600 font-medium">Payment method</Text>
                                <View className="flex-row items-center">
                                    <View className="w-4 h-3 bg-primary rounded mr-2" />
                                    <Text className="text-gray-900 font-medium">535927*****7015</Text>
                                </View>
                            </View>
                        </View>


                    </View>

                    {/* Action Buttons */}
                    <View className="mx-6 mt-8 mb-8 space-y-3">
                        <TouchableOpacity
                            onPress={handleEditProfile}
                            className="bg-white rounded-xl p-4 mb-2 border border-gray-200 active:bg-gray-50"
                        >
                            <View className="flex-row items-center justify-between">
                                <View className="flex-row items-center">
                                    <Ionicons name="person-outline" size={20} color="#10B981" />
                                    <Text className="text-primary font-medium ml-3">Edit customer profile</Text>
                                </View>
                                <Ionicons name="chevron-forward" size={16} color="#10B981" />
                            </View>
                        </TouchableOpacity>

                        <TouchableOpacity
                            onPress={handleSecurityPrivacy}
                            className="bg-white rounded-xl p-4 mb-2 border border-gray-200 active:bg-gray-50"
                        >
                            <View className="flex-row items-center justify-between">
                                <View className="flex-row items-center">
                                    <Ionicons name="shield-outline" size={20} color="#10B981" />
                                    <Text className="text-primary font-medium ml-3">Security and Privacy</Text>
                                </View>
                                <Ionicons name="chevron-forward" size={16} color="#10B981" />
                            </View>
                        </TouchableOpacity>

                        <TouchableOpacity
                            onPress={handleBillingPayments}
                            className="bg-white rounded-xl p-4 border border-gray-200 active:bg-gray-50"
                        >
                            <View className="flex-row items-center justify-between">
                                <View className="flex-row items-center">
                                    <Ionicons name="card-outline" size={20} color="#10B981" />
                                    <Text className="text-primary font-medium ml-3">Billing and Payments</Text>
                                </View>
                                <Ionicons name="chevron-forward" size={16} color="#10B981" />
                            </View>
                        </TouchableOpacity>
                    </View>
                </View>


            </ScrollView>
        </SafeAreaView>
    );
}